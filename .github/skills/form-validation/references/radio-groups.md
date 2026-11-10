# Radio group validation

Use `RhfRadioGroup` from `@navikt/ft-form-hooks` with `Radio` from `@navikt/ds-react`. Fields shown or hidden by the answer are in the `form-behavior` skill.

## Checklist

| Topic | Rule |
| --- | --- |
| Required | Required when the field it maps to is in the `required` list of the DTO, or when the saksbehandler must make a decision. Use `required`. In a hand-written `validate`, check for `undefined` and `''`, never `!value`, which also rejects `false`. Default values are in the `form-behavior` skill. |
| Value type | The form value and the `Radio` values must have the same type. Aksel compares them with `===`, so `'true'` never selects `<Radio value={true}>`. |
| Values | Use the value the backend expects, e.g. a boolean or a kodeverk constant, so no mapping is needed on submit. Map in `onSubmit` only when the options do not match the DTO one to one. |
| Error message | Name what is missing: `Vurdering er påkrevd`. |

## Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `undefined`, `null` and `''`; accepts `false` |

Reference implementations:

| Case | File |
| --- | --- |
| Boolean answer with a field shown for "Ja" | `packages/v2/gui/src/fakta/vurder-nyoppstartet/VurderNyoppstartet.tsx` |
| Three options mapped to the DTO on submit | `packages/v2/gui/src/fakta/sykdom-og-opplæring/2-sykdom/SykdomUperiodisertForm.tsx` |

Do not copy: `packages/v2/gui/src/prosess/vilkar-alder/components/AldersvilkarForm.tsx` sets the saved answer as `'true'`/`'false'`, while the radios have the values `true`/`false`.

## Tests

- No answer gives the required error
- "Nei" is accepted when its value is `false`
