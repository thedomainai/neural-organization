# Evolutionary Layered Architecture

> 3-Layer Model — Theory, Practice, Evolution

---

## Architecture Philosophy

The Claude Code Orchestra is built on a **three-layer separation of concerns**:

```
┌─────────────────────────────────────────────────┐
│  Layer 3: Self-Evolutionary Engine              │
│  Runtime observation → Config optimization      │
├─────────────────────────────────────────────────┤
│  Layer 2: Practical Realization                 │
│  Current tool bindings → Concrete execution     │
├─────────────────────────────────────────────────┤
│  Layer 1: Invariant Theory                      │
│  Orchestration principles → Tool-agnostic logic │
└─────────────────────────────────────────────────┘
```

---

## Layer 1: Invariant Theory

> Like a **constitution** — never changes regardless of tool landscape

### Purpose
Defines the fundamental logic of orchestration that holds true regardless of which tools exist.

### Components
- **5 Axioms** — Foundational principles (see [02-five-axioms.md](./02-five-axioms.md))
- **7 Invariants** — Unchanging orchestration rules
- **Capability Taxonomy** — Abstract capability definitions

### Characteristics
- **Tool-agnostic** — No mention of specific tools or APIs
- **Timeless** — Remains valid even as technology evolves
- **Foundational** — All other layers derive from this

### Example
```
Axiom A1: Capability Primacy
"Delegation decisions must be expressed in terms of capability
requirements, never tool names"
```

This axiom holds whether you're using Claude, GPT, Gemini, or future models.

---

## Layer 2: Practical Realization

> Like **legislation** — changes when tools change

### Purpose
Concrete binding to current state-of-the-art tools. Validates that Layer 1 theory works in practice.

### Components

| Component | Description |
|-----------|-------------|
| **Capability Registry** | Maps capabilities to current tools |
| **Intent Classifier** | Categorizes user requests into capability needs |
| **Trace Schema** | Logs execution for analysis |
| **Context Budget** | Manages orchestrator context limits |

### Example Capability Registry

```json
{
  "capability": "C3_DeepReasoning",
  "current_binding": {
    "tool": "codex_cli",
    "model": "gpt-5.2-codex",
    "priority": 1,
    "fallback": "claude_code"
  },
  "last_updated": "2026-02-19",
  "performance_metrics": {
    "success_rate": 0.94,
    "avg_latency_ms": 3200,
    "cost_per_use": 0.12
  }
}
```

### Characteristics
- **Tool-specific** — References actual tools and APIs
- **Mutable** — Updated when better tools emerge
- **Measurable** — Tracks performance metrics

---

## Layer 3: Self-Evolutionary Engine

> Like a **judiciary** — observes reality and amends legislation accordingly

### Purpose
Analyzes execution traces and automatically refines Layer 2 configuration based on observed performance.

### Components

| Component | Responsibility |
|-----------|---------------|
| **Trace Analyzer** | Extracts patterns from execution logs |
| **Proposal Generator** | Suggests config changes with rationale |
| **Auto-Rollback** | Reverts changes if performance degrades |
| **Trust Gradient** | Increases autonomy as confidence grows |

### Evolution Cycle

```
┌──────────────┐
│ 1. Collect   │  Accumulate 20+ delegation events per capability
│    Traces    │
└──────┬───────┘
       ↓
┌──────────────┐
│ 2. Analyze   │  Success rate, latency, cost, fallback frequency
│    Patterns  │
└──────┬───────┘
       ↓
┌──────────────┐
│ 3. Generate  │  Config change proposal with evidence
│    Proposal  │
└──────┬───────┘
       ↓
┌──────────────┐
│ 4. Review    │  Human approval (based on trust level)
│    (Human)   │
└──────┬───────┘
       ↓
┌──────────────┐
│ 5. Apply     │  Update registry, log history, reset counters
│    Change    │
└──────┬───────┘
       ↓
┌──────────────┐
│ 6. Observe   │  Compare pre/post metrics, auto-rollback on degradation
│    Impact    │
└──────────────┘
```

### Trust Gradient

Evolution autonomy increases over time:

| Trust Level | Human Approval Required | Conditions |
|-------------|------------------------|------------|
| **Level 1** | Yes (every change) | Default for new deployments |
| **Level 2** | Yes (high-impact only) | After 10 successful approved changes |
| **Level 3** | No (auto-apply) | After 50 successful changes, no rollbacks |

### Auto-Rollback Triggers

The system automatically reverts config changes if:
- Success rate drops >5% from baseline
- Average latency increases >20%
- Cost per use increases >30%
- Fallback frequency increases >2x

---

## Why Three Layers?

### Analogy: Constitutional Democracy

| Layer | Government Analogy | Change Frequency | Authority |
|-------|-------------------|------------------|-----------|
| Layer 1 | Constitution | Never / Extremely rare | Highest |
| Layer 2 | Legislation | When needed | Medium |
| Layer 3 | Judiciary | Continuously | Advisory → Autonomous |

### Benefits

1. **Stability** — Core principles never change
2. **Adaptability** — Concrete bindings evolve with tools
3. **Self-improvement** — System learns from experience
4. **Clear separation** — Each layer has distinct responsibility

### Without This Separation

```
❌ Monolithic Config
   └─ Tool names hardcoded in orchestration logic
   └─ Changing tools requires rewriting logic
   └─ No systematic way to optimize over time
   └─ Tool-specific bugs pollute core logic
```

### With This Separation

```
✅ Layered Architecture
   └─ Layer 1: Logic independent of tools
   └─ Layer 2: Tools referenced only in registry
   └─ Layer 3: Continuous optimization
   └─ Tool changes = registry update, logic unchanged
```

---

## Orchestration Pipeline

The three layers work together in the following pipeline:

```
User Request
    ↓
┌─────────────────────────────────────┐
│ Classify (Layer 1 + Layer 2)        │  Intent → Capability
│ Uses: Intent Classifier              │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Resolve (Layer 2)                   │  Capability → Tool
│ Uses: Capability Registry            │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Execute (Layer 2)                   │  Invoke sub-agent
│ Uses: Tool bindings                  │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Synthesize (Layer 1)                │  Summarize result for user
│ Uses: Orchestration logic            │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Persist (Layer 2 + Layer 3)         │  Log trace for learning
│ Uses: Trace Schema                   │
└─────────────┬───────────────────────┘
              ↓
┌─────────────────────────────────────┐
│ Evolve (Layer 3)                    │  Optimize config if threshold met
│ Uses: Evolution Engine               │
└─────────────────────────────────────┘
```

---

*Next: [02-five-axioms.md](./02-five-axioms.md) — The Invariant Theory*
