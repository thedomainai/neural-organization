# Philosophy -- Detailed Design Documents

This directory contains the detailed design philosophy for each layer and crosscutting element of Neural Organization. These documents go deeper than [design.md](../design.md), exploring the "why" behind each design decision, interaction patterns, and edge cases.

## Purpose

While `concept.md` defines the vision and `design.md` provides concrete specifications, the philosophy documents explore each element's fundamental nature, design tensions, and resolution strategies. They are the authoritative source for understanding *why* each element works the way it does.

## Documents

### Stage 1: Foundation Concepts

Start here. These crosscutting elements shape every layer.

| Document | Element | Lines | Est. Read Time |
|---|---|---|---|
| [purpose-design.md](purpose-design.md) | Purpose (WHY) | 651 | 30 min |
| [governance-design.md](governance-design.md) | Governance (WHO) | 776 | 35 min |
| [memory-design.md](memory-design.md) | Memory (WHAT is remembered) | 586 | 25 min |
| [orchestration-design.md](orchestration-design.md) | Orchestration (HOW to coordinate) | 953 | 45 min |

### Stage 2: Layer-by-Layer Detail

Each layer's detailed design, building on the foundation.

| Document | Layer | Lines | Est. Read Time |
|---|---|---|---|
| [tool-integration-design.md](tool-integration-design.md) | L0: Perception | 389 | 20 min |
| [layer1-understanding-design.md](layer1-understanding-design.md) | L1: Understanding | 691 | 30 min |
| [layer2-reasoning-design.md](layer2-reasoning-design.md) | L2: Reasoning | 771 | 35 min |
| [layer3-execution-design.md](layer3-execution-design.md) | L3: Execution | 927 | 45 min |
| [layer4-reflection-design.md](layer4-reflection-design.md) | L4: Reflection | 707 | 30 min |

### Stage 3: Integration Design

How humans interact with the system across all layers.

| Document | Element | Lines | Est. Read Time |
|---|---|---|---|
| [interface-design.md](interface-design.md) | Human-System Interface | 708 | 30 min |

## Recommended Reading Order

For a complete understanding, read in the stage order above:

1. **Stage 1** -- Understand the crosscutting forces (Purpose, Governance, Memory, Orchestration) that shape every layer
2. **Stage 2** -- Walk through each layer from Perception (L0) to Reflection (L4) to see how data flows and transforms
3. **Stage 3** -- Understand how humans participate across all layers through the Interface

For targeted reading, jump directly to the element you need.

## Relationship to Other Documents

```
concept.md          -- "What is Neural Organization?"
  │
  └──► design.md    -- "How does each element work?"
         │
         └──► philosophy/  (this directory)
                           -- "Why does each element work this way?"
```

- **design.md** references each philosophy document with `> 詳細: [philosophy/xxx-design.md]` links
- **agentic-ai-framework.md** applies these design philosophies to concrete implementation steps
- **hitl/** extends `governance-design.md` and `layer4-reflection-design.md` with concrete HITL protocols

## Total Scope

- 10 documents
- ~7,159 lines
- Estimated total read time: ~5.5 hours
