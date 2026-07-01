---
name: create-task
description: Create a durable task note under docs/tasks without turning it into a spec, using the Task Contract (Lite for Light/Standard, Full for Heavy) sized to the task's weight class
---

# Create Task

Create one focused task file under `docs/tasks/`. This is **Layer 2: Task Contract** of `docs/specs/kurosawa-thin-harness-architecture.md` (§10): fix the task's outer boundary before execution so scope cannot drift silently.

Pick the contract by weight class (`classify-task`):
- **Light / Standard → Task Contract Lite** (the default below).
- **Heavy / Protected → Task Contract Full** — only when production / DB / Secret / IAM / Cloud, domain meaning, migration, or high-impact ambiguity is in play.

Full templates: `docs/templates/task-contract-lite.md`, `docs/templates/task-contract-full.md`.

## Rules

- Use `docs/tasks/backlog/` unless the user clearly says the task is active.
- Use `docs/tasks/active/` for work in progress or the next task to execute.
- Use `docs/tasks/done/` only for completed task notes.
- Do not duplicate source-of-truth behavior. Link to `docs/specs/`, `docs/adr/`, or `docs/runbooks/` instead.
- Name task files as `YYYY-MM-DD-topic.md`.
- In `Value`, pick 1-2 from: safety / notification quality / collection accuracy / integrity / dev speed / cost / failure detection / docs canonicalization. Do not write an essay; skip trivial-value work.
- Do not include secrets, private paths, credentials, logs, or personal operational data.
- Do not pay Full-contract ceremony on a Light/Standard task — that breaks Thin Harness (§22.2).

## Task Contract Lite (Light / Standard)

```markdown
# Task Title

## Goal

## Value

## Context

## Scope

## Non-scope

## Plan

## Acceptance Criteria

## Stop / Ask Owner If
```

## Task Contract Full (Heavy / Protected)

Use `docs/templates/task-contract-full.md`. Beyond Lite it adds: Risk · Owner-only Decisions · Capability Boundary · Allowed Paths · Forbidden Paths · Rollback Trigger · Evidence Required (Level 4). Heavy tasks also require Owner Approval before execution.
