# GitHub Copilot Instructions for K9 Sak Web

> For full project context, conventions, and tech stack, see [AGENTS.md](../AGENTS.md) and the skill files in `.github/skills/`.

## Git Policy

- **NEVER** run `git commit` or `git push` unless the user explicitly asks you to.
- You may check status (`git status`, `git diff`) freely.

## Språk

- Copilot may respond in **English**, but **code comments** must be written in Norwegian.
- If Copilot generates comments, they should be written in Norwegian bokmål.
- Tekniske termer (variabelnavn, funksjonsnavn, biblioteknavn osv.) skal fortsatt være på engelsk i kode.

## Minimal Editing

When fixing a bug or implementing a feature, change only what is necessary.
Do not rename variables, restructure working code, or refactor beyond the task at hand.
Keep diffs small and focused so they are easy to review.