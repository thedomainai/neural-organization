# Decisions -- Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) that document the evolution of Neural Organization's design. Each record captures a specific design question, the alternatives considered, and the rationale for the chosen direction.

## Purpose

These ADRs serve as the institutional memory of *why* the architecture looks the way it does. They are not required reading for understanding the current design -- `concept.md` and `design.md` provide that. Instead, read these when you need to understand the reasoning behind a specific design choice or want to avoid revisiting already-resolved questions.

## Evolution Story

The 6 ADRs trace a coherent evolution from initial product concept to the current architecture:

### Phase 1: Concept Formation (ADR 001-002)

| ADR | Title | Key Question |
|---|---|---|
| [001](001-product-concept-design.md) | Product Concept Design | How should the product architecture, features, and go-to-market be structured? |
| [002](002-agi-era-concept-reconstruction.md) | AGI-Era Concept Reconstruction | Starting from zero bias, what should Neural Organization be in the AGI era? |

ADR 001 established the initial product concept. ADR 002 challenged every assumption by asking "what if we start from AGI-era first principles?" -- leading to the paradigm shift from "AI tools for organizations" to "the next form of organization itself."

### Phase 2: Architecture Design (ADR 003-004)

| ADR | Title | Key Question |
|---|---|---|
| [003](003-seven-layer-intelligence-architecture.md) | 7-Layer Intelligence Architecture `[ARCHIVED]` | How should the data-to-output transformation pipeline be designed? |
| [004](004-five-layer-consolidation.md) | 5-Layer Consolidation `[ARCHIVED]` | Can the 7 layers be consolidated without losing expressiveness? |

ADR 003 designed a 7-layer pipeline. ADR 004 identified redundancies (Integration/Perception, Reasoning/Composition) and consolidated into the current **5 layers + 4 crosscutting elements** architecture.

### Phase 3: Design Maturation (ADR 005-006)

| ADR | Title | Key Question |
|---|---|---|
| [005](005-v1-design-integration.md) | v1 Design Integration `[ARCHIVED]` | Which v1.0 design elements should be carried into v2.0? |
| [006](006-agent-orchestration-insights-integration.md) | Agent Orchestration Insights Integration | What insights from the agent-orchestration project should be integrated? |

ADR 005 reconciled v1.0's concrete operational designs with v2.0's principled architecture. ADR 006 integrated cross-project insights, confirming that Neural Organization's principles have universal applicability beyond organizational design.

## Reading Guide

- **First-time readers**: Skip this directory entirely. Start with `concept.md` and `design.md`.
- **Designers extending the architecture**: Read ADR 002 (the paradigm shift) and ADR 004 (why 5 layers) to understand the constraints.
- **Those questioning a design choice**: Find the relevant ADR by topic. Each ADR's "Question" section maps to a specific design decision.
- **New ADR authors**: Follow the existing format (Question, Issues, Issue Decomposition, Resolution) to maintain consistency.

## Status Legend

- **No tag**: Active decision, still reflects current design
- **`[ARCHIVED]`**: Decision has been superseded or fully integrated into master documents. Kept for historical reference.

## Total Scope

- 6 ADRs
- ~892 lines
- Estimated total read time: ~45 min
