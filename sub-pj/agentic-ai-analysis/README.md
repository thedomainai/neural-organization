# Agentic AI Analysis

AI-powered data analysis cycle optimizer that automates the full workflow from question definition to decision support using specialized agents.

Part of the [Neural Organization](../../README.md) project, optimizing the **Analysis Cycle** (question definition through effect measurement).

> **Status: Planning phase** - No implementation exists yet. This project is currently in the design stage.

## What It Will Do

1. Accept analysis requests from humans or other Agentic AI systems
2. Structure business questions and prioritize by impact
3. Collect, integrate, and quality-check data from multiple sources
4. Perform exploratory analysis and statistical modeling
5. Extract actionable insights with quantified expected effects
6. Generate reports optimized for each stakeholder
7. Track prediction accuracy and continuously improve analysis methods

## Analysis Cycle

```
Question Definition -> Data Collection -> EDA -> Hypothesis Testing
       ^                                              |
       |                                              v
Effect Measurement <- Decision Support <- Insight Extraction
```

## Planned Tech Stack

- **Python 3.11+** / Statistical modeling / Data pipeline
- **Claude API** for question structuring and insight generation
- **PostgreSQL + pgvector** for analysis pattern library and quality rules
- **Redis** for working memory (in-progress analysis context)

## Documentation

| Document | Description |
|----------|-------------|
| [00_overview.md](00_overview.md) | WHY / WHO / WHAT / Project Status |
| [01_concept.md](01_concept.md) | Concept: Analysis Cycle definition, problem structure, design principles |
| [02_architecture.md](02_architecture.md) | Architecture: 5-layer mapping, agent composition plan |
| [docs/design-v2-analysis-cycle.md](docs/design-v2-analysis-cycle.md) | Full design: Analysis Cycle optimization with 8 agents |

## Roadmap

| Phase | Content | Status |
|-------|---------|--------|
| Phase 1 | Core analysis engine (Question + EDA + Report) | Planned |
| Phase 2 | Data quality + Statistical modeling | Planned |
| Phase 3 | Insight generation + Decision support | Planned |
| Phase 4 | Reflection + Continuous improvement | Planned |
| Phase 5 | Shared memory integration (neumann, agentic-ai-sales) | Planned |

## Related Projects

- **neumann**: KPI anomaly detection triggers analysis requests
- **agentic-ai-sales**: Win/Loss data feeds into factor analysis
- **ai-executive-dashboard**: Market trend data for external factor separation

## License

MIT
