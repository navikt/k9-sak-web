# Choice field validation

Applies to `RhfSelect`, `Select`, `UNSAFE_Combobox`, `RhfCheckbox` and `RhfCheckboxGroup`. Radio groups are in [radio-groups.md](radio-groups.md), and fields shown or hidden by the choice are in the `form-behavior` skill.

## Checklist

| Topic | Rule |
| --- | --- |
| Required | Required when the field it maps to is in the `required` list of the DTO, or when the saksbehandler must choose. Default values are in the `form-behavior` skill. |
| Options | Build the options from kodeverk or backend data, and use the value the backend expects. See the `kodeverk` skill. |
| Error message | Name what is missing: `Velg årsak`, `Velg minst én periode`. |

Clearing a value that is no longer an option, or that belongs to a disabled field, is in the `form-behavior` skill.

## Select (`RhfSelect`, `Select`)

`RhfSelect` adds a hidden empty option, so the field starts empty when the value is `''` or `undefined`. With a plain `Select`, add `<option value="">Velg</option>` yourself.

## Combobox (`UNSAFE_Combobox`)

The form value is the selected options, not the search text. Validate the selected options. With multi-select, require at least one when the field is required, as `DiagnosekodeVelger` does.

## Checkbox (`RhfCheckbox`)

The value is `true` or `false`. `required` accepts `false`, so it cannot force a checkbox to be checked. When the box must be checked, e.g. a confirmation, use `value => (value === true ? undefined : 'melding')`.

## Checkbox group (`RhfCheckboxGroup`)

The value is a list of the checked values. `required` rejects an empty list, but a validator with its own message is clearer, as `requiredValgtePerioder` in `NyBehandlingModal.tsx` does.

## Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `undefined`, `null`, `''` and `[]`; accepts `false` |

Reference implementations:

| Case | File |
| --- | --- |
| Select fields shown depending on earlier choices, and a checkbox group with at least one choice | `packages/v2/gui/src/sak/meny/ny-behandling/components/NyBehandlingModal.tsx` |
| Multi-select combobox that is required only when enabled | `packages/v2/gui/src/shared/diagnosekodeVelger/DiagnosekodeVelger.tsx` |

## Tests

- No choice gives the required error
- A checkbox that must be checked gives an error when unchecked
