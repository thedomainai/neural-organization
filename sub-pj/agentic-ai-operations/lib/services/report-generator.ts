import { prisma } from "../db";
import { proModel, CATEGORIES, type Category } from "../gemini";

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

interface CategorySummary {
  category: Category;
  count: number;
  summary: string;
  keyDevelopments: string[];
}

async function generateCategorySummary(
  category: Category,
  articles: { title: string; summary: string; impactLevel: string }[]
): Promise<CategorySummary> {
  if (articles.length === 0) {
    return {
      category,
      count: 0,
      summary: "No significant developments this week.",
      keyDevelopments: [],
    };
  }

  const prompt = `Analyze these ${category} articles and provide a trend summary for executives.

ARTICLES:
${articles.map((a, i) => `${i + 1}. [${a.impactLevel}] ${a.title}\n   ${a.summary}`).join("\n\n")}

Respond in JSON format:
{
  "summary": "2-3 sentence trend analysis for this category",
  "keyDevelopments": ["key point 1", "key point 2", "key point 3"]
}`;

  const result = await proModel.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      category,
      count: articles.length,
      summary: "Analysis unavailable.",
      keyDevelopments: [],
    };
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    category,
    count: articles.length,
    summary: parsed.summary || "Analysis unavailable.",
    keyDevelopments: parsed.keyDevelopments || [],
  };
}

async function generateExecutiveSummary(
  categorySummaries: CategorySummary[],
  totalArticles: number
): Promise<{ summary: string; actionableInsights: string[] }> {
  const summaryText = categorySummaries
    .filter((cs) => cs.count > 0)
    .map((cs) => `**${cs.category}** (${cs.count} articles): ${cs.summary}`)
    .join("\n\n");

  const prompt = `You are an executive AI strategist. Based on this week's AI news analysis, provide an executive summary and actionable insights.

CATEGORY SUMMARIES:
${summaryText}

TOTAL ARTICLES ANALYZED: ${totalArticles}

Respond in JSON format:
{
  "executiveSummary": "200-300 word high-level overview synthesizing all trends",
  "actionableInsights": [
    "Insight 1: actionable recommendation",
    "Insight 2: actionable recommendation",
    "Insight 3: actionable recommendation"
  ]
}`;

  const result = await proModel.generateContent(prompt);
  const text = result.response.text();

  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return {
      summary: "Executive summary generation failed.",
      actionableInsights: [],
    };
  }

  const parsed = JSON.parse(jsonMatch[0]);
  return {
    summary: parsed.executiveSummary || "Summary unavailable.",
    actionableInsights: parsed.actionableInsights || [],
  };
}

export async function generateWeeklyReport(
  week?: number,
  year?: number
): Promise<{ reportId: string }> {
  const now = new Date();
  const targetWeek = week ?? getWeekNumber(now);
  const targetYear = year ?? now.getFullYear();

  // Calculate date range for the week
  const startOfWeek = new Date(targetYear, 0, 1 + (targetWeek - 1) * 7);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  // Fetch articles from the week
  const articles = await prisma.article.findMany({
    where: {
      publishedAt: {
        gte: startOfWeek,
        lt: endOfWeek,
      },
      relevanceScore: { gte: 60 },
    },
    orderBy: [{ relevanceScore: "desc" }, { publishedAt: "desc" }],
    take: 100,
  });

  // Group by category
  const articlesByCategory = new Map<Category, typeof articles>();
  for (const category of CATEGORIES) {
    articlesByCategory.set(category, []);
  }
  for (const article of articles) {
    const category = article.category as Category;
    if (articlesByCategory.has(category)) {
      articlesByCategory.get(category)!.push(article);
    }
  }

  // Generate category summaries
  const categorySummaries: CategorySummary[] = [];
  for (const [category, categoryArticles] of articlesByCategory) {
    const topArticles = categoryArticles.slice(0, 10).map((a: typeof categoryArticles[number]) => ({
      title: a.title,
      summary: a.summary,
      impactLevel: a.impactLevel,
    }));
    const summary = await generateCategorySummary(category, topArticles);
    categorySummaries.push(summary);
  }

  // Generate executive summary
  const { summary: executiveSummary, actionableInsights } =
    await generateExecutiveSummary(categorySummaries, articles.length);

  // Build markdown content
  const content = buildReportMarkdown(
    targetWeek,
    targetYear,
    executiveSummary,
    categorySummaries,
    actionableInsights,
    articles
  );

  // Category breakdown for metadata
  const categoryBreakdown: Record<string, number> = {};
  for (const cs of categorySummaries) {
    categoryBreakdown[cs.category] = cs.count;
  }

  // Check for existing report
  const existing = await prisma.report.findUnique({
    where: { week_year: { week: targetWeek, year: targetYear } },
  });

  let report;
  if (existing) {
    report = await prisma.report.update({
      where: { id: existing.id },
      data: {
        content,
        articleCount: articles.length,
        categoryBreakdown,
        version: { increment: 1 },
        generatedAt: new Date(),
      },
    });
  } else {
    report = await prisma.report.create({
      data: {
        title: "Weekly AI Strategic Briefing",
        week: targetWeek,
        year: targetYear,
        content,
        articleCount: articles.length,
        categoryBreakdown,
      },
    });
  }

  // Link articles to report
  await prisma.reportArticle.deleteMany({ where: { reportId: report.id } });
  await prisma.reportArticle.createMany({
    data: articles.slice(0, 50).map((a: typeof articles[number]) => ({
      reportId: report.id,
      articleId: a.id,
    })),
  });

  return { reportId: report.id };
}

function buildReportMarkdown(
  week: number,
  year: number,
  executiveSummary: string,
  categorySummaries: CategorySummary[],
  actionableInsights: string[],
  articles: { title: string; sourceUrl: string }[]
): string {
  const categorySections = categorySummaries
    .filter((cs) => cs.count > 0)
    .map(
      (cs) => `### ${cs.category}
${cs.summary}

${cs.keyDevelopments.map((d) => `- ${d}`).join("\n")}`
    )
    .join("\n\n");

  const insights = actionableInsights
    .map((insight, i) => `${i + 1}. **${insight}**`)
    .join("\n");

  const sources = articles
    .slice(0, 10)
    .map((a) => `- [${a.title}](${a.sourceUrl})`)
    .join("\n");

  return `# Executive Summary

${executiveSummary}

## Key Trends

${categorySections}

## Actionable Insights

${insights}

## Source References

${sources}

---
*Generated by Domain AI Engine | Week ${week} / ${year}*`;
}
