# Implementation Guide

> How to build your own Claude Code Orchestra

---

## Overview

This guide walks you through implementing a Claude Code Orchestra from scratch.

**Prerequisites:**
- Access to Claude Code CLI
- (Optional) Access to Codex CLI and/or Gemini CLI
- Basic understanding of CLI tools and APIs

---

## Phase 1: Foundation (Layer 1 + Basic Layer 2)

### Step 1: Define Your Capability Registry

Create a `capability-registry.json` file:

```json
{
  "version": "1.0.0",
  "last_updated": "2026-02-19T00:00:00Z",
  "capabilities": {
    "C1_Orchestration": {
      "name": "Orchestration",
      "description": "Task decomposition, delegation, synthesis",
      "primary": {
        "tool": "claude_code",
        "model": "claude-sonnet-4.5",
        "cost_per_1k_tokens": 0.003
      },
      "fallback": null,
      "metrics": {
        "total_delegations": 0,
        "success_rate": null,
        "avg_latency_ms": null
      }
    },
    "C2_FastImplementation": {
      "name": "Fast Implementation",
      "description": "Code writing, editing, file operations",
      "primary": {
        "tool": "claude_code",
        "model": "claude-sonnet-4.5",
        "cost_per_1k_tokens": 0.003
      },
      "fallback": null,
      "metrics": {
        "total_delegations": 0,
        "success_rate": null,
        "avg_latency_ms": null
      }
    },
    "C3_DeepReasoning": {
      "name": "Deep Reasoning",
      "description": "Architecture decisions, tradeoff analysis",
      "primary": {
        "tool": "codex_cli",
        "model": "gpt-5.2-codex",
        "cost_per_1k_tokens": 0.015
      },
      "fallback": {
        "tool": "claude_code",
        "model": "claude-opus-4.5",
        "cost_per_1k_tokens": 0.015
      },
      "metrics": {
        "total_delegations": 0,
        "success_rate": null,
        "avg_latency_ms": null
      }
    }
    // ... add C4-C7 similarly
  }
}
```

### Step 2: Implement Registry Resolver

Create a simple script that resolves capabilities to tools:

```python
# capability_resolver.py
import json
from typing import Dict, Any

class CapabilityResolver:
    def __init__(self, registry_path: str):
        with open(registry_path) as f:
            self.registry = json.load(f)

    def resolve(self, capability_id: str) -> Dict[str, Any]:
        """Resolve capability to tool binding"""
        cap = self.registry["capabilities"].get(capability_id)
        if not cap:
            raise ValueError(f"Unknown capability: {capability_id}")

        return cap["primary"]

    def get_fallback(self, capability_id: str) -> Dict[str, Any] | None:
        """Get fallback tool if primary fails"""
        cap = self.registry["capabilities"].get(capability_id)
        return cap.get("fallback")
```

### Step 3: Implement Intent Classifier

Create a simple intent classifier (can be rule-based initially):

```python
# intent_classifier.py
from typing import List
import re

class IntentClassifier:
    def __init__(self):
        # Simple keyword-based classification
        self.patterns = {
            "C3_DeepReasoning": [
                r"(?:analyze|compare|evaluate|tradeoff|architecture)",
                r"(?:why|explain|rationale|reason)",
                r"(?:design|architect|plan)"
            ],
            "C4_LargeContext": [
                r"(?:entire codebase|whole repository|all files)",
                r"(?:find all|search everywhere)",
                r"(?:across the project)"
            ],
            "C5_WebResearch": [
                r"(?:research|google|search web|find online)",
                r"(?:latest|current|up-to-date|2026)",
                r"(?:best practices|industry standard)"
            ],
            "C6_Multimodal": [
                r"(?:image|screenshot|diagram|mockup|pdf)",
                r"(?:from this .*?\.(png|jpg|pdf))",
            ],
            "C7_QualityAssurance": [
                r"(?:review|audit|check|verify)",
                r"(?:security|vulnerabilities|issues)",
                r"(?:test coverage|edge cases)"
            ]
        }

    def classify(self, user_input: str) -> List[str]:
        """Classify user input into capability requirements"""
        detected = []
        user_lower = user_input.lower()

        for capability, patterns in self.patterns.items():
            for pattern in patterns:
                if re.search(pattern, user_lower):
                    detected.append(capability)
                    break

        # Default to fast implementation if no special capability detected
        if not detected:
            detected.append("C2_FastImplementation")

        return detected
```

---

## Phase 2: Orchestration Logic

### Step 4: Implement Delegator

Create the delegation logic:

```python
# delegator.py
import subprocess
import json
from datetime import datetime
from typing import Dict, Any

class Delegator:
    def __init__(self, resolver, trace_file="traces.jsonl"):
        self.resolver = resolver
        self.trace_file = trace_file

    def delegate(self, capability_id: str, task: str) -> Dict[str, Any]:
        """Delegate task to appropriate tool"""
        start_time = datetime.now()

        # Resolve capability to tool
        tool_binding = self.resolver.resolve(capability_id)

        try:
            # Execute delegation based on tool
            if tool_binding["tool"] == "claude_code":
                result = self._delegate_claude_code(task)
            elif tool_binding["tool"] == "codex_cli":
                result = self._delegate_codex(task)
            elif tool_binding["tool"] == "gemini_cli":
                result = self._delegate_gemini(task)
            else:
                raise ValueError(f"Unknown tool: {tool_binding['tool']}")

            outcome = "success"
            error = None
        except Exception as e:
            outcome = "failure"
            error = str(e)
            result = None

            # Try fallback if available
            fallback = self.resolver.get_fallback(capability_id)
            if fallback:
                try:
                    result = self._delegate_fallback(fallback, task)
                    outcome = "success_fallback"
                except Exception as e2:
                    outcome = "failure"
                    error = f"Primary: {e}, Fallback: {e2}"

        # Record trace
        latency_ms = (datetime.now() - start_time).total_seconds() * 1000
        self._record_trace({
            "timestamp": start_time.isoformat(),
            "capability": capability_id,
            "tool": tool_binding["tool"],
            "model": tool_binding["model"],
            "outcome": outcome,
            "latency_ms": latency_ms,
            "error": error
        })

        return result

    def _delegate_claude_code(self, task: str) -> str:
        """Delegate to Claude Code via subprocess"""
        # For sub-agent pattern, spawn new Claude Code session
        result = subprocess.run(
            ["claude-code", "--mode=oneshot", task],
            capture_output=True,
            text=True,
            timeout=300
        )
        return result.stdout

    def _delegate_codex(self, task: str) -> str:
        """Delegate to Codex CLI"""
        result = subprocess.run(
            ["codex", task],
            capture_output=True,
            text=True,
            timeout=300
        )
        return result.stdout

    def _delegate_gemini(self, task: str) -> str:
        """Delegate to Gemini CLI"""
        result = subprocess.run(
            ["gemini", task],
            capture_output=True,
            text=True,
            timeout=300
        )
        return result.stdout

    def _record_trace(self, trace: Dict[str, Any]):
        """Record execution trace for Layer 3 analysis"""
        with open(self.trace_file, "a") as f:
            f.write(json.dumps(trace) + "\n")
```

### Step 5: Create Orchestrator CLI

Create the main orchestrator script:

```python
#!/usr/bin/env python3
# orchestra.py
import sys
from capability_resolver import CapabilityResolver
from intent_classifier import IntentClassifier
from delegator import Delegator

def main():
    if len(sys.argv) < 2:
        print("Usage: orchestra.py <task>")
        sys.exit(1)

    task = " ".join(sys.argv[1:])

    # Initialize components
    resolver = CapabilityResolver("capability-registry.json")
    classifier = IntentClassifier()
    delegator = Delegator(resolver)

    # Classify intent
    capabilities = classifier.classify(task)
    print(f"[Orchestrator] Detected capabilities: {', '.join(capabilities)}")

    # Delegate to appropriate agent(s)
    results = []
    for cap in capabilities:
        print(f"[Orchestrator] Delegating to {cap}...")
        result = delegator.delegate(cap, task)
        results.append(result)

    # Synthesize results
    if len(results) == 1:
        print("\n" + results[0])
    else:
        print("\n=== Synthesized Results ===")
        for i, result in enumerate(results):
            print(f"\n--- Result {i+1} ---")
            print(result)

if __name__ == "__main__":
    main()
```

Make it executable:
```bash
chmod +x orchestra.py
```

---

## Phase 3: Evolution Engine (Layer 3)

### Step 6: Implement Trace Analyzer

```python
# trace_analyzer.py
import json
from collections import defaultdict
from typing import Dict, List

class TraceAnalyzer:
    def __init__(self, trace_file="traces.jsonl"):
        self.trace_file = trace_file

    def analyze(self) -> Dict[str, Dict]:
        """Analyze traces and generate capability metrics"""
        traces = self._load_traces()

        # Group by capability
        by_capability = defaultdict(list)
        for trace in traces:
            by_capability[trace["capability"]].append(trace)

        # Calculate metrics per capability
        metrics = {}
        for cap, cap_traces in by_capability.items():
            metrics[cap] = self._calculate_metrics(cap_traces)

        return metrics

    def _load_traces(self) -> List[Dict]:
        """Load all traces from JSONL file"""
        traces = []
        try:
            with open(self.trace_file) as f:
                for line in f:
                    traces.append(json.loads(line))
        except FileNotFoundError:
            pass
        return traces

    def _calculate_metrics(self, traces: List[Dict]) -> Dict:
        """Calculate performance metrics for a capability"""
        total = len(traces)
        successes = len([t for t in traces if t["outcome"].startswith("success")])
        fallbacks = len([t for t in traces if t["outcome"] == "success_fallback"])

        latencies = [t["latency_ms"] for t in traces if t["latency_ms"]]
        avg_latency = sum(latencies) / len(latencies) if latencies else None

        return {
            "total_delegations": total,
            "success_rate": successes / total if total > 0 else None,
            "fallback_rate": fallbacks / total if total > 0 else None,
            "avg_latency_ms": avg_latency
        }
```

### Step 7: Implement Evolution Engine

```python
# evolution_engine.py
from trace_analyzer import TraceAnalyzer
import json
from datetime import datetime

class EvolutionEngine:
    def __init__(self, registry_path="capability-registry.json",
                 min_traces=20, trust_level=1):
        self.registry_path = registry_path
        self.min_traces = min_traces
        self.trust_level = trust_level
        self.analyzer = TraceAnalyzer()

    def evolve(self) -> List[Dict]:
        """Analyze traces and propose config changes"""
        metrics = self.analyzer.analyze()
        proposals = []

        for capability, cap_metrics in metrics.items():
            if cap_metrics["total_delegations"] < self.min_traces:
                continue  # Not enough data

            # Check if performance is degrading
            if cap_metrics["success_rate"] and cap_metrics["success_rate"] < 0.85:
                proposals.append({
                    "capability": capability,
                    "issue": "Low success rate",
                    "current_rate": cap_metrics["success_rate"],
                    "recommendation": "Consider switching tool or investigating failures"
                })

            # Check if fallbacks are frequent
            if cap_metrics["fallback_rate"] and cap_metrics["fallback_rate"] > 0.2:
                proposals.append({
                    "capability": capability,
                    "issue": "High fallback rate",
                    "current_rate": cap_metrics["fallback_rate"],
                    "recommendation": "Primary tool is unreliable, consider promoting fallback"
                })

        return proposals

    def apply_proposal(self, proposal: Dict):
        """Apply an evolution proposal (requires human approval for trust_level 1-2)"""
        if self.trust_level < 3:
            print(f"\n=== Evolution Proposal ===")
            print(json.dumps(proposal, indent=2))
            approval = input("\nApprove this change? (yes/no): ")
            if approval.lower() != "yes":
                print("Proposal rejected.")
                return

        # Apply change (simplified — just log for now)
        print(f"[Evolution] Applied change for {proposal['capability']}")

        # In real implementation, would update capability-registry.json
```

---

## Phase 4: Testing & Deployment

### Step 8: Test the Orchestra

Create test cases:

```bash
# Test basic implementation
./orchestra.py "Create a simple React button component"

# Test deep reasoning
./orchestra.py "Should I use REST or GraphQL for this API?"

# Test large context
./orchestra.py "Find all authentication logic in the codebase"

# Test web research
./orchestra.py "Research latest React 19 best practices"
```

### Step 9: Monitor & Evolve

Run periodic analysis:

```python
# analyze.py
from evolution_engine import EvolutionEngine

engine = EvolutionEngine(trust_level=1)  # Require human approval
proposals = engine.evolve()

if proposals:
    print(f"Found {len(proposals)} optimization opportunities:")
    for proposal in proposals:
        print(f"\n{proposal}")
else:
    print("No evolution proposals at this time.")
```

---

## Next Steps

1. **Enhance Intent Classifier** — Use LLM-based classification instead of regex
2. **Add Monitoring Dashboard** — Visualize metrics over time
3. **Implement Auto-Rollback** — Detect degradations and revert changes
4. **Add More Capabilities** — Extend beyond C1-C7 as needed
5. **Productionize** — Add error handling, logging, retries

---

*See also: [06-faq.md](./06-faq.md) — Frequently Asked Questions*
