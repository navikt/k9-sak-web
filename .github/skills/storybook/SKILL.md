---
name: storybook
description: 'Storybook stories and tests for v2 components: story placement, fake API decorators, kodeverk and feature toggle decorators, play tests vs React Testing Library vs Vitest. USE FOR: writing or reviewing *.stories.tsx, withFake<Feature>Api decorators, mocking backend data in stories, replacing RTL tests when migrating. DO NOT USE FOR: the backend client itself (use backend-client) or queries in components (use data-fetching).'
---

# Storybook and tests

## Where and what

- Put `<Feature>.stories.tsx` next to the component, e.g. in `packages/v2/gui/src/fakta/<feature>/`.
- Write at least one story per ytelsestype when behaviour differs, and one story for the empty state.
- For display components, test with `play` functions in stories rather than React Testing Library (RTL).
- Keep pure logic tests, such as grouping and data transformations, in Vitest.
- When migrating, replace an RTL test only after stories cover the same rendering states and interactions.

## Decorators

All decorators are in `packages/v2/gui/src/storybook/decorators/`.

| Need | Decorator |
| --- | --- |
| Component fetches data | A reusable `withFake<Feature>Api(data)` that provides the API context and `<Suspense>`. See `withFakeOmBarnetApi.tsx` |
| Kodeverk lookups | `withK9Kodeverkoppslag()` or `withUngKodeverkoppslag()` |
| Feature toggles | `withFeatureToggles({ ... })` |

`withQueryClientProvider()` is added globally. Never create a `QueryClient` or `QueryClientProvider` in a story.

## Mock data

Type mock data with the generated DTO types (flat string codes), never old kodeverk objects (`{ kode, kodeverk }`).

## Running

- `play` tests: start `yarn storybook`, then run `yarn test-storybook` (add a path or filter to limit it to the affected stories)
- Vitest: `yarn test`
