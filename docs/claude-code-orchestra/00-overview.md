# Claude Code Orchestra — Overview

> Multi-Agent Orchestration Architecture for Claude Code

---

## What is Claude Code Orchestra?

**Claude Code Orchestra (CCO)** is an orchestration template that positions **Claude Code** as a central orchestrator, delegating to specialized CLI agents:
- **Codex CLI** (gpt-5.2-codex) - Deep reasoning
- **Gemini CLI** (1M context) - Research and large-context processing

### Key Characteristics

Users interact with a **single interface** while multi-agent coordination is hidden behind the scenes.

```
User → Claude Code (Orchestrator)
          ↓
    Classify → Resolve → Execute
          ↓
    ┌─────┴─────┬─────────┐
  Codex CLI  Gemini CLI  Sub-agent
```

---

## Core Principles

### 1. Capability-Based Delegation
Delegation decisions are based on **capability requirements**, not tool names. This minimizes the impact when tools change.

### 2. Context Protection
The sub-agent pattern isolates heavy processing, protecting the orchestrator's context window from pollution.

### 3. Self-Evolution
A meta-layer analyzes execution traces and automatically optimizes the configuration over time.

---

## Five Foundational Premises

| ID | Premise | Description |
|----|---------|-------------|
| **P1** | Capability Asymmetry | Each CLI has complementary strengths |
| **P2** | Single Interface | Users interact with one agent |
| **P3** | Context Bottleneck | Context window is a scarce resource |
| **P4** | Proactive | Auto-suggest > manual invoke |
| **P5** | Knowledge Shared | All agents access same knowledge base |

---

## Component Structure

### Orchestration Flow

```
User Input
    ↓
Claude Code (Orchestrator)
    ↓
Classify Intent → Capability
    ↓
Resolve Capability → Tool
    ↓
Execute via Sub-agent
    ↓
Synthesize Result
    ↓
Persist Trace
    ↓
Evolve Config
```

---

## What Problem Does It Solve?

### Without Orchestra
- Manual switching between different AI tools
- Context loss when delegating tasks
- No systematic way to leverage complementary strengths
- Configuration changes require code updates everywhere

### With Orchestra
- ✅ Single unified interface
- ✅ Automatic delegation based on capability needs
- ✅ Context protection via sub-agents
- ✅ Self-optimizing configuration
- ✅ Tool-agnostic architecture

---

## Architecture At A Glance

Claude Code Orchestra follows a **3-layer evolutionary architecture**:

1. **Layer 1: Invariant Theory** — Tool-agnostic orchestration principles
2. **Layer 2: Practical Realization** — Current SOTA tool bindings
3. **Layer 3: Self-Evolutionary Engine** — Config auto-optimization

This design ensures that the core logic remains stable even as tools evolve.

---

*Next: [01-three-layers.md](./01-three-layers.md) — Evolutionary Layered Architecture*
