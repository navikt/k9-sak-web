---
name: typescript
description: 'How we write and type-check TypeScript in k9-sak-web: the two tsconfig setups, loose-ts-check and loosely-type-checked-files.json, avoiding any, type assertions and non-null assertions, narrowing unknown data, noUncheckedIndexedAccess, verbatimModuleSyntax/import type, exhaustive switch, @ts-expect-error, moving code into the strict v2 config. USE FOR: fixing type errors, yarn ts-check failures, choosing between as, satisfies and type guards, reviewing type safety. DO NOT USE FOR: re-exporting OpenAPI types (use generated-types) or imports and CSS conventions in v2 (see .github/instructions/v2.instructions.md).'
---

# TypeScript

## Two configurations

| Code | Config | Strictness |
| --- | --- | --- |
| Everything outside `packages/v2/` | `tsconfig.json` | `strict: false`, but `strictNullChecks: true` |
| `packages/v2/` | `packages/v2/tsconfig.json` | Based on `strictest`: `strict`, `noUncheckedIndexedAccess`, `noPropertyAccessFromIndexSignature`, `verbatimModuleSyntax`, `noUnusedLocals`/`noUnusedParameters`, `noImplicitReturns`, `noImplicitOverride` |

`yarn ts-check` checks both. Use `yarn ts-check:v2` to check only v2.

### Legacy files with known errors

The root check is piped through `loose-ts-check`. Files in `loosely-type-checked-files.json` may have the error codes in `ignored-error-codes.json`; every other file must be free of errors. No v2 file is on the list.

- Never add a file to the list to hide a new error. Fix the error.
- When you fix or delete a listed file, run `yarn ts-check:update-ignored` so the list shrinks. `yarn ts-check` fails until you do.

## Rules

These apply to all new and changed code. The v2 config enforces most of them.

### No `any`

Use `unknown` for values whose type you do not know, and narrow it before use. Use the generated types for backend data (see the `generated-types` skill). Never write types by hand that can be generated from the OpenAPI spec.

### No type assertions or non-null assertions

Avoid `as Type` (especially `as any` and `as unknown as Type`) and `!`, also in stories and tests. They hide errors instead of handling them. In order of preference:

1. Let TypeScript infer the type.
2. Use `satisfies` to check a value against a type without widening it. Example: `const meta = { ... } satisfies Meta<typeof Komponent>;`
3. Narrow with a check (`if (x === undefined)`, `in`, `typeof`, a type guard).
4. Throw if a value is missing when it must exist: `assertDefined(value)` from `@k9-sak-web/gui/utils/validation/assertDefined.js`.
5. Validate data with an assertion function. See `validerUttak` in `packages/v2/gui/src/prosess/uttak/types/Uttak.ts`.

`as const` is fine; it narrows the type instead of overriding it.

### Indexed access

With `noUncheckedIndexedAccess`, `array[n]` and `record[key]` are `T | undefined`. Handle `undefined`:

```typescript
const første = perioder[0];
if (første === undefined) {
  throw new Error('Forventet minst én periode');
}
```

Prefer `find`, `at` with a check, or iterating over the array over indexing.

### `import type`

With `verbatimModuleSyntax`, an import used only as a type must be `import type`. A kodeverk enum that is both a const and a type is imported twice:

```typescript
import { fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import type { FagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
```

### Exhaustive switch

When switching over a union, add a `never` check so a new value fails to compile:

```typescript
default: {
  const _exhaustiveCheck: never = forespørselStatus;
  throw new Error(`Ukjent ForespørselStatus: ${_exhaustiveCheck}`);
}
```

See `NyInntektsmeldingDialog.tsx` in `packages/v2/gui/src/fakta/inntektsmelding/`.

### `@ts-expect-error`

Avoid it in production code. Lint rejects `@ts-ignore` and `@ts-nocheck`, and requires a description after `@ts-expect-error`. In tests that check that invalid input is rejected, `@ts-expect-error` with a comment explaining why is fine.

### Unused code

v2 fails on unused locals and parameters. Remove them. If a function signature requires a parameter you do not use, prefix it with `_`.

## Moving code into v2

Code moved into `packages/v2/` must pass the strict config. Do not copy legacy code as is: replace `any`, assertions and hand-written backend types, and handle `undefined` from indexed access.
