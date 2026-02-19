# Design Tradeoffs — Seven Axes

> Every design decision in the orchestra sits on one or more of these axes

---

## What Are Tradeoff Axes?

A **tradeoff axis** represents a genuine tension between two valid but competing design goals. There is no universally correct position — the right choice depends on context.

Understanding these axes helps you:
- Make **informed decisions** when configuring the orchestra
- **Adapt** the template to your specific needs
- **Communicate** design rationale to others

---

## T1: Specialization ↔ Generality

### Poles

**← Specialization**
Dedicated agent per capability, each optimized for specific tasks

**Generality →**
Single agent handles everything, maximizes adaptability

### Current Position: **Moderate Specialization**

```
Claude Code Orchestra uses:
  - Claude Code (orchestrator + fast implementation)
  - Codex CLI (deep reasoning + QA)
  - Gemini CLI (large context + research + multimodal)

= 3 agents covering 7 capabilities
```

### Tradeoff Analysis

| Aspect | More Specialization | More Generality |
|--------|-------------------|-----------------|
| **Quality** | ✅ Each agent optimized | ❌ One-size-fits-all |
| **Complexity** | ❌ More agents to manage | ✅ Simpler architecture |
| **Cost** | ❌ More API calls | ✅ Fewer context switches |
| **Robustness** | ❌ More failure points | ✅ Fewer dependencies |

### When to Move Left (More Specialization)

- Quality is paramount
- Budget allows multiple premium models
- Tasks have very distinct requirements

### When to Move Right (More Generality)

- Simplicity is priority
- Budget is limited
- Tasks are relatively homogeneous

---

## T2: Automation ↔ Control

### Poles

**← Automation**
System decides when to delegate based on capability detection

**Control →**
User explicitly requests delegation (manual routing)

### Current Position: **High Automation**

The orchestrator **automatically** classifies intents and delegates.

### Tradeoff Analysis

| Aspect | More Automation | More Control |
|--------|----------------|--------------|
| **User Experience** | ✅ Seamless | ❌ More commands to learn |
| **Precision** | ❌ May misclassify | ✅ User knows best |
| **Efficiency** | ✅ No manual routing | ❌ User must decide |
| **Transparency** | ❌ "Magic" behavior | ✅ Explicit actions |

### When to Move Left (More Automation)

- Users want "just works" experience
- Intent classification is reliable
- Trust in orchestrator is high

### When to Move Right (More Control)

- Users are power users who know exactly what they want
- Intent classification is unreliable
- Transparency is critical (regulated environments)

### Example of Manual Control

```bash
# Explicit delegation (manual control)
claude-code --delegate=codex "analyze this architecture"
claude-code --delegate=gemini "search entire codebase for auth"

# vs. Automatic (current approach)
claude-code "analyze this architecture"
# → Orchestrator detects C3, delegates to Codex automatically
```

---

## T3: Context Isolation ↔ Context Richness

### Poles

**← Isolation**
Protect orchestrator context via aggressive sub-agent delegation

**Richness →**
Load more context into orchestrator for better decision-making

### Current Position: **High Isolation**

Heavy processing delegated to sub-agents to keep orchestrator context clean.

### Tradeoff Analysis

| Aspect | More Isolation | More Richness |
|--------|---------------|---------------|
| **Orchestrator Speed** | ✅ Fast, focused | ❌ Slow, bloated |
| **Cost** | ✅ Cheaper (less context) | ❌ Expensive (more tokens) |
| **Decision Quality** | ❌ May lack context | ✅ More informed |
| **Latency** | ❌ Sub-agent overhead | ✅ Single-call faster |

### When to Move Left (More Isolation)

- Context windows are limited
- Cost is a concern
- Task decomposition is reliable

### When to Move Right (More Richness)

- Orchestrator needs full picture to decide
- Single-pass performance is critical
- Context windows are very large (2M+ tokens)

---

## T4: Stability ↔ Adaptability

### Poles

**← Stability**
Hardcode tool choices, manual config updates only

**Adaptability →**
Abstract tool choices via registry, enable auto-evolution

### Current Position: **High Adaptability**

Capability Registry + Layer 3 Evolution Engine enable continuous adaptation.

### Tradeoff Analysis

| Aspect | More Stability | More Adaptability |
|--------|---------------|------------------|
| **Predictability** | ✅ No surprises | ❌ Config may change |
| **Maintenance** | ❌ Manual updates needed | ✅ Auto-optimizes |
| **Risk** | ✅ No unexpected changes | ❌ Evolution may degrade |
| **Performance** | ❌ Stale configs | ✅ Continuous improvement |

### When to Move Left (More Stability)

- Regulated environments (need change approval)
- Production stability is critical
- Tool landscape is stable

### When to Move Right (More Adaptability)

- Tool landscape is rapidly evolving
- You want continuous optimization
- Auto-rollback provides safety net

---

## T5: Simplicity ↔ Capability

### Poles

**← Simplicity**
Minimal features, fewer failure modes, easier to understand

**Capability →**
Rich features, powerful workflows, higher complexity

### Current Position: **Moderate — Sophisticated but Bounded**

The orchestra has:
- ✅ Clear three-layer model
- ✅ Well-defined capabilities
- ✅ Automatic optimization
- ❌ Not trying to solve every problem (stays focused)

### Tradeoff Analysis

| Aspect | More Simplicity | More Capability |
|--------|----------------|-----------------|
| **Ease of Use** | ✅ Quick to learn | ❌ Steep learning curve |
| **Maintenance** | ✅ Fewer bugs | ❌ More complexity |
| **Power** | ❌ Limited features | ✅ Handles complex scenarios |
| **Adoption** | ✅ Low barrier to entry | ❌ Requires investment |

### When to Move Left (More Simplicity)

- Users are beginners
- Use cases are straightforward
- Stability > features

### When to Move Right (More Capability)

- Users are advanced
- Use cases are complex
- Need maximum power

---

## T6: Cost Optimization ↔ Quality Maximization

### Poles

**← Cost Optimization**
Prefer cheaper models, minimize API calls, use caching aggressively

**Quality Maximization →**
Prefer best models, redundant verification, no shortcuts

### Current Position: **Quality-First with Cost Awareness**

- Uses premium models (Claude, GPT-5.2, Gemini) for their respective strengths
- Sub-agent pattern reduces orchestrator costs
- No redundant calls, but no aggressive cost-cutting

### Tradeoff Analysis

| Aspect | More Cost Optimization | More Quality |
|--------|----------------------|--------------|
| **Budget** | ✅ Lower spend | ❌ Higher spend |
| **Output Quality** | ❌ May degrade | ✅ Best possible |
| **Latency** | ✅ Fewer calls | ❌ More verification |
| **Sustainability** | ✅ Scalable cost | ❌ May be unsustainable |

### When to Move Left (More Cost Optimization)

- Budget is very limited
- Tasks are high-volume, low-stakes
- Acceptable quality bar is lower

### When to Move Right (More Quality)

- Quality is non-negotiable
- Tasks are critical (production code, legal, medical)
- Budget allows premium spend

---

## T7: Proactive ↔ Reactive

### Poles

**← Proactive**
Orchestrator suggests delegations before being asked

**Reactive →**
Orchestrator only acts on explicit requests

### Current Position: **Proactive**

The orchestrator analyzes intents and **proactively delegates** when it detects capability needs.

### Tradeoff Analysis

| Aspect | More Proactive | More Reactive |
|--------|---------------|--------------|
| **User Surprise** | ❌ Unexpected delegations | ✅ Predictable behavior |
| **Efficiency** | ✅ Optimal routing | ❌ User must know routing |
| **Trust Required** | ❌ High (user must trust system) | ✅ Low (user in control) |
| **Expertise Needed** | ✅ Low (system handles routing) | ❌ High (user must know tools) |

### When to Move Left (More Proactive)

- Users trust the system
- Routing logic is reliable
- Convenience > control

### When to Move Right (More Reactive)

- Users prefer explicit control
- Routing logic is uncertain
- Auditability is critical

---

## Tradeoff Decision Matrix

Use this matrix to evaluate your position on each axis:

| Axis | Your Priority | Recommended Position |
|------|--------------|---------------------|
| **T1: Specialization ↔ Generality** | Quality? Cost? | Quality → Left / Cost → Right |
| **T2: Automation ↔ Control** | Ease? Transparency? | Ease → Left / Transparency → Right |
| **T3: Isolation ↔ Richness** | Speed? Decision Quality? | Speed → Left / Quality → Right |
| **T4: Stability ↔ Adaptability** | Predictability? Optimization? | Predictability → Left / Optimization → Right |
| **T5: Simplicity ↔ Capability** | Ease of Use? Power? | Ease → Left / Power → Right |
| **T6: Cost ↔ Quality** | Budget? Stakes? | Budget → Left / Stakes → Right |
| **T7: Proactive ↔ Reactive** | Convenience? Control? | Convenience → Left / Control → Right |

---

## Example Configuration Profiles

### Profile: Startup MVP

```yaml
T1_Specialization: RIGHT (generality) — minimal agent count
T2_Automation: LEFT (automation) — ease of use
T3_Isolation: LEFT (isolation) — cost savings
T4_Adaptability: RIGHT (stability) — predictability
T5_Capability: LEFT (simplicity) — fast to ship
T6_Cost: LEFT (cost optimization) — limited budget
T7_Proactive: LEFT (proactive) — low learning curve
```

### Profile: Enterprise Production

```yaml
T1_Specialization: LEFT (specialization) — max quality
T2_Automation: CENTER — automation with audit logs
T3_Isolation: LEFT (isolation) — reliability
T4_Adaptability: CENTER — evolution with approval
T5_Capability: RIGHT (capability) — handle complex workflows
T6_Cost: RIGHT (quality) — premium models
T7_Proactive: CENTER — proactive with transparency
```

### Profile: Research/Exploration

```yaml
T1_Specialization: LEFT (specialization) — test many models
T2_Automation: LEFT (automation) — experiment freely
T3_Isolation: RIGHT (richness) — max context for exploration
T4_Adaptability: LEFT (adaptability) — rapid evolution
T5_Capability: RIGHT (capability) — push boundaries
T6_Cost: CENTER — balance exploration vs. budget
T7_Proactive: LEFT (proactive) — discover patterns
```

---

## Revisiting Tradeoffs Over Time

Your position on these axes should **evolve** as:

- **Tool landscape changes** — New models may shift optimal positions
- **Use cases mature** — Production may need different tradeoffs than prototyping
- **Team grows** — More expertise may favor control over automation
- **Budget changes** — Cost constraints may require optimization

**Recommendation:** Review tradeoff positions quarterly or when major changes occur.

---

*Next: [05-implementation-guide.md](./05-implementation-guide.md) — How to Build Your Orchestra*
