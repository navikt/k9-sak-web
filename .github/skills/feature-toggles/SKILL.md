---
name: feature-toggles
description: 'Where feature toggles are defined and which environment each definition applies to. USE FOR: adding a feature toggle, enabling a toggle in Q or prod, choosing between baseQFeatureToggles, qFeatureToggles and k9SpecificFeatureToggles/ungSpecificFeatureToggles, reading a toggle in code or stories, reviewing toggle changes. DO NOT USE FOR: the v1→v2 migration workflow (use v2-migration) or removing a toggle and its v1 code (use v1-cleanup).'
---

# Feature toggles

## Where toggles are defined

All files are in `packages/v2/gui/src/featuretoggles/`.

| Definition | File | Applies to |
| --- | --- | --- |
| `rootFeatureToggles` | `FeatureToggles.ts` | Every toggle, always `false`. Required for all toggles |
| `baseQFeatureToggles` | `FeatureToggles.ts` | Q for both k9 and ung |
| `qFeatureToggles` | `k9/featureToggles.ts`, `ung/featureToggles.ts` | Q for k9 or ung |
| `prodFeatureToggles` | `k9/featureToggles.ts`, `ung/featureToggles.ts` | Prod for k9 or ung |
| `k9SpecificFeatureToggles`, `ungSpecificFeatureToggles` | `k9/featureToggles.ts`, `ung/featureToggles.ts` | Both Q **and** prod for k9 or ung |

A toggle set in `baseQFeatureToggles` must not be set in the ytelsesspesifikke definitions; the compiler rejects it.

## Adding a toggle

1. Add `MY_TOGGLE: false` to `rootFeatureToggles`.
2. Enable it in Q only: `qFeatureToggles` for one product, or `baseQFeatureToggles` for both.
3. When the feature should become the default in prod, we usually remove the toggle and the old implementation in the same PR instead of enabling the toggle in prod. Enabling it in prod is allowed, but must be a deliberate choice. For v1/v2 toggles, follow the `v1-cleanup` skill.

Do not put a new toggle in `k9SpecificFeatureToggles` or `ungSpecificFeatureToggles` unless the same value is meant for both Q and prod.

## Reading a toggle

- v2 components: `useContext(FeatureTogglesContext)` from `@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js`
- Old `FaktaPanelDef`/`ProsessStegPanelDef` classes: `props.featureToggles?.MY_TOGGLE`
- Stories: `withFeatureToggles({ MY_TOGGLE: true })` from `storybook/decorators/withFeatureToggles.js`
