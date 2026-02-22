# Agentic AI Operations

AI-powered business intelligence platform that automates the collection, classification, and synthesis of industry news into executive-grade strategic briefings.

## Status

**PoC (Proof of Concept)** - This project validates the core Operations Cycle: automated data ingestion, AI-driven classification, and report generation.

## Overview

Agentic AI Operations (formerly AI Executive Dashboard) is a Next.js application that:

- **Ingests** articles from RSS feeds and blog pages
- **Classifies** content using Google Gemini AI (category, impact level, relevance score)
- **Generates** weekly strategic briefing reports with executive summaries and actionable insights
- **Displays** a dashboard with live feed, report viewer, and deep research console

## Document Index

| Document | Description |
|---|---|
| [00_overview.md](00_overview.md) | Project overview: WHY / WHO / WHAT |
| [01_concept.md](01_concept.md) | Operations Cycle definition and design principles |
| [02_architecture.md](02_architecture.md) | System architecture and 5-layer mapping |
| [03_implementation.md](03_implementation.md) | Tech stack, setup, API reference |

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 15.1 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL + Prisma 7.3 |
| AI | Google Generative AI (Gemini 1.5 Flash / Pro) |
| Styling | Tailwind CSS 4 |
| UI Components | Radix UI, Lucide Icons |
| Data Ingestion | rss-parser, cheerio |
| Linter | Biome 2.3 |

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL, GEMINI_API_KEY, ADMIN_API_KEY

# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:push

# Start development server (port 3007)
npm run dev
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/articles` | Public | List articles with filters |
| `POST` | `/api/ingest` | Admin | Trigger RSS/blog ingestion |
| `GET` | `/api/reports` | Public | List published reports |
| `GET` | `/api/reports/:id` | Public | Get report detail |
| `POST` | `/api/reports/generate` | Admin | Generate weekly report |
| `GET` | `/api/admin/sources` | Admin | List configured sources |
| `POST` | `/api/admin/sources` | Admin | Add a new source |
| `PATCH` | `/api/admin/sources/:id` | Admin | Update a source |
| `DELETE` | `/api/admin/sources/:id` | Admin | Delete a source |

## Neural Organization

This project is part of the [Neural Organization](../../README.md) initiative. It serves as the **Operations** sub-project, focusing on business intelligence and strategic monitoring through the Operations Cycle.

## License

Private - The Domain AI
