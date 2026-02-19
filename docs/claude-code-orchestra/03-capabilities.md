# Seven Capabilities — Capability Taxonomy

> The fundamental capability needs the orchestra addresses

---

## What Are Capabilities?

**Capabilities** are abstract functional requirements that tasks demand, independent of which tool provides them.

They form the **middle layer** between user intent and tool invocation:

```
User Intent → Capability Requirement → Tool Selection
```

---

## The Seven Capabilities

### C1: Orchestration

**Description:** Task decomposition, delegation decisions, result synthesis

**Why It Exists:**
Someone must coordinate the overall workflow, decide what needs to be done, delegate to appropriate agents, and synthesize results.

**Current Tool Assignment:** `Claude Code`

**Example Tasks:**
- "Build a full-stack web app" → Decompose into backend, frontend, deployment
- "Debug this issue" → Analyze, delegate to appropriate specialist
- "Research and implement feature X" → Coordinate research → implementation → testing

---

### C2: Fast Implementation

**Description:** Code writing, editing, file manipulation

**Why It Exists:**
Most implementation tasks benefit from speed. For straightforward coding, you want quick iteration, not deep contemplation.

**Current Tool Assignment:** `Claude Code`

**Characteristics:**
- Fast response time
- Strong tool integration (Edit, Write, Bash)
- Good for "known patterns" implementation

**Example Tasks:**
- Write a React component from a clear spec
- Refactor a function to use async/await
- Fix a typo or simple bug
- Add logging statements

---

### C3: Deep Reasoning

**Description:** Architecture decisions, tradeoff analysis, root cause analysis

**Why It Exists:**
Some problems require **deep thinking**, not fast answers. Architecture decisions, complex bugs, and strategic tradeoffs need extended reasoning.

**Current Tool Assignment:** `Codex CLI (gpt-5.2-codex)`

**Characteristics:**
- Extended reasoning capability
- Strong architectural thinking
- Excellent at tradeoff analysis
- Slower, but higher quality for complex problems

**Example Tasks:**
- "Should we use PostgreSQL or MongoDB for this use case?"
- "What's causing this race condition?"
- "Design the data model for a complex domain"
- "Analyze the security implications of this approach"

---

### C4: Large-Context Processing

**Description:** Repository-wide analysis, multi-document research

**Why It Exists:**
Some tasks require **processing massive amounts of context** — entire repositories, many documents, long conversation histories.

**Current Tool Assignment:** `Gemini CLI (1M+ context window)`

**Characteristics:**
- Massive context window (1M+ tokens)
- Strong cross-document synthesis
- Excellent for "finding patterns across codebase"

**Example Tasks:**
- "Where is authentication handled across the entire codebase?"
- "Summarize all API endpoints and their purposes"
- "Find all places where user data is accessed"
- "Analyze 50 customer feedback documents for themes"

---

### C5: Web Research

**Description:** External information gathering, fact-checking, trend analysis

**Why It Exists:**
Tasks often require **external knowledge** beyond training data.

**Current Tool Assignment:** `Gemini CLI (with web search)`

**Characteristics:**
- Real-time web access
- Citation and source tracking
- Strong at synthesizing multiple sources

**Example Tasks:**
- "What are the latest best practices for React 19?"
- "Research competitive landscape for X product"
- "Find documentation for this obscure API"
- "What are current trends in AI agent architectures?"

---

### C6: Multimodal Processing

**Description:** PDF, video, audio, image analysis

**Why It Exists:**
Not all input is text. Design mockups, PDFs, diagrams, videos all need processing.

**Current Tool Assignment:** `Gemini CLI (multimodal)`

**Characteristics:**
- Native image, video, audio understanding
- PDF document processing
- Visual design comprehension

**Example Tasks:**
- "Implement this UI from the Figma screenshot"
- "Analyze this architecture diagram"
- "Transcribe and summarize this video tutorial"
- "Extract data from this PDF table"

---

### C7: Quality Assurance

**Description:** Code review, implementation verification

**Why It Exists:**
Independent review catches issues that the implementer misses. A **second set of eyes** improves quality.

**Current Tool Assignment:** `Codex CLI / Claude session`

**Characteristics:**
- Critical evaluation mindset
- Security and best practices focus
- Independent from implementation

**Example Tasks:**
- "Review this code for security issues"
- "Does this implementation meet the requirements?"
- "Check for edge cases and error handling"
- "Verify test coverage is adequate"

---

## Capability Matrix

| ID | Capability | Primary Tool | Fallback | Strength |
|----|-----------|-------------|----------|----------|
| **C1** | Orchestration | Claude Code | - | Coordination, task decomposition |
| **C2** | Fast Implementation | Claude Code | - | Speed, tool integration |
| **C3** | Deep Reasoning | Codex CLI | Claude Code | Complex problem solving |
| **C4** | Large Context | Gemini CLI | Claude Code | Massive context processing |
| **C5** | Web Research | Gemini CLI | Claude Code | Real-time information |
| **C6** | Multimodal | Gemini CLI | Claude Code | Image/video/PDF analysis |
| **C7** | Quality Assurance | Codex CLI | Claude Code | Independent verification |

---

## How Capabilities Map to Tools

### Current State (2026-02)

```
Claude Code
  ├─ C1: Orchestration (exclusive)
  └─ C2: Fast Implementation (exclusive)

Codex CLI (gpt-5.2-codex)
  ├─ C3: Deep Reasoning (primary)
  └─ C7: Quality Assurance (primary)

Gemini CLI (gemini-2.0-pro)
  ├─ C4: Large Context (primary)
  ├─ C5: Web Research (exclusive)
  └─ C6: Multimodal (exclusive)
```

### Why This Mapping?

**Asymmetric strengths** — Each tool excels in different areas:

- **Claude Code:** Best at orchestration and fast iteration
- **Codex (GPT-5.2):** Best at deep reasoning and critical analysis
- **Gemini:** Best at massive context and multimodal input

**Complementary coverage** — Together they cover all needs.

---

## Capability-First Delegation Logic

### Traditional Approach (Tool-Coupled)

```python
# ❌ Hardcoded tool references
if "analyze architecture" in task:
    run_codex_cli(task)
elif "search codebase" in task:
    run_gemini_cli(task)
```

**Problems:**
- Tool names embedded in logic
- Changing tools requires code changes
- No systematic optimization

### Capability-Based Approach

```python
# ✅ Capability abstraction
capability = classify_intent(task)
# Returns: "C3_DeepReasoning"

tool = capability_registry.resolve(capability)
# Returns: { tool: "codex_cli", model: "gpt-5.2-codex" }

result = delegate_to(tool, task)
```

**Benefits:**
- Logic references capabilities, not tools
- Tool changes = registry update only
- Metrics tracked per capability
- Optimization possible via Layer 3

---

## Evolution of Capability Mappings

### Example: C3 Deep Reasoning Over Time

```
2025-06: C3 → claude-opus-4
  - Success rate: 0.82
  - Avg latency: 4500ms

2025-11: C3 → gpt-4.5-preview
  - Success rate: 0.87 (+5%)
  - Avg latency: 3800ms (-700ms)
  - Evolution Engine detected improvement

2026-02: C3 → gpt-5.2-codex
  - Success rate: 0.94 (+7%)
  - Avg latency: 3200ms (-600ms)
  - Evolution Engine auto-updated registry
```

**Key Point:** The orchestration logic never changed. Only the registry was updated.

---

## Intent Classification → Capability

The **Intent Classifier** maps user requests to capability requirements.

### Examples

| User Request | Detected Capabilities | Rationale |
|-------------|----------------------|-----------|
| "Implement login form" | C2 (Fast Implementation) | Clear spec, straightforward task |
| "Design auth architecture" | C3 (Deep Reasoning) | Requires tradeoff analysis |
| "Find all SQL queries" | C4 (Large Context) | Needs repo-wide search |
| "Research OAuth best practices" | C5 (Web Research) | Needs external knowledge |
| "Implement this mockup [image]" | C6 (Multimodal) | Requires image understanding |
| "Review this PR" | C7 (Quality Assurance) | Verification task |

### Multi-Capability Tasks

Some tasks require **multiple capabilities in sequence**:

```
User: "Research React 19 best practices and implement a dashboard"

Orchestrator classifies:
  1. C5 (Web Research) → "Research React 19 best practices"
  2. C2 (Fast Implementation) → "Implement a dashboard"

Execution:
  1. Delegate research to Gemini CLI
  2. Receive research summary
  3. Delegate implementation to Claude Code
  4. Synthesize final result
```

---

## Adding New Capabilities

As the ecosystem evolves, new capabilities may emerge:

**Hypothetical Future Capabilities:**

- **C8: Real-Time Collaboration** — Multi-human, multi-agent synchronous work
- **C9: Continuous Learning** — Active learning from production feedback
- **C10: Cross-System Integration** — Orchestrating non-AI tools (databases, APIs)

**Process:**
1. Identify recurring need not well-served by existing capabilities
2. Define capability specification (Layer 1)
3. Assign current best tool (Layer 2)
4. Update Intent Classifier to recognize new capability
5. Begin tracking metrics for future optimization (Layer 3)

---

*Next: [04-tradeoffs.md](./04-tradeoffs.md) — Design Tradeoff Axes*
