# Five Axioms — Invariant Theory

> The constitutional principles of multi-agent orchestration

---

## What Are Axioms?

Axioms are **foundational truths** that hold for any multi-agent system, regardless of the tool landscape. They form the "constitution" of Claude Code Orchestra and are **never changed**.

These are not implementation details — they are the **logic of orchestration itself**.

---

## A1: Capability Primacy

> **Delegation decisions must be expressed in terms of capability requirements, never tool names**

### Why It Matters

❌ **Tool-coupled approach:**
```
if task.type == "architecture_decision":
    delegate_to("codex_cli")
```

If Codex CLI is replaced, this logic breaks.

✅ **Capability-based approach:**
```
if requires_capability("C3_DeepReasoning"):
    agent = registry.resolve("C3_DeepReasoning")
    delegate_to(agent)
```

The tool can change, but the logic remains intact.

### Practical Implication

- **All delegation logic** references capabilities, not tools
- **Capability Registry** is the single source of truth for tool bindings
- **Tool changes** require updating only the registry, not orchestration logic

---

## A2: Observability Before Optimization

> **A system that cannot measure its delegation outcomes cannot improve them**

### Why It Matters

Without measurement, you cannot know:
- Which delegations succeed vs. fail
- Which tools are cost-effective
- Which capabilities need better tool bindings
- Whether config changes improve performance

### Practical Implication

Every delegation must produce a **trace** containing:

```json
{
  "delegation_id": "uuid",
  "capability_requested": "C4_LargeContext",
  "tool_used": "gemini_cli",
  "timestamp": "ISO-8601",
  "outcome": "success|failure|partial",
  "latency_ms": 2341,
  "cost_usd": 0.08,
  "fallback_triggered": false,
  "user_feedback": "positive|neutral|negative|null"
}
```

This trace enables Layer 3 (Self-Evolutionary Engine) to function.

---

## A3: Graceful Degradation

> **Removal of any single agent must not break the system, only reduce quality**

### Why It Matters

In a production environment, agents can fail due to:
- API outages
- Rate limits
- Model deprecations
- Network issues

The orchestra must continue operating, even if degraded.

### Practical Implication

**Every capability** must have:
1. **Primary binding** — Best available tool
2. **Fallback binding** — Alternative tool (may be lower quality)
3. **Minimum viable fallback** — Orchestrator itself (basic capability)

Example:
```
C3_DeepReasoning:
  primary: codex_cli (gpt-5.2-codex)
  fallback: claude_code (sonnet-4.5)
  minimum: claude_code (haiku - fast but shallow)
```

If Codex CLI is unavailable, the system falls back automatically without failing.

---

## A4: Context as Currency

> **Every token loaded into the orchestrator must justify its presence**

### Why It Matters

Context windows are:
- **Limited** — Even large models have finite context
- **Expensive** — More tokens = higher cost and latency
- **Polluting** — Irrelevant context degrades performance

### Practical Implication

**Sub-agent pattern** is mandatory for heavy processing:

❌ **Loading everything into orchestrator:**
```
Orchestrator loads:
  - Entire codebase (500K tokens)
  - Full research results (200K tokens)
  - All execution logs (100K tokens)

Total: 800K tokens → Slow, expensive, unfocused
```

✅ **Delegating heavy work:**
```
Orchestrator loads:
  - User intent (100 tokens)
  - Capability registry (5K tokens)
  - Execution summary (2K tokens)

Sub-agent loads:
  - Full codebase (500K tokens in isolated context)

Orchestrator receives:
  - Summarized result (1K tokens)

Total orchestrator context: ~8K tokens → Fast, cheap, focused
```

---

## A5: Architecture as Data

> **The system's configuration must be readable, writable, and revisable by the system itself**

### Why It Matters

For self-evolution (Layer 3) to work, the system must:
- **Read** its own config to understand current state
- **Write** config changes proposed by analysis
- **Revise** config based on observed performance

If config is hardcoded, the system cannot evolve.

### Practical Implication

**Capability Registry** must be:
- Stored as **data** (JSON, YAML, DB)
- Versioned (git or DB history)
- Modifiable by Layer 3 Evolution Engine
- Rollback-capable

Example registry structure:
```json
{
  "version": "2.3.1",
  "last_evolved": "2026-02-19T14:23:00Z",
  "capabilities": {
    "C1_Orchestration": { ... },
    "C2_FastImplementation": { ... },
    "C3_DeepReasoning": { ... }
  },
  "evolution_log": [
    {
      "timestamp": "2026-02-15T10:00:00Z",
      "change": "Updated C3 primary from gpt-4.5 to gpt-5.2-codex",
      "rationale": "Success rate improved from 0.87 to 0.94",
      "approved_by": "auto|human_id"
    }
  ]
}
```

---

## How Axioms Work Together

### Example: Handling a Deep Reasoning Task

```
User: "Analyze the tradeoffs between monolith and microservices"

┌─────────────────────────────────────────────────┐
│ A1: Capability Primacy                          │
│ Classify intent → requires("C3_DeepReasoning")  │
└─────────────┬───────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ A4: Context as Currency                         │
│ Don't load analysis into orchestrator           │
│ → Delegate to sub-agent                         │
└─────────────┬───────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ A3: Graceful Degradation                        │
│ Primary: codex_cli                              │
│ (If unavailable → fallback: claude_code)        │
└─────────────┬───────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ Execute delegation, collect result              │
└─────────────┬───────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ A2: Observability Before Optimization           │
│ Log trace: capability, tool, outcome, metrics   │
└─────────────┬───────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────────┐
│ A5: Architecture as Data                        │
│ If 20+ traces → analyze performance             │
│ If better tool exists → propose config change   │
└─────────────────────────────────────────────────┘
```

---

## Axioms vs. Implementation

| Aspect | Layer 1 (Axioms) | Layer 2 (Implementation) |
|--------|-----------------|-------------------------|
| **Language** | Abstract capabilities | Concrete tools |
| **Stability** | Never changes | Changes with tool landscape |
| **Scope** | Universal principles | Current best practice |
| **Enforced by** | Orchestration logic | Configuration |

**Example:**
- **A1 (Axiom):** "Use capability requirements, not tool names"
- **Layer 2:** "C3_DeepReasoning currently maps to codex_cli"

The axiom is permanent. The mapping evolves.

---

*Next: [03-capabilities.md](./03-capabilities.md) — The Seven Capabilities*
