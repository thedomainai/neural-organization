# Agentic AI HR System

HR system definition layer providing the Single Source of Truth for grades, competencies, evaluation criteria, and compensation structures.

## Overview

Agentic AI HR System is a **definition-only project** that formalizes HR system master data as structured Markdown documents. It does not contain application code. Instead, it serves as the authoritative reference consumed by implementation-layer projects such as [agentic-ai-hr](../agentic-ai-hr/).

This project is part of the [Neural Organization](../../docs/concept.md) ecosystem.

## Documentation

| Document | Description |
|---|---|
| [00_overview.md](00_overview.md) | Project overview: WHY, WHO, WHAT, project status |
| [01_concept.md](01_concept.md) | Design principles, definition structure, usage patterns |

This project intentionally omits `02_architecture.md` and `03_implementation.md` because it is a definition layer with no runtime architecture or code.

## Structure

```
agentic-ai-hr-system/
  definition/
    grades/
      G1_member.md            # Grade 1: Member
      G2_leader_support.md    # Grade 2: Leader Support
      G3_leader.md            # Grade 3: Leader
      G4_manager_support.md   # Grade 4: Manager Support
      G5_manager.md           # Grade 5: Manager (Department Head)
      G6_division_head.md     # Grade 6: Division Head
      G7_executive.md         # Grade 7: Executive Officer
      G8_director.md          # Grade 8: Director
    competency_matrix_v3.md   # Competency dictionary (3 domains x 6 elements x 8 grades)
    evaluation_system_v1.md   # Evaluation system (graduation model, 3-step gate)
    compensation_system_v1.md # Compensation system (grade-linked salary table)
  operation/
    operation_manual_v1.md    # Rollout and operational playbook
  skills/
    hr-system-architect.md    # AI skill for HR system design guidance
```

## Definition Domains

| Domain | Content | File |
|---|---|---|
| **Grades** | 8-grade system (G1-G8) with scope-based definitions | `definition/grades/G*.md` |
| **Competencies** | 3 domains (Thinking, Action, Relation) x 2 elements each | `definition/competency_matrix_v3.md` |
| **Evaluation** | Graduation model with 3-step gate (Competency, Outcome, Values) | `definition/evaluation_system_v1.md` |
| **Compensation** | Grade-linked annual salary with 5 steps (S1-S5) per grade | `definition/compensation_system_v1.md` |

## Consumers

| Project | How It Uses This Data |
|---|---|
| **agentic-ai-hr** | Primary consumer. Uses grade/competency/evaluation definitions to generate HR policies for client organizations |
| **neumann** | References grade definitions and competency standards for report quality calibration |
| **ai-executive-dashboard** | References evaluation criteria for organizational capability reporting |

## Versioning

Definition files follow semantic versioning in their filenames (e.g., `competency_matrix_v3.md`). Breaking changes to definition structures require coordination with all consumer projects.

## License

MIT
