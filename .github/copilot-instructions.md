# GitHub Copilot Instructions for K9 Sak Web

Conventions and workflows are in the skills in `.github/skills/` and the file-specific instructions in `.github/instructions/`. For code in `packages/v2/`, start with the `v2-architecture` skill.

## Git Policy

- **NEVER** run `git commit` or `git push` unless the user explicitly asks you to.
- You may check status (`git status`, `git diff`) freely.

## Språk

- Copilot may respond in **English**, but **code comments** must be written in Norwegian bokmål.
- Tekniske termer (variabelnavn, funksjonsnavn, biblioteknavn osv.) skal fortsatt være på engelsk i kode.
- User-facing text and `.md` files are written in Norwegian bokmål. Avoid unnecessary anglicisms when a good Norwegian word exists.

## Code

- Follow the `typescript` skill for type safety and type-checking.
- Use named imports from `@navikt/ds-react`, never `import *`.
- Use Aksel spacing tokens (`space-16`), never Tailwind `p-*`/`m-*`.
- Check Aksel component names and props against the Aksel MCP (`aksel_get_doc` / `aksel_get_component_info`) before using them.

## Minimal Editing

When fixing a bug or implementing a feature, change only what is necessary.
Do not rename variables, restructure working code, or refactor beyond the task at hand.
Keep diffs small and focused so they are easy to review.

## ignore404Errors

`throwOnError: ignore404Errors` is a workaround. 404 should be handled in the BackendClient instead (see the `backend-client` skill). When you come across `ignore404Errors`, in your own work or in a review, flag it for the developer so they can decide whether to move the 404 handling to the client. Do not change it without asking.

## Skills and instructions

Each rule lives in exactly one file; link to it instead of copying it. When you create or change a skill or instruction, or change a rule, follow the `skill-authoring` skill.
