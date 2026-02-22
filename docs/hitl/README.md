# HITL -- Human-in-the-Loop Design

This directory contains the detailed design for Human-in-the-Loop (HITL) interactions within Neural Organization. These documents define how the system extracts meaningful information from humans at governance gates, going beyond simple approve/reject patterns.

## Purpose

Neural Organization's Governance layer defines *where* human gates exist. The HITL documents define *what happens* at those gates -- specifically, how to transform each human interaction into a learning opportunity that improves organizational intelligence.

The core insight: "approve/reject" gates waste the most valuable resource in the system -- human tacit knowledge. These documents redesign every gate to actively extract that knowledge.

## Documents

| Document | Role | Lines | Est. Read Time |
|---|---|---|---|
| [information-requirements.md](information-requirements.md) | Defines *what information* to extract at each HITL gate | 424 | 20 min |
| [extraction-patterns.md](extraction-patterns.md) | Defines *how* to extract it -- question patterns, scaffolding, and validation | 618 | 30 min |

### Reading Order

Read in sequence:

1. **information-requirements.md** -- Understand the problem (why "approve/reject" is insufficient) and the information taxonomy for each gate
2. **extraction-patterns.md** -- Understand the solution (10 extraction patterns and their application to specific gates)

## Relationship to Other Documents

```
governance-design.md (philosophy/)
  "Where are the human gates?"
       │
       └──► hitl/ (this directory)
              "What happens at each gate?"

layer4-reflection-design.md (philosophy/)
  "How does the system learn from outcomes?"
       │
       └──► hitl/ (this directory)
              "How does the system learn from human input?"
```

- **governance-design.md** defines the 27 governance gates and Trust Score mechanics. HITL documents extend these gates with information extraction protocols.
- **layer4-reflection-design.md** defines how Reflection learns from action outcomes. HITL documents complement this by defining how to learn from human interactions.
- **design.md** Section 2.2 (Governance) provides the Trust Score formula and autonomy levels that determine when HITL gates activate.

## Total Scope

- 2 documents
- ~1,042 lines
- Estimated total read time: ~50 min
