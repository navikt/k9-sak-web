---
name: form-validation
description: 'Validation of input fields in saksbehandling forms, per field type: what to decide for each field, which validators to use and which edge cases to test. Covers text fields (TextField, Textarea, begrunnelse, fritekst) and date fields (Datovelger, Periodevelger, DatePicker) so far. USE FOR: adding, changing or reviewing validation of a form field, required fields, maks antall tegn, maxLength, minLength, ugyldige tegn, hasValidText, datovelger, ugyldig dato, fom/tom, dato før/etter, helgedag, feilmelding på felt, "Begrunnelse er påkrevd", validate/rules in react-hook-form or Rhf* components. DO NOT USE FOR: validating backend data with assertion functions (use typescript), handling errors from mutations (use data-fetching), or validating skills (use skill-authoring).'
---

# Form validation

Decide the validation for each field from its type and from the backend contract. Add a rule only when the backend or the domain requires it. Applies to new fields and fields you change anyway.

## Text fields

Applies to `TextField`, `Textarea`, `RhfTextField` and `RhfTextarea`, e.g. begrunnelse, vurdering and fritekst in brev.

### Checklist

| Topic | Rule |
| --- | --- |
| Required | Read it from the DTO the field is sent in. See below. Reject empty values and values with only whitespace. `required` from `@navikt/ft-form-validators` does this. With a hand-written `validate`, use `value.trim()`. |
| Max length | Use `maxLength` from the OpenAPI schema of the DTO the field is sent in. See below. |
| Min length | Only when the backend or the domain requires it. Do not use it as a measure of quality. |
| Characters | Do not restrict characters without a reason. Use `hasValidText` only where the text ends up somewhere that requires it, e.g. brev. |
| Line breaks | Allow line breaks in `Textarea`. Use `TextField` when the value must be one line. |
| Character counter | Pass the same limit as `maxLength` to `Textarea`. It only shows a counter and does not block input, so the validator is still required. |
| Error message | Say what to fix: `Begrunnelse er påkrevd`, `Begrunnelse kan være maks 4000 tegn`. |

### Required and max length from the backend

The generated clients export a JSON schema for each DTO, with a `required` list and `minLength`/`maxLength` on string fields.

| Schema | Meaning for the field |
| --- | --- |
| In `required` and `minLength` ≥ 1 | Must be filled in |
| In `required` and `minLength: 0` | Must be sent, but the backend accepts an empty string |
| Not in `required` | Optional for the backend |

The frontend can require a field that the backend accepts empty, e.g. a begrunnelse required by the domain, but never accept less than the backend.

Read the schema of the DTO that is actually sent, not the DTO the value is read from. For an aksjonspunkt, this is the DTO for that aksjonspunkt, e.g. `begrunnelse` in `$k9_sak_kontrakt_søknad_AvklarTilleggsopplysningerDto` is not in `required` and has `maxLength: 4000`.

Search for the DTO in `node_modules/<client-package>/src/schemas.gen.ts`. The schemas are re-exported from `@k9-sak-web/backend/<backend>/generated/schemas.js`.

Reference implementation: `packages/v2/gui/src/sak/meldinger/FritekstInput.tsx`.

```typescript
import { $k9_sak_kontrakt_dokument_FritekstbrevinnholdDto as $FritekstbrevinnholdDto } from '@k9-sak-web/backend/k9sak/generated/schemas.js';

const tittelMaxLength = $FritekstbrevinnholdDto.properties.overskrift.maxLength;
```

With `@navikt/ft-form-validators`, pass the same constant to `maxLength(...)` and to the `maxLength` prop of the field.

If a string field in the schema has no `maxLength`, do not pick a limit in the frontend. Ask for the limit to be added in the backend.

`maxLength` and `minLength` in `@navikt/ft-form-validators` count the trimmed text, while the backend checks the value that is sent. Trim the value before sending it if leading or trailing whitespace can make it exceed the limit.

Do not copy: `packages/v2/gui/src/fakta/ny-inntekt/src/components/felles/FaktaBegrunnelseTextField.tsx` hardcodes `maxLength(1500)` instead of reading the limit from the schema.

### Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `null`, `undefined` and whitespace-only text |
| `maxLength(n)`, `minLength(n)` | `@navikt/ft-form-validators` | Count trimmed text; empty values pass, so combine with `required` |
| `hasValidText` | `@navikt/ft-form-validators` | Allows letters, digits, spaces, line breaks and `.'-/%§!?@_()+:;,="&`; rejects tabs |
| `validateTextCharacters` | `@k9-sak-web/gui/utils/validation/validateTextCharacters.js` | Used for brev. Stricter than the backend in some cases and rejects `[` and `]` on purpose, see `regexes.ts` |

### Tests

Cover in the story or test for the form:

- Empty field and whitespace only give the required error
- Text at exactly the limit is accepted, one character over gives the max length error
- Line breaks are kept in a `Textarea`
- The error disappears when the user fixes the value

## Date fields

Use `Datovelger` from `@k9-sak-web/gui/shared/datovelger/Datovelger.js` in react-hook-form forms, and `Periodevelger` from `@k9-sak-web/gui/shared/periodevelger/Periodevelger.js` for a fom/tom pair. The form value is an ISO date string (`YYYY-MM-DD`) or `''`.

### Checklist

| Topic | Rule |
| --- | --- |
| Required | Read it from the DTO as for text fields. Date fields have `format: 'date'` and rarely other limits in the schema. Use `required`. |
| Earliest and latest date | Decide from the domain, e.g. within the søknadsperiode, not in the future. Set `fromDate`/`toDate` and add a validator; see the limitations below. |
| Weekends and other days | Use `disableWeekends` on `Datovelger`; it adds `dateIsNotWeekend`. Use `disabledDays` only for days that can never be chosen. |
| Relation to other dates | fom ≤ tom. Use `Periodevelger`, which validates this and revalidates the other field when one changes. |
| Several periods | Decide from the domain whether periods may overlap, and whether a period may start on the day another ends. Validate only what is not allowed. When overlap is checked, revalidate the other periods when one changes, as `DelvisOpplæring.tsx` does. |
| Error message | Name the limit as a date: `Dato må være etter 01.01.2025`, `Kan ikke være før "Fra"`. |

### Limitations in `Datovelger`

`DatovelgerPlain` passes `fromDate` and `toDate` only to the calendar, not to `useDatepicker`:

- **Typed dates outside `fromDate`/`toDate` are accepted.** Add a validator for the limit, e.g. `dateAfterOrEqual` and `dateBeforeOrEqual` from `@navikt/ft-form-validators`. `Periodevelger` does this for `minDate`/`maxDate`.
- **Text that is not a date, and disabled days, become `''`.** A required field then shows the required error instead of an invalid date error, and an optional field silently becomes empty. `hasValidDate` cannot catch this, because it never sees the typed text.

When the default calendar range of five years back and forward is too narrow, set `fromDate`/`toDate`.

### Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `''` |
| `dateAfterOrEqual(date)`, `dateBeforeOrEqual(date)` | `@navikt/ft-form-validators` | Limits against a fixed date or another field's date |
| `dateBeforeOrEqualToToday`, `dateAfterOrEqualToToday` | `@navikt/ft-form-validators` | Limits against today |
| `dateIsNotWeekend` | `@k9-sak-web/gui/utils/validation/validators.js` | Added by `disableWeekends` |
| `checkForOverlap(index, periode, allePerioder)` | `@k9-sak-web/lib/dateUtils/dateUtils.js` | `true` if the period overlaps another in the list. Periods sharing a day overlap; consecutive days do not. Ignores periods with an empty fom or tom |

For a list of periods that must not overlap, use `PeriodpickerList` from `@k9-sak-web/gui/shared/periodPickerList/PeriodpickerList.js`. It validates required, valid date, `fromDate`/`toDate`, fom ≤ tom and overlap. When overlap is allowed, or a period may start on the day another ends, write the check yourself.

Reference implementations:

| Case | File |
| --- | --- |
| Single fom/tom with `dateAfterOrEqual` | `packages/v2/gui/src/prosess/tilkjent-ytelse/components/manuellePerioder/NyPeriode.tsx` |
| Several periods within a limit, with overlap check | `packages/v2/gui/src/shared/periodPickerList/PeriodpickerList.tsx` |

### Tests

- Empty required field gives the required error
- The first and last allowed date are accepted, the day before and after give an error, both when typed and when chosen in the calendar
- Text that is not a date, e.g. `32.13.2025`, does not pass as a valid value
- fom after tom gives an error, and the error on the other field disappears when one of them is fixed
- With several periods: overlap gives an error if it is not allowed, and is accepted if it is
