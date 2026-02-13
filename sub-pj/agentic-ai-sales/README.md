# Sales Presentation Automator

AI-powered sales presentation generator CLI tool.

## Overview

Generate professional sales presentation slides automatically using AI (Claude API). The tool collects customer information and deal context, then generates tailored presentation content in PowerPoint format.

## Features (Phase 1 MVP)

- Interactive CLI for customer and deal information input
- AI-powered slide content generation using Claude API
- PPTX output with basic styling
- Support for "New Business 1st Meeting" scenario (SPIN framework)

## Installation

### Prerequisites

- Python 3.11 or higher
- Anthropic API key

### Setup

```bash
# Clone the repository
git clone https://github.com/thedomainai/agentic-ai-sales.git
cd agentic-ai-sales

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -e .

# Set API key
export ANTHROPIC_API_KEY="your-api-key-here"
```

## Usage

```bash
# Run the CLI
spa

# Specify output directory
spa --output-dir ./presentations
```

### Interactive Flow

1. Enter customer information:
   - Company name
   - Industry
   - Company size

2. Enter deal context:
   - Presentation type
   - Goal
   - Duration
   - Pain hypothesis

3. Review and confirm

4. Generated PPTX file will be saved to the output directory

## Project Structure

```
agentic-ai-sales/
├── src/spa/
│   ├── cli.py           # CLI interface
│   ├── models.py        # Data models
│   ├── llm_client.py    # Claude API integration
│   └── pptx_generator.py # PowerPoint generation
├── data/
│   └── prompts/         # Prompt templates
├── config/
│   └── settings.yaml    # Configuration
├── tests/               # Test files
└── docs/                # Documentation
```

## Development

```bash
# Install with dev dependencies
pip install -e ".[dev]"

# Run tests
pytest

# Lint
ruff check .

# Type check
mypy src/
```

## Roadmap

- **Phase 1** (Current): Basic CLI with single scenario
- **Phase 2**: Multiple scenarios and story frameworks
- **Phase 3**: Learning from successful patterns
- **Phase 4**: External data source integration

## License

MIT
