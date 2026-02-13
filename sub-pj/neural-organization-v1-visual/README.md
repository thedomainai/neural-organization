# Neural Organization

> Enterprise Architecture for the AI Era
> AI時代の企業アーキテクチャ

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## Overview

Neural Organization is a framework for building AI-augmented organizations that:
- **Remember** - Organizational memory persists through personnel changes
- **Strategize** - AI executes based on human-directed strategy
- **Learn** - Continuous improvement through human-AI feedback loops

## Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/neural-organization.git

# Open in browser
open index.html
```

Or simply open `index.html` in any modern browser.

## Project Structure

```
neural-organization/
├── README.md           # This file
├── index.html          # Main interactive visualization
├── card.html           # SNS OG card (1200x630)
└── docs/
    ├── concept.md      # Architecture concept document
    └── spec.md         # UI specification & variable reference
```

## Tech Stack

| Category | Technology |
|----------|------------|
| Styling | Tailwind CSS (CDN) |
| Fonts | Inter, Noto Sans JP |
| Icons | Inline SVG |
| Animation | CSS Transitions |

## Features

- **Bilingual Support** - Japanese/English toggle with localStorage persistence
- **Interactive Layer Stack** - Click layers to view detailed explanations
- **Responsive Design** - Mobile-friendly layout
- **Glass Morphism UI** - Modern dark theme with blur effects

## Architecture Layers

| Layer | Purpose |
|-------|---------|
| Input | Internal data collection |
| Memory | Organizational knowledge & context |
| Processing | Strategy planning & task execution |
| Evaluation | Quality assurance & feedback loops |
| Output | Deployment to external systems |

## Customization

See [`docs/spec.md`](docs/spec.md) for variable reference. To modify labels:

```
Example: Change "hero.title.main" to "Learning Organization"
```

## Development

No build step required. Edit HTML/CSS directly.

For local development with live reload:
```bash
npx live-server
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

**Neural Organization v1.0** — An organization that remembers, acts on strategy, and learns with people.
