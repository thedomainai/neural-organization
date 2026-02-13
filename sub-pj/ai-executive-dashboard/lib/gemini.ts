import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI features will not work.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Fast model for bulk operations (categorization, scoring)
export const flashModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Pro model for synthesis (executive summaries)
export const proModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const CATEGORIES = [
  "Foundation Models",
  "Orchestration & Agents",
  "For Developers",
  "Image Generation",
  "Video Production",
  "Audio Technology",
  "Vertical AI Agents",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface ArticleClassification {
  category: Category;
  summary: string;
  relevanceScore: number;
  impactLevel: "High" | "Medium" | "Low";
}

export async function classifyArticle(
  title: string,
  content: string
): Promise<ArticleClassification> {
  const prompt = `You are an AI news analyst for executives. Classify this article and provide analysis.

ARTICLE TITLE: ${title}

ARTICLE CONTENT:
${content.slice(0, 3000)}

AVAILABLE CATEGORIES:
${CATEGORIES.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Respond in JSON format only:
{
  "category": "one of the categories above",
  "summary": "2-3 sentence executive summary",
  "relevanceScore": 0-100 (how relevant to AI executives),
  "impactLevel": "High" | "Medium" | "Low"
}

Scoring guide:
- High impact: Major announcements, significant market shifts, new capabilities
- Medium impact: Notable updates, partnerships, research findings
- Low impact: Minor updates, opinion pieces, general news
- Relevance 80-100: Directly affects AI strategy decisions
- Relevance 50-79: Useful context for executives
- Relevance 0-49: General tech news, low executive relevance`;

  const result = await flashModel.generateContent(prompt);
  const text = result.response.text();

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to parse classification response");
  }

  const parsed = JSON.parse(jsonMatch[0]) as ArticleClassification;

  // Validate category
  if (!CATEGORIES.includes(parsed.category as Category)) {
    parsed.category = "Foundation Models"; // Default fallback
  }

  // Ensure valid ranges
  parsed.relevanceScore = Math.max(0, Math.min(100, parsed.relevanceScore));
  if (!["High", "Medium", "Low"].includes(parsed.impactLevel)) {
    parsed.impactLevel = "Medium";
  }

  return parsed;
}
