# Agentic AI Management

AI-powered management cycle optimizer that eliminates ambiguity in business reporting and drives data-driven decision-making.

## Overview

Agentic AI Management (formerly "neumann") is an Agentic AI product that accompanies the entire management cycle -- plan-vs-actual tracking, variance analysis, next-action definition, and reflection. It automatically detects ambiguity in weekly reports and management documents, prompts authors with targeted questions, and generates structured action plans to close performance gaps.

The product is part of the [Neural Organization](../../) ecosystem.

## Document Index

| Document | Description |
|---|---|
| [00_overview.md](00_overview.md) | WHY / WHO / WHAT / Project Status |
| [01_concept.md](01_concept.md) | Problem definition, Management Cycle, solution hypothesis, value proposition |
| [02_architecture.md](02_architecture.md) | 5-layer mapping (Neural Org), agent design, tech stack |
| [03_implementation.md](03_implementation.md) | Project structure, setup, dev workflow, deployment |
| [docs/](docs/) | Detailed documentation (vision, product specs, validation, business, decisions) |

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS |
| State | Zustand |
| Language | TypeScript 5.4 |
| AI | Claude API (Anthropic) |

## Project Structure

```
src/
├── app/          # Next.js App Router (pages + API routes)
├── components/   # Shared UI components
├── features/     # Feature modules (dashboard, editor, reports)
├── domain/       # Business logic core (audit, intervention, KPI)
├── services/     # External service integration (AI, Google, Notion)
├── lib/          # Utilities (theme, formatters)
├── store/        # State management (Zustand)
└── types/        # Shared type definitions
```

## Key Features

- **Ambiguity Detection Engine**: 5-pattern detection (fact/interpretation mixing, lack of quantification, unclear action, shallow analysis, missing coverage)
- **Management Cycle Support**: Plan-vs-actual tracking, variance analysis, next-action planning, reflection
- **Autonomous Intervention**: Proactive questioning before meetings, not reactive feedback after
- **Quality Scoring**: Quantified report quality with actionable improvement suggestions

## Current Phase

**Phase 1: Validation** -- Verifying problem and solution hypotheses (ambiguity detection PoC, CEO acceptance testing).

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run linter |
| `npm run type-check` | TypeScript type checking |

## License

Private
