import { Article, Category, Report } from "./types";

export const CATEGORIES: Category[] = [
  { id: "foundation-models", label: "Foundation Models", color: "text-blue-700 bg-blue-50 border-blue-200" },
  { id: "orchestration-agents", label: "Orchestration & Agents", color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  { id: "for-developers", label: "For Developers", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  { id: "image-generation", label: "Image Generation", color: "text-pink-700 bg-pink-50 border-pink-200" },
  { id: "video-production", label: "Video Production", color: "text-purple-700 bg-purple-50 border-purple-200" },
  { id: "audio-technology", label: "Audio Technology", color: "text-amber-700 bg-amber-50 border-amber-200" },
  { id: "vertical-ai-agents", label: "Vertical AI Agents", color: "text-cyan-700 bg-cyan-50 border-cyan-200" },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: "GPT-5 Preview: What to Expect in Q3",
    tag: "Foundation Models",
    impact: "High",
    relevanceScore: 98,
    sourceUrl: "https://example.com/gpt5",
    summary: "OpenAI hints at new reasoning capabilities and 10x reduced latency.",
    publishedAt: "2025-10-24T10:00:00Z",
  },
  {
    id: 2,
    title: "AutoGPT v2 Launches with Enterprise Security",
    tag: "Orchestration & Agents",
    impact: "Medium",
    relevanceScore: 85,
    sourceUrl: "https://example.com/autogpt",
    summary: "Autonomous agents now support SSO and role-based access control.",
    publishedAt: "2025-10-23T14:30:00Z",
  },
  {
    id: 3,
    title: "Midjourney API Finally Released",
    tag: "Image Generation",
    impact: "High",
    relevanceScore: 92,
    sourceUrl: "https://example.com/midjourney",
    summary: "Developers can now integrate Midjourney generation directly into apps.",
    publishedAt: "2025-10-22T09:15:00Z",
  },
  {
    id: 4,
    title: "Anthropic Claude 4.5 Opus Benchmarks",
    tag: "Foundation Models",
    impact: "High",
    relevanceScore: 95,
    sourceUrl: "https://example.com/claude",
    summary: "New model outperforms GPT-4o in coding and creative writing tasks.",
    publishedAt: "2025-10-25T08:00:00Z",
  },
  {
    id: 5,
    title: "Legal AI Agent Saves Firm $2M in Q1",
    tag: "Vertical AI Agents",
    impact: "Medium",
    relevanceScore: 88,
    sourceUrl: "https://example.com/legal-ai",
    summary: "Case study on how specialized agents are transforming legal discovery.",
    publishedAt: "2025-10-21T11:45:00Z",
  },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: "rep-001",
    title: "Weekly AI Strategic Briefing",
    week: "42",
    year: 2025,
    createdAt: "2025-10-26T09:00:00Z",
    content: `
# Executive Summary

This week's developments signal a major shift towards **autonomous agent orchestration** and **multimodal foundation models**. Key players like OpenAI and Anthropic are aggressively pushing down costs while increasing context windows, making enterprise adoption more viable than ever.

## Key Trends

### 1. Foundation Models
The "Context Window War" continues. New models are offering up to 10M tokens, allowing for entire codebases or legal archives to be processed in a single prompt. This changes the RAG (Retrieval Augmented Generation) landscape significantly.

### 2. Enterprise Agents
We are moving from "Chatbots" to "Action Bots". Tools that can execute complex workflows (e.g., "Book a meeting and prepare the briefing doc") are becoming reliable enough for C-suite usage.

## Actionable Insights
*   **Audit your current AI spend**: Token costs have dropped 40% in the last month. Renegotiate contracts.
*   **Pilot Agentic Workflows**: Start with internal HR or IT support tickets to test autonomous resolution.
    `,
  },
  {
    id: "rep-002",
    title: "Weekly AI Strategic Briefing",
    week: "41",
    year: 2025,
    createdAt: "2025-10-19T09:00:00Z",
    content: "Archive content for week 41...",
  },
];
