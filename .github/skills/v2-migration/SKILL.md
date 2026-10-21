---
name: v2-migration
description: 'Migrate an existing fakta or prosess panel from v1 to v2 behind a BRUK_V2_<FEATURE> toggle. USE FOR: migration checklist, toggle-guarded FaktaPanelDef/ProsessStegPanelDef wiring, passing props to the v2 component, konverterKodeverkTilKode, compile-time deletion guards, Suspense in *Fakta.tsx shells, VersjonsvelgerV1V2 and comparison stories, MIGRATION.md, reviewing a migration. DO NOT USE FOR: new v2 components without a v1 version (use v2-architecture) or removing the toggle and v1 code (use v1-cleanup).'
---

# v1 → v2 migration

Replace an existing panel with a v2 component while v1 stays available behind a toggle. Build the v2 component itself by following the `v2-architecture` skill. Work through the steps below in order.

Both branches must work as long as the toggle exists. Do not remove v1 code, v1 tests or the toggle as part of the migration; that is done later with the `v1-cleanup` skill.

## 1. Toggle and status

- [ ] Add `BRUK_V2_<FEATURE>` and enable it in Q for the relevant product, as described in the `feature-toggles` skill
- [ ] In `packages/v2/MIGRATION.md`, move the panel from "Ikke migrert eller ikke vurdert" (or "Under arbeid") to "Under migrering → Feature togglet" with the toggle name, and remove its row from the tier tables
- [ ] Ask the user whether they want a `VersjonsvelgerV1V2` for manual regression testing. Add it only if they say yes

## 2. PanelDef wiring (every behandling package that shows the panel)

- [ ] `getKomponent` checks `props.featureToggles?.BRUK_V2_<FEATURE>`. The v2 branch passes only what the component needs, typically `behandlingUuid`. Leave the v1 branch unchanged
- [ ] Pass each prop to the v2 component by name. Never spread `{...props}` or `{...deepCopyProps}` onto it; that bypasses its prop types and forwards props it never asked for
- [ ] Keep `getEndepunkter` and other calls that the v1 branch still uses

If the v2 component fetches its own data, no kodeverk conversion is needed. If it must receive legacy props with kodeverk objects (`{ kode, kodeverk }`), map the needed values explicitly. Use `konverterKodeverkTilKode` only when the legacy data really needs recursive conversion; it converts two-field kodeverk objects and leaves objects with more fields unchanged. Do not use `JSON.parse(JSON.stringify(props))` to copy or retype props.

## 3. Compile-time deletion guard

- [ ] Add a guard to every **old v1 file** that will be deleted after rollout, e.g. in `packages/fakta-<feature>/src/` or v1 files inside a behandling package. Not in the `FaktaPanelDef`; it survives the migration

When the toggle is removed from `FeatureToggles`, the lookup fails to compile and forces the cleanup:

```typescript
// Kompileringsfeil her betyr at BRUK_V2_MY_FEATURE er fjernet fra FeatureToggles.
// Slett hele packages/fakta-<feature> og fjern v1-grenen i FaktaPanelDef når migreringen er ferdig.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_V2_MY_FEATURE'];
```

Use the inline `import(...)` so the guard needs no top-level import.

## 4. API provider and Suspense

- [ ] Add the API context provider in `AppConfigResolver`, as described in the `api-contract` skill
- [ ] Wrap the `<ErrorBoundary>` in each behandling `*Fakta.tsx` that renders the panel in `<Suspense>`. A v2 component that uses `useSuspenseQuery` crashes without it. The existing pleiepenger, opplæringspenger and pleiepenger sluttfase shells already have it:

```tsx
<Suspense fallback={<LoadingPanel />}>
  <ErrorBoundary errorMessageCallback={addErrorMessage}>
    {valgtPanel.getPanelDef().getKomponent({ ... })}
  </ErrorBoundary>
</Suspense>
```

## 5. Stories and tests

- [ ] Cover the existing rendering states and interactions in v2 stories, following the `storybook` skill
- [ ] Optional: if the user chose a versjonsvelger, ask separately whether they also want a comparison story. It renders both versions with matching data through the toggle-guarded `FaktaPanelDef` and `VersjonsvelgerV1V2`, and has a compile-time deletion guard so it is deleted with the v1 branch. Keep the v2 component's own story independent

## 6. Verify

- [ ] `yarn ts-check` and the affected tests pass
