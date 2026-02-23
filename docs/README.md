# Neural Organization Documentation

This directory contains the complete design documentation for Neural Organization -- an organizational architecture for the AGI era where humans provide purpose and creativity while intelligence scales infinitely.

## Master Documents

| Document | Role | Lines | Est. Read Time |
|---|---|---|---|
| [concept.md](concept.md) | Vision, philosophy, and strategy | 482 | 25 min |
| [design.md](design.md) | Layer-by-layer detailed design with examples and models | 372 | 20 min |
| [framework.md](framework.md) | Framework master reference (5 layers + 4 crosscutting) | 320 | 15 min |
| [invariant-principles.md](invariant-principles.md) | Immutable axioms that constrain all design | 252 | 12 min |
| [agentic-ai-framework.md](agentic-ai-framework.md) | Reusable 8-step framework for building Agentic AI | 575 | 30 min |
| [ax-company-design.md](ax-company-design.md) | Sub-project alignment audit and integration roadmap | 570 | 30 min |

## Recommended Reading Order

### For New Readers

Start here to understand what Neural Organization is and why it exists.

1. **concept.md** -- Core thesis: organizations are being redefined by AGI
2. **framework.md** -- The 5-layer architecture at a glance
3. **invariant-principles.md** -- The 5 axioms that never change

### For Designers

Extend or modify the architecture with full context.

1. **concept.md** -- Understand the "why"
2. **design.md** -- Concrete models, examples, and interaction patterns
3. **philosophy/** -- Deep-dive into each layer and crosscutting element
4. **invariant-principles.md** -- Constraints you must not violate

### For Implementers

Build Agentic AI products that conform to Neural Organization.

1. **framework.md** -- Architecture overview
2. **design.md** -- Technical specifications per layer
3. **agentic-ai-framework.md** -- Step-by-step construction guide
4. **philosophy/** -- Reference as needed for specific layers

### For Strategic Leaders

Understand the business vision and organizational transformation.

1. **concept.md** (Sections 1-3) -- Paradigm shift and design principles
2. **ax-company-design.md** -- How sub-projects align and integrate
3. **agentic-ai-framework.md** (Section 1) -- The 8-step overview

## Subdirectories

### [philosophy/](philosophy/)

Detailed design philosophy for each of the 5 layers and 4 crosscutting elements. Contains 10 documents totaling ~7,100 lines. Read these when you need depth beyond what `design.md` provides.

### [decisions/](decisions/)

Architecture Decision Records (ADRs) documenting the evolution from initial product concept through 7-layer to 5-layer architecture. Contains 6 ADRs. Read these when you need to understand *why* a design choice was made.

### [hitl/](hitl/)

Human-in-the-Loop design documents. Defines what information to extract from humans at governance gates and the concrete question patterns for extraction. Contains 2 documents totaling ~1,000 lines.

## Document Reference Map

```
concept.md ◄──────────────────── invariant-principles.md
  │  "Vision & Strategy"              "Axioms"
  │
  ├──► design.md
  │      "Detailed Design"
  │        │
  │        └──► philosophy/ (10 files)
  │              "Deep Design Philosophy"
  │
  ├──► framework.md
  │      "Framework Reference"
  │
  ├──► agentic-ai-framework.md
  │      "Implementation Guide"
  │
  └──► ax-company-design.md
         "Alignment Audit"

decisions/ ──► Traces the evolution that shaped concept.md and design.md

hitl/ ──► Extends governance-design.md (philosophy/) with concrete HITL protocols
```

## Key Concepts Quick Reference

- **5 Layers**: Perception (L0) -> Understanding (L1) -> Reasoning (L2) -> Execution (L3) -> Reflection (L4)
- **4 Crosscutting Elements**: Purpose, Governance, Memory, Orchestration
- **6 Design Principles**: Intent over Instruction, Governance not Control, Ambient Presence, Radical Transparency, Agency Preservation, Mutual Evolution
- **5 Invariant Principles**: Capability Indirection, Memory Stratification, Dual Governance Filter, Reflective Closure, Purpose Primacy
