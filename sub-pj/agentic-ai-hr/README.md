# HR Policy Advisor

AI-powered HR policy design advisor with Human-in-the-Loop approval workflows.

## Overview

HR Policy Advisor is a multi-agent system that helps organizations design HR policies (grading, evaluation, and compensation systems) through AI-human collaboration. It is part of the [Neural Organization](../../docs/concept.md) ecosystem and aligns with its 5-layer architecture.

## Documentation

| Document | Description |
|---|---|
| [00_overview.md](00_overview.md) | Project overview: WHY, WHO, WHAT, status |
| [01_concept.md](01_concept.md) | People Cycle, problem structure, concept design |
| [02_architecture.md](02_architecture.md) | 5-layer mapping, agent composition, HITL workflow |
| [03_implementation.md](03_implementation.md) | Tech stack, setup, API reference, deployment |
| [docs/](docs/) | Detailed design documents |

## Tech Stack

- **Language**: Python 3.11+
- **Framework**: FastAPI
- **AI/LLM**: Google Generative AI (Gemini)
- **Message Queue**: RabbitMQ
- **Cache/State**: Redis
- **Database**: PostgreSQL
- **Secrets**: HashiCorp Vault

## Quick Start

```bash
# Clone and configure
cp .env.example .env
# Edit .env to set GEMINI_API_KEY

# Install dependencies
pip install -e ".[dev]"

# Start infrastructure
docker-compose up -d redis rabbitmq postgres vault

# Run the application
uvicorn src.main:app --host 0.0.0.0 --port 8000 --reload
```

## Agent Architecture

The system uses 5 specialized agents that execute sequentially:

1. **ContextCollector** - Gathers company information and context
2. **TalentProfileGenerator** - Designs ideal talent profiles
3. **GradingDesigner** - Creates grading/grade systems with competencies
4. **EvaluationDesigner** - Designs evaluation frameworks
5. **CompensationDesigner** - Builds compensation structures

Each agent produces output that requires Human-in-the-Loop approval before proceeding to the next step.

## Development

```bash
# Run tests
pytest tests/ -v

# Lint
ruff check src/ tests/

# Type check
mypy src/
```

## Related Projects

| Project | Relationship |
|---|---|
| **agentic-ai-hr-system** | HR definition layer (Single Source of Truth for grades, competencies, evaluation criteria) |
| **neumann** | Consumes grading/competency definitions for report quality management |
| **ai-executive-dashboard** | Consumes evaluation data for organizational capability reporting |

## License

MIT
