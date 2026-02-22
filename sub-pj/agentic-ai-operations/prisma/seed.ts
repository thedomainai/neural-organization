import { PrismaClient } from "../lib/generated/prisma";

const prisma = new PrismaClient();

const INITIAL_SOURCES = [
  {
    name: "TechCrunch AI",
    type: "rss",
    url: "https://techcrunch.com/category/artificial-intelligence/feed/",
    categoryHint: null,
  },
  {
    name: "The Verge AI",
    type: "rss",
    url: "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml",
    categoryHint: null,
  },
  {
    name: "MIT Technology Review AI",
    type: "rss",
    url: "https://www.technologyreview.com/topic/artificial-intelligence/feed",
    categoryHint: null,
  },
  {
    name: "VentureBeat AI",
    type: "rss",
    url: "https://venturebeat.com/category/ai/feed/",
    categoryHint: null,
  },
  {
    name: "OpenAI Blog",
    type: "blog",
    url: "https://openai.com/blog",
    categoryHint: "Foundation Models",
  },
  {
    name: "Anthropic News",
    type: "blog",
    url: "https://www.anthropic.com/news",
    categoryHint: "Foundation Models",
  },
  {
    name: "Google DeepMind Blog",
    type: "blog",
    url: "https://deepmind.google/blog",
    categoryHint: null,
  },
  {
    name: "Meta AI Blog",
    type: "blog",
    url: "https://ai.meta.com/blog/",
    categoryHint: null,
  },
  {
    name: "Hugging Face Blog",
    type: "blog",
    url: "https://huggingface.co/blog",
    categoryHint: "For Developers",
  },
];

async function main() {
  console.log("Seeding initial sources...");

  for (const source of INITIAL_SOURCES) {
    const existing = await prisma.source.findUnique({
      where: { url: source.url },
    });

    if (!existing) {
      await prisma.source.create({ data: source });
      console.log(`  Created: ${source.name}`);
    } else {
      console.log(`  Skipped (exists): ${source.name}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
