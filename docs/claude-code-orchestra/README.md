# Claude Code Orchestra

> Multi-Agent Orchestration Architecture — Capability-based delegation, self-evolving config, tool-agnostic design

---

## What is This?

**Claude Code Orchestra** is an orchestration template that positions Claude Code as a central coordinator, delegating to specialized CLI agents (Codex, Gemini, etc.) based on capability requirements rather than hardcoded tool names.

### Key Features

- ✅ **Capability-Based Delegation** — Decisions based on capability requirements, not tool names
- ✅ **Context Protection** — Sub-agent pattern isolates heavy processing
- ✅ **Self-Evolution** — Meta-layer analyzes execution and auto-optimizes config
- ✅ **Tool-Agnostic** — Core logic remains stable even as tools evolve
- ✅ **Graceful Degradation** — Fallback chains ensure resilience

---

## Documentation Structure

### Core Concepts

1. **[00-overview.md](./00-overview.md)** — What is Claude Code Orchestra and what problem does it solve?
2. **[01-three-layers.md](./01-three-layers.md)** — The Evolutionary Layered Architecture (Theory, Practice, Evolution)
3. **[02-five-axioms.md](./02-five-axioms.md)** — Invariant orchestration principles (Layer 1)
4. **[03-capabilities.md](./03-capabilities.md)** — The seven fundamental capabilities
5. **[04-tradeoffs.md](./04-tradeoffs.md)** — Seven design tradeoff axes
6. **[05-implementation-guide.md](./05-implementation-guide.md)** — How to build your own orchestra

---

## Quick Start

### The Orchestration Flow

```
User Request
    ↓
Classify Intent → Capability
    ↓
Resolve Capability → Tool
    ↓
Execute via Sub-agent
    ↓
Synthesize Result
    ↓
Persist Trace → Evolve Config
```

### Example

```
User: "Analyze the tradeoffs between monolith and microservices"

Orchestrator:
  1. Classifies intent → Requires C3 (Deep Reasoning)
  2. Resolves C3 → Codex CLI (gpt-5.2-codex)
  3. Delegates to Codex CLI via sub-agent
  4. Receives analysis
  5. Synthesizes result for user
  6. Logs trace for future optimization
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│  Layer 3: Self-Evolutionary Engine              │
│  Observes → Analyzes → Proposes → Optimizes     │
├─────────────────────────────────────────────────┤
│  Layer 2: Practical Realization                 │
│  Capability Registry + Intent Classifier         │
│  + Trace Schema + Context Budget                │
├─────────────────────────────────────────────────┤
│  Layer 1: Invariant Theory                      │
│  5 Axioms + 7 Capabilities + Orchestration Logic│
└─────────────────────────────────────────────────┘

Data Flow:
User → Claude Code (Orchestrator)
          ↓
    Classify → Resolve → Execute
          ↓
    ┌─────┴─────┬─────────┐
  Codex CLI  Gemini CLI  Sub-agent
```

---

## Five Axioms (Layer 1)

| ID | Axiom | Principle |
|----|-------|-----------|
| **A1** | Capability Primacy | Delegate based on capability, never tool names |
| **A2** | Observability Before Optimization | Can't improve what you don't measure |
| **A3** | Graceful Degradation | Agent failure reduces quality, doesn't break system |
| **A4** | Context as Currency | Every token must justify its presence |
| **A5** | Architecture as Data | Config must be readable/writable by system itself |

---

## Seven Capabilities (Current Taxonomy)

| ID | Capability | Primary Tool | Use Case |
|----|-----------|-------------|----------|
| **C1** | Orchestration | Claude Code | Task decomposition, coordination |
| **C2** | Fast Implementation | Claude Code | Quick coding, editing |
| **C3** | Deep Reasoning | Codex CLI | Architecture decisions, tradeoffs |
| **C4** | Large Context | Gemini CLI | Repo-wide analysis |
| **C5** | Web Research | Gemini CLI | External knowledge gathering |
| **C6** | Multimodal | Gemini CLI | Image/PDF/video processing |
| **C7** | Quality Assurance | Codex CLI | Code review, verification |

---

## Why "Orchestra"?

Like a musical orchestra:
- **Conductor (Orchestrator):** Coordinates the ensemble
- **Sections (Capabilities):** Different instruments excel at different parts
- **Musicians (Tools):** Specific models assigned to capabilities
- **Score (Configuration):** Defines the arrangement
- **Evolution (Rehearsal):** System improves with practice

No single instrument plays everything. The conductor delegates based on what each section does best.

---

## Design Philosophy

### 1. Tool-Agnostic Core

**The orchestration logic never mentions specific tools.**

```python
# ❌ Tool-coupled
if task == "architecture":
    use_codex()

# ✅ Capability-based
if requires("C3_DeepReasoning"):
    tool = registry.resolve("C3")
    delegate(tool, task)
```

### 2. Evolution Over Configuration

**The system observes its own performance and optimizes.**

- Collects execution traces
- Analyzes success rates, latency, cost
- Proposes config improvements
- Auto-applies (with human approval at low trust levels)

### 3. Three-Layer Separation

**Clear boundaries between invariant theory, current practice, and evolution.**

- **Layer 1:** Timeless orchestration principles
- **Layer 2:** Current tool bindings (changes with tool landscape)
- **Layer 3:** Continuous optimization engine

---

## When to Use This Architecture

### ✅ Good Fit

- You use multiple AI tools with complementary strengths
- Your tasks span diverse capability needs (coding, reasoning, research, etc.)
- You want to optimize tool usage over time
- You value tool-independence (easy to swap models)
- Context management is critical

### ❌ Not Ideal

- You only use one AI tool
- All your tasks are homogeneous
- You prefer manual tool selection
- Simplicity is more important than optimization
- You're in a highly regulated environment requiring manual approvals for everything

---

## Contributing

This is a **template architecture**, not a library. Fork and adapt to your needs.

**Suggested adaptations:**
- Add your own capabilities (C8, C9, etc.)
- Change tool bindings to your preferred models
- Adjust tradeoff positions (see [04-tradeoffs.md](./04-tradeoffs.md))
- Extend evolution engine with custom metrics

---

## License

This architecture documentation is provided as-is for educational and implementation purposes.

---

## Questions?

See [05-implementation-guide.md](./05-implementation-guide.md) for detailed implementation steps.

For conceptual questions, start with [00-overview.md](./00-overview.md).

---

**Version:** 1.0.0
**Last Updated:** 2026-02-19
**Architecture:** Evolutionary Layered Architecture v2
