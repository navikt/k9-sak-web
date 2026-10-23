---
name: v1-cleanup
description: >-
  Remove a feature toggle that switches between v1 and v2 (usually BRUK_V2_*,
  but also e.g. BRUK_OMSORGEN_FOR_V2 or DOKUMENTFILTER) and delete all v1 code
  tied to it once v2 is validated in Q and should become the default in prod.
  USE FOR: finishing a v2 migration, "skru på v2 i prod", "fjern toggle",
  "slett legacy/v1-kode", cleaning up FaktaPanelDef/ProsessStegPanelDef
  branches, VersjonsvelgerV1V2, getEndepunkter, unused props, old packages,
  mocks and types. DO NOT USE FOR: adding a toggle (use feature-toggles skill)
  or migrating a panel to v2 (use v2-migration skill).
---

# v1 cleanup

Use this when v2 is validated in Q and should become the default in prod; see the rollout rule in the `feature-toggles` skill. If v1 has to come back, revert that PR rather than keeping v1 behind a toggle.

This applies to any toggle that switches between a v1 and a v2 implementation. Most are named `BRUK_V2_<FEATURE>`, but some are not (e.g. `BRUK_OMSORGEN_FOR_V2`, `DOKUMENTFILTER`).

Once the toggle is gone, nothing should render v1 anymore. Everything that only v1 used is dead code and must be deleted in the same PR: components, packages, props, endpoints, types, mocks, tests and stories. Do not keep v1 code "just in case"; it stays available in git history. Keep a file or export only when a search shows a consumer outside the v1 branch.

Where toggles are defined is described in the `feature-toggles` skill. How the compile-time deletion guards are added is described in the `v2-migration` skill.

## Required input

Ask the user for the toggle name (e.g. `BRUK_V2_UTENLANDSOPPHOLD`) if it is not given. Ask the user to confirm that v2 is validated in Q before deleting anything. Find the v1 package or files from the toggle's uses and from `packages/v2/MIGRATION.md`.

## Find everything first

1. Search the whole repo for the toggle name to find every use, including other behandling packages, ung, stories and tests.
2. Search for the v1 package name (e.g. `@k9-sak-web/fakta-<feature>`) and the v1 component names to find code that does not reference the toggle directly.
3. Search for the compile-time deletion guards (`_VenterPåSletting`) tied to the toggle. Read the comment above each guard; it says what to delete. Guards are not only in old `packages/fakta-*` / `packages/prosess-*` packages; v1 code can also live inside a behandling package (e.g. `behandling-pleiepenger/src/components/OmBarnet.tsx`).

List what you found before deleting, so the user can check the scope.

## Checklist

### Toggle definitions

- [ ] Remove the key from every toggle definition listed in the `feature-toggles` skill
- [ ] Run `yarn ts-check`. Every compile-time deletion guard and every remaining `featureToggles?.<TOGGLE>` use now points to code that must be cleaned up

### PanelDef wiring (every behandling package)

This also covers other places that pick between v1 and v2 on the toggle, such as `*ProsessStegInitPanel.tsx`, `InngangsvilkarPanel` and container components that read `FeatureTogglesContext`.

- [ ] `getKomponent` renders the v2 component directly: remove the toggle check, the v1 branch and any `VersjonsvelgerV1V2` wrapper
- [ ] Update or delete PanelDef specs (`*PanelDef.spec.tsx`) that set the toggle or test the v1 branch. They often declare their own toggle type (e.g. `featureToggles?: { BRUK_V2_OM_BARNET: boolean }`), so `yarn ts-check` will not catch them. Keep the v2 assertions without the toggle
- [ ] Remove `getEndepunkter` entries that only the v1 component used. Remove `getData` / `getOverstyrVisningAvKomponent` logic that only depends on those endpoints
- [ ] Remove the matching keys and `.withRel(...)` lines in each `*BehandlingApi.ts`, but only after searching for other consumers of the same key
- [ ] Remove unused imports (v1 package, `VersjonsvelgerV1V2`, `*BehandlingApiKeys`)

Example, before and after:

```tsx
// Før
getEndepunkter = () => [PleiepengerBehandlingApiKeys.UTENLANDSOPPHOLD];

getKomponent = props => {
  if (props.featureToggles?.BRUK_V2_UTENLANDSOPPHOLD) {
    return <UtenlandsoppholdFaktaIndex behandlingUuid={props.behandling.uuid} fagsakYtelseType={...} />;
  }
  return <Utenlandsopphold utenlandsopphold={props.utenlandsopphold} kodeverk={props.alleKodeverk} ... />;
};

// Etter
getKomponent = props => <UtenlandsoppholdFaktaIndex behandlingUuid={props.behandling.uuid} fagsakYtelseType={...} />;
```

### Props no longer consumed

When v1 is gone, props that only v1 read are dead too. Remove them all the way up the chain, not just at the call site.

- [ ] For each prop the v1 branch used (e.g. `props.utenlandsopphold`, `props.alleKodeverk`), check whether anything else still reads it. If not, stop passing it
- [ ] Follow the prop upwards: container components that chose between v1 and v2 (e.g. `DocumentListContainer` with `{...props}` to both), `*Fakta.tsx` / `*Prosess.tsx`, `*Index.tsx` and `getData`. Remove the prop from each `interface`/`type`, from destructuring and from every caller
- [ ] Remove props on the v2 component that were only added so it could share an interface with v1 or `VersjonsvelgerV1V2`, and that the v2 component itself never reads
- [ ] Remove the props from stories, tests and mocks that pass them
- [ ] If a container only picks between v1 and v2, replace it with the v2 component directly and delete the container

`yarn ts-check` does not report unused props, so search for each prop name. `yarn lint` catches unused variables after destructuring.

### v1 code

- [ ] Before deleting a v1 test, confirm that a v2 story or test covers the same behaviour (see the `storybook` skill); if not, add it to v2 first
- [ ] Delete the old v1 package (e.g. `packages/fakta-<feature>/`) or the old v1 files
- [ ] Remove the package from `dependencies` in every `package.json` that referenced it, then run `yarn install` so `yarn.lock` is updated
- [ ] Remove deleted files from `loosely-type-checked-files.json` by running the script `yarn ts-check:update-ignored`
- [ ] Remove v1-only mock data (`packages/mocks/`) and v1-only types and their exports (`packages/types/`), after searching for other consumers
- [ ] Delete the v1/v2 comparison story if one was added
- [ ] If the v2 component or file has a `V2` suffix only to tell it apart from v1, rename it (e.g. `OpptjeningVilkarProsessIndexV2` → `OpptjeningVilkarProsessIndex`) and update imports and stories

### Documentation

- [ ] Move the panel from "Under migrering → Feature togglet" to "Ferdig migrert" in `packages/v2/MIGRATION.md`

### Verification

- [ ] Searching for the toggle name and the v1 package name gives no hits outside git history
- [ ] No props are passed that nothing reads anymore
- [ ] `yarn ts-check` passes
- [ ] `yarn lint` passes (catches unused imports)
- [ ] Affected Storybook `play` tests and Vitest tests (`yarn test`) pass

## Reference PRs

- #9015 — removes `BRUK_V2_UTENLANDSOPPHOLD`, the `fakta-utenlandsopphold` package, endpoints, mocks and types
- #8640 — removes `BRUK_V2_VILKAR_OPPTJENING` and renames the `V2`-suffixed component
