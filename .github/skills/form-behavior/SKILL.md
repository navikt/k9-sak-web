---
name: form-behavior
description: 'Correct behavior of a saksbehandling form when one field changes another and when it is submitted: what happens to hidden, shown again, disabled and no longer valid fields, what is validated and sent, and the submit button. USE FOR: lagrede verdier, forhåndsutfylt skjema, defaultValues, reset, avbryt redigering, forkaste endringer, skjulte felt, betingede felt, felt som vises eller skjules, verdi sendes selv om feltet er skjult, feilmelding på skjult felt, felt vises igjen, tømme verdi når valg endres, deaktivert felt, shouldUnregister, payload i onSubmit, submit-knapp, deaktivert knapp, disabled bekreft og fortsett, isValid. DO NOT USE FOR: validation rules for a field or between fields (use form-validation), or the mutation that sends the form (use data-fetching).'
---

# Form behavior

How a form behaves when one field changes another. Applies to new forms and forms you change anyway. Validation rules are in the `form-validation` skill.

## Correct behavior

A field that is hidden is never validated and never submitted.

| Situation | Correct behavior |
| --- | --- |
| The form opens and nothing is saved | The fields are empty. Do not fill in answers the saksbehandler must decide; a prefilled answer passes validation without being considered |
| The form opens and the backend has saved values | Every field shows its saved value, also fields shown only because of a saved answer |
| The saksbehandler edits a saved vurdering and clicks Avbryt | The changes are discarded, and the form shows the saved values again |
| The saved values change, e.g. after saving or switching vurdering | The form is filled in again from the new values |
| The saksbehandler changes an answer so that another field is no longer shown | The field is unmounted, not validated, any error on it disappears, and its value is not sent. The value is kept in the form |
| The saksbehandler changes the answer back, so the field is shown again. Example: answers «Nei», writes a begrunnelse, switches to «Ja» so the begrunnelse disappears, and back to «Nei» | The field shows what the saksbehandler entered before. Do not discard the input; entering it again, especially a long begrunnelse, is costly for the saksbehandler |
| A choice is no longer one of the options | The choice is cleared, and the field is required again if it is required |
| A field is disabled because it does not apply | It is not validated, and its value is not sent |
| The form is submitted | Only values from fields that are shown and enabled are sent |

## Submit button

The submit button is enabled even when the form is incomplete or invalid. Clicking it shows an error on each field that is missing or wrong, and each message says what to do: `Begrunnelse er påkrevd`, `Velg minst én periode`.

| State | Button |
| --- | --- |
| Incomplete or invalid form | Enabled; clicking validates and shows the errors |
| Submitting | `loading`, so it cannot be clicked twice |
| `readOnly` | Not shown; the user may not submit. What the panel shows instead is in the `aksjonspunkt` skill |

Do not copy: `packages/v2/gui/src/fakta/direkte-overgang/ManglerSøknadForm.tsx`, `packages/v2/gui/src/prosess/vilkar-soknadsfrist/components/SoknadsfristVilkarForm.tsx` and `packages/v2/gui/src/prosess/unntak/UnntakProsessIndex.tsx` disable the button until the form is filled in, so the saksbehandler gets no explanation.

## How

Build `defaultValues` from the saved data in one function, with empty values (`''`, `undefined`, `[]`) for fields that have no saved value.

- On Avbryt, call `reset()` without arguments before leaving edit mode; it restores `defaultValues`. Reference: `handleCancel` in `packages/v2/gui/src/fakta/om-barnet/RettVedDødForm.tsx`, tested in the story step «Avbryt tilbakestiller skjemaet uten å sende inn» in `OmBarnetPanel.stories.tsx`.
- When the saved data changes, call `reset` with the new `defaultValues`; `useForm` reads `defaultValues` only on the first render. Reference: the `useEffect` with `reset` in `packages/v2/gui/src/fakta/sykdom-og-opplæring/1-institusjon/components/InstitusjonForm.tsx`.

Map the saved values to the same type as the field values, see `references/radio-groups.md` in the `form-validation` skill.

For hidden fields, keep the default `shouldUnregister: false`, so the value stays in the form, and build the payload in `onSubmit` from the fields that are shown. Reference: `handleSubmit` in `packages/v2/gui/src/fakta/sykdom-og-opplæring/1-institusjon/components/InstitusjonForm.tsx` sends `begrunnelse` only when it is shown. Do not use `shouldUnregister: true`; it discards the input when a field is hidden.

## Pitfalls

- react-hook-form does not validate unmounted fields, but keeps their value and sends it unless the payload leaves it out.
- `shouldUnregister` applies to the whole form. On a single `Rhf*` field it has no effect; the components do not pass it on.
- `RhfSelect` shows an empty select when its value is not an option, but keeps the value in the form. `hideValueOnDisable` only hides the value.

## Tests

- Open the form without saved values: the fields are empty
- Open the form with saved values: every field, also conditional ones, shows its saved value
- Edit, click Avbryt and open edit mode again: the saved values are shown, and nothing is sent
- Fill in a field, hide it by changing another field, and submit: no error from the hidden field, and its value is not sent
- Show the field again: it shows what was entered before it was hidden
- Change a field so an earlier choice is no longer an option: the choice is cleared
