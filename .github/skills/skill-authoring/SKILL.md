---
name: skill-authoring
description: 'How we write and organise agent skills and instructions in this repo: when to use a skill vs an instruction, scope, naming, the description, real examples instead of templates, avoiding duplication, and validating with the bundled script. USE FOR: creating, splitting, merging, renaming or reviewing a SKILL.md or *.instructions.md, deciding where a rule belongs, a skill that is hard to name or describe, duplicated rules across skills and instructions.'
---

# Skill authoring

Skills live in `.github/skills/<name>/SKILL.md`. Instructions live in `.github/instructions/*.instructions.md` and `.github/copilot-instructions.md`.

## Skill or instruction

| Put it in | When | Why |
| --- | --- | --- |
| An instruction with `applyTo` | A short rule that must always apply to the matched files, e.g. imports or "never use `any`" | Instructions are always loaded for matching files |
| A skill | A workflow, a pattern with examples, or details that only matter for some tasks | A skill loads only when the agent picks it from the description |

When a rule must always apply but needs details, write one line in the instruction and link to the skill. Do not edit `.github/instructions/governance-review.instructions.md`; it is maintained centrally and distributed by script.

## One rule, one place

- Each rule and example lives in exactly one file. Other skills, instructions and prompts link to it instead of copying it.
- Prompts describe how to carry out a task and link to skills for the rules.
- When a rule changes, update the file that owns it and search for copies elsewhere.

## Scope

A skill covers one task. If you cannot describe it in one sentence without "and", or cannot find a good name, it is probably two skills. Example: creating a backend client and fetching data in a component are done at different times, so they are `backend-client` and `data-fetching`.

A long skill is fine if it covers one task. Prefer several small skills that link to each other over one skill that covers everything.

## Naming

- Lowercase letters, digits and hyphens, max 64 characters. `name` must equal the folder name.
- Name the skill after what someone will look for, preferably the term used in the code: `backend-client` because the classes are called `BackendClient`.
- Use English, except for Norwegian domain terms used as is in the code, e.g. `kodeverk`.
- Use a prefix only when it carries meaning. `v2-` is for skills about the v1→v2 transition. `design-` groups UI design decisions, e.g. `design-alerts`.
- Skills must be directly under `.github/skills/`. Skills in subfolders are not discovered, so group related skills with a prefix instead.

## Description

The description is how the agent decides whether to load the skill. Write:

1. What the skill covers, in one sentence.
2. `USE FOR:` the tasks and words people actually use, including Norwegian terms they write in prompts.
3. `DO NOT USE FOR:` neighbouring tasks, with the skill that owns them.

Quote the description in single quotes, since it contains colons. Max 1024 characters.

## Body

- Write in English. Keep Norwegian domain terms (`saksbehandler`, `behandling`, `kodeverk`), user-facing text and code comments in Norwegian.
- Lead with the rule, then show it. Prefer short lists and tables over prose.
- Say which code a rule applies to, e.g. new code and code you change anyway, so the agent does not rewrite working code.

### Examples

- Use real code from the repo, not generic templates with placeholders. Point to the file, and copy a snippet only when it shows the pattern directly.
- When there are several variants, add a table of reference implementations with real paths.
- Name existing code that does not follow the pattern, so the agent does not copy it.
- Verify every path, symbol and claim against the repo. Do not claim a rule is enforced, e.g. by lint, without checking the config.

### Extra files

Add `scripts/` or `references/` only when the skill needs them, and link them from `SKILL.md`. Keep links one level deep. Do not add `metadata.json`; nothing in the repo reads it.

## Checklist

When you create, rename, split or delete a skill:

- [ ] The skill has one task, and the name and description make it clear
- [ ] No rule or example is copied from another skill or instruction
- [ ] The skill table in `.github/skills/v2-architecture/SKILL.md` is updated when the skill concerns `packages/v2/`
- [ ] Links in other skills, instructions, prompts and `packages/v2/MIGRATION.md` point to the new name
- [ ] `yarn skills:check` passes. It does not run in CI, so run it yourself. What it checks and its limitations are described at the top of `.github/skills/skill-authoring/scripts/validate-skills.mjs`
- [ ] `git diff --check` passes
