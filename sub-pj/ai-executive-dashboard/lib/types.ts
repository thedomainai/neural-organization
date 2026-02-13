export interface Category {
  id: string;
  label: string;
  color: string;
}

export interface Article {
  id: number;
  title: string;
  tag: string;
  impact: "High" | "Medium" | "Low";
  relevanceScore: number;
  sourceUrl: string;
  summary: string;
  publishedAt: string;
}

export interface Report {
  id: string;
  title: string;
  week: string;
  year: number;
  content: string; // Markdown or HTML
  createdAt: string;
}

export interface ResearchTask {
  id: string;
  query: string;
  status: "pending" | "processing" | "completed" | "failed";
  result?: string;
}
