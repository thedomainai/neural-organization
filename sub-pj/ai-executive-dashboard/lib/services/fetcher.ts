import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { prisma } from "../db";
import { classifyArticle } from "../gemini";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "AI-Executive-Dashboard/1.0",
  },
});

export interface FetchResult {
  sourceId: string;
  sourceName: string;
  fetched: number;
  processed: number;
  errors: string[];
}

async function fetchRSS(url: string): Promise<Parser.Item[]> {
  const feed = await parser.parseURL(url);
  return feed.items || [];
}

async function fetchBlogPage(url: string): Promise<{ title: string; link: string; content: string; pubDate?: string }[]> {
  const response = await fetch(url, {
    headers: { "User-Agent": "AI-Executive-Dashboard/1.0" },
  });
  const html = await response.text();
  const $ = cheerio.load(html);

  const articles: { title: string; link: string; content: string; pubDate?: string }[] = [];

  // Generic blog article selectors
  $("article, .post, .blog-post, [class*='article']").each((_, el) => {
    const $el = $(el);
    const title = $el.find("h1, h2, h3, [class*='title']").first().text().trim();
    const link = $el.find("a").first().attr("href");
    const content = $el.find("p, [class*='excerpt'], [class*='summary']").first().text().trim();

    if (title && link) {
      articles.push({
        title,
        link: link.startsWith("http") ? link : new URL(link, url).href,
        content: content || title,
      });
    }
  });

  return articles.slice(0, 10); // Limit to 10 articles per blog
}

export async function fetchSource(sourceId: string): Promise<FetchResult> {
  const source = await prisma.source.findUnique({ where: { id: sourceId } });

  if (!source) {
    throw new Error(`Source not found: ${sourceId}`);
  }

  const result: FetchResult = {
    sourceId: source.id,
    sourceName: source.name,
    fetched: 0,
    processed: 0,
    errors: [],
  };

  try {
    let items: { title: string; link: string; content: string; pubDate?: string }[] = [];

    if (source.type === "rss") {
      const rssItems = await fetchRSS(source.url);
      items = rssItems.map((item) => ({
        title: item.title || "Untitled",
        link: item.link || "",
        content: item.contentSnippet || item.content || item.title || "",
        pubDate: item.pubDate || item.isoDate,
      }));
    } else if (source.type === "blog") {
      items = await fetchBlogPage(source.url);
    }

    result.fetched = items.length;

    for (const item of items) {
      if (!item.link) continue;

      // Check for duplicates
      const existing = await prisma.article.findUnique({
        where: { sourceUrl: item.link },
      });

      if (existing) continue;

      try {
        // Classify with Gemini
        const classification = await classifyArticle(item.title, item.content);

        // Save to database
        await prisma.article.create({
          data: {
            title: item.title,
            summary: classification.summary,
            content: item.content,
            sourceUrl: item.link,
            sourceId: source.id,
            category: classification.category,
            impactLevel: classification.impactLevel,
            relevanceScore: classification.relevanceScore,
            publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          },
        });

        result.processed++;
      } catch (err) {
        result.errors.push(`Failed to process "${item.title}": ${err instanceof Error ? err.message : "Unknown error"}`);
      }
    }

    // Update source last fetched time
    await prisma.source.update({
      where: { id: source.id },
      data: {
        lastFetchedAt: new Date(),
        failureCount: 0,
      },
    });
  } catch (err) {
    // Increment failure count
    await prisma.source.update({
      where: { id: source.id },
      data: {
        failureCount: { increment: 1 },
      },
    });

    result.errors.push(`Source fetch failed: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  return result;
}

export async function fetchAllSources(): Promise<FetchResult[]> {
  const sources = await prisma.source.findMany({
    where: {
      enabled: true,
      OR: [
        { lastFetchedAt: null },
        {
          lastFetchedAt: {
            lt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          },
        },
      ],
    },
  });

  const results: FetchResult[] = [];

  for (const source of sources) {
    const result = await fetchSource(source.id);
    results.push(result);
  }

  return results;
}
