---
description: "Review and sync Copilot skills against current codebase patterns. Run periodically or after major refactors."
---

You are reviewing the Copilot skill files in `.github/skills/` to check they still accurately describe the actual code patterns in this repo.

## Steps

For each skill in `.github/skills/`:

1. **Read the skill file** (`SKILL.md`)
2. **Find representative real code** that exercises the pattern described
3. **Compare**: does the skill match what the code actually does?
4. **Report drift**: list any inaccuracies, outdated patterns, or missing patterns
5. **Update the skill** if there is clear drift — only change what's wrong, don't rewrite working content

## Skills to review

- `.github/skills/v2-architecture/SKILL.md` — check against `packages/v2/gui/src/` and `packages/v2/backend/src/`
- `.github/skills/storybook-testing/SKILL.md` — check against `packages/v2/gui/src/**/*.stories.tsx` and `packages/v2/gui/src/storybook/`
- `.github/skills/aksel-spacing/SKILL.md` — check against recent component files using `@navikt/ds-react`

## What to look for

- Import paths that changed (new packages, renamed modules)
- Components or hooks that were added/removed
- New conventions adopted by the team
- Anti-patterns the team decided to drop
- Missing patterns that appear in ≥3 places in real code

## Output format

For each skill, report:
- ✅ Accurate — no changes needed
- ⚠️ Minor drift — describe what changed, then fix it
- ❌ Major drift — describe what's wrong, then fix it
