---
name: aksjonspunkt
description: 'What a v2 panel shows for an aksjonspunkt: the form, a read-only summary or only an alert, decided by aksjonspunkt status and readOnly, and which stories prevent regressions. USE FOR: creating, changing or reviewing a component that shows or solves an aksjonspunkt, conditions that show or hide an aksjonspunkt form, "aksjonspunktet kan ikke løses", "vises bare i lesemodus", åpent vs løst aksjonspunkt, Rediger vurdering, readOnly/isReadOnly, veileder or beslutter view. DO NOT USE FOR: wiring the panel into FaktaPanelDef/ProsessStegPanelDef (use v2-migration), the mutation that submits the aksjonspunkt (use data-fetching), or alert design (use design-alerts).'
---

# Aksjonspunkt: what to show

A saksbehandler must always be able to solve an open aksjonspunkt. Applies to new code and code you change anyway.

## The status decides, not the data

Whether the aksjonspunkt is open is decided by `status` alone. `OPPRETTET` is open, `UTFØRT` is solved.

- Never use existing data as a sign that the aksjonspunkt is solved: a date, a begrunnelse or a saved vurdering. Backend can prefill values, and an aksjonspunkt can be reopened with the old values still there, for example after a tilbakehopp or in a revurdering.
- Use the helpers in `packages/v2/gui/src/utils/aksjonspunktUtils.ts`: `isAksjonspunktOpen`, `harÅpentAksjonspunkt`, `aksjonspunktErUtført`, `finnAksjonspunkt`.

## Status and readOnly

`readOnly` says whether the user may submit. It says nothing about whether the aksjonspunkt is open. The shell sets it: `erReadOnly` in `packages/behandling-felles/src/util/readOnlyUtils.ts` (no write access, behandling på vent, `taskStatus.readOnly`, inactive aksjonspunkt), or only from write access as in `packages/behandling-pleiepenger/src/components/PleiepengerProsessV2.tsx`. Veileder never gets write access (`packages/sak-app/src/app/util/access.ts`).

| Status | `readOnly` | Show                                                                                             |
| ------ | ---------- | ------------------------------------------------------------------------------------------------ |
| Open   | `false`    | The form directly, with «Bekreft og fortsett». No «Avbryt», since there is nothing to go back to |
| Open   | `true`     | Only the alert saying the aksjonspunkt must be vurdert. No form                                  |
| Solved | `false`    | A read-only summary with «Rediger vurdering». «Avbryt» goes back to the summary                  |
| Solved | `true`     | The read-only summary, without «Rediger vurdering»                                               |

Do not show an empty form in read-only mode. `RhfTextField`, `RhfTextarea`, `RhfNumericField`, `RhfSelect` and `RhfDatepicker` from `@navikt/ft-form-hooks` render nothing when `readOnly` is set and the value is empty, while `Datovelger` from `packages/v2/gui/src/shared/datovelger/` renders a disabled field. The result is half a form.

## Changing a condition that shows or hides the form

Go through all four rows in the table before changing a condition. Do not fix one row by breaking another.

This happened to aksjonspunkt 9291 (`VURDER_DATO_NY_REGEL_UTTAK`). To stop a solved aksjonspunkt from opening in edit mode, the form was hidden whenever `virkningsdatoUttakNyeRegler` was set. When backend had a date for an open aksjonspunkt, it looked solved and was hidden behind «Vis aksjonspunkt». The fixed code checks the status:

- `packages/v2/gui/src/prosess/uttak/vurder-dato/VurderDato.tsx`
- `packages/v2/gui/src/prosess/uttak/vurder-dato/EndringsdatoInfostripe.tsx`

## Stories

Every component that solves an aksjonspunkt has a story for each row in the table. Add a story for an open aksjonspunkt with existing values when backend can prefill them or the aksjonspunkt can be reopened. Each `play` test checks whether «Bekreft og fortsett» is shown, since that is what breaks when the user cannot solve the aksjonspunkt.

Reference: `packages/v2/gui/src/prosess/uttak/vurder-dato/VurderDato.stories.tsx`

| Row                   | Story                                                                               |
| --------------------- | ----------------------------------------------------------------------------------- |
| Open, not read-only   | `ÅpentAksjonspunkt`, `ÅpentAksjonspunktMedEndringsdato` (open with existing values) |
| Open, read-only       | `ÅpentAksjonspunktMedEndringsdatoForVeileder`                                       |
| Solved, not read-only | `RedigerVurdering`                                                                  |
| Solved, read-only     | `LesevisningForBeslutter`                                                           |

Build aksjonspunkter for stories with a helper that takes the status, such as `lagVurderDatoNyRegelAksjonspunkt(status, overrides)` in `packages/v2/gui/src/storybook/mocks/uttak/uttakStoryMocks.ts`. Decorators and running the tests are described in the `storybook` skill.
