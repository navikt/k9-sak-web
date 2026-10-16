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

## ignore404Errors

`throwOnError: ignore404Errors` is a workaround. 404 should be handled in the BackendClient instead (see the `v2-api-contract` skill). When you come across `ignore404Errors`, in your own work or in a review, flag it for the developer so they can decide whether to move the 404 handling to the client. Do not change it without asking.