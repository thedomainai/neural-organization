# Sales Presentation Automator

AI-powered sales presentation generator that automates PPTX creation using Claude API and the SPIN selling framework.

Part of the [Neural Organization](../../README.md) project, optimizing the **Revenue Cycle** (lead acquisition through customer success).

## Quick Start

```bash
# Setup
python -m venv .venv && source .venv/bin/activate
pip install -e .
export ANTHROPIC_API_KEY="your-key"

# Run
spa
spa --output-dir ./presentations
```

## What It Does

1. Collect customer info (company, industry, size) via interactive CLI
2. Collect deal context (goal, duration, pain hypothesis)
3. Generate 7-slide SPIN presentation using Claude API
4. Output as PPTX file

## Tech Stack

- **Python 3.11+** / Click (CLI) / Pydantic (models)
- **Claude API** (claude-3-5-sonnet) for content generation
- **python-pptx** for PowerPoint output

## Project Structure

```
src/spa/
  cli.py              # CLI entry point
  models.py           # Data models (Pydantic)
  llm_client.py       # Claude API client
  pptx_generator.py   # PPTX generation engine
```

## Development

```bash
pip install -e ".[dev]"
pytest
ruff check .
mypy src/
```

## Documentation

| Document | Description |
|----------|-------------|
| [00_overview.md](00_overview.md) | WHY / WHO / WHAT / Project Status |
| [01_concept.md](01_concept.md) | Concept: Revenue Cycle, inputs/outputs, constraints, feedback loops |
| [02_architecture.md](02_architecture.md) | Architecture: 5-layer mapping, agents, MCP design |
| [03_implementation.md](03_implementation.md) | Implementation: setup, usage, testing, data sources |
| [docs/design-v2-revenue-cycle.md](docs/design-v2-revenue-cycle.md) | V2 design: full Revenue Cycle optimization |

## Roadmap

- **Phase 1** (Current): SPIN framework, single scenario, PPTX output
- **Phase 2**: Multiple scenarios and story frameworks
- **Phase 3**: Win/loss pattern learning and feedback
- **Phase 4**: External data source integration (CRM, company DB)
- **V2**: Full Revenue Cycle optimization with 10 specialized agents

## License

MIT
