# Date field validation

Use `Datovelger` from `@k9-sak-web/gui/shared/datovelger/Datovelger.js` in react-hook-form forms. The form value is an ISO date string (`YYYY-MM-DD`) or `''`. fom/tom and several periods are in [SKILL.md](../SKILL.md).

## Checklist

| Topic | Rule |
| --- | --- |
| Required | Required when the field is in the `required` list of the DTO it is sent in, or when the domain requires it. Date fields have `format: 'date'` and rarely other limits in the schema. Use `required`. |
| Earliest and latest date | Decide from the domain, e.g. within the søknadsperiode, not in the future. Set `fromDate`/`toDate` and add a validator; see the limitations below. |
| Weekends and other days | Use `disableWeekends`; it adds `dateIsNotWeekend`. Use `disabledDays` only for days that can never be chosen. |
| Error message | Name the limit as a date: `Dato må være etter 01.01.2025`. |

## Limitations in `Datovelger`

`DatovelgerPlain` passes `fromDate` and `toDate` only to the calendar, not to `useDatepicker`:

- **Typed dates outside `fromDate`/`toDate` are accepted.** Add a validator for the limit, e.g. `dateAfterOrEqual` and `dateBeforeOrEqual` from `@navikt/ft-form-validators`.
- **Text that is not a date, and disabled days, become `''`.** A required field then shows the required error instead of an invalid date error, and an optional field silently becomes empty. `hasValidDate` cannot catch this, because it never sees the typed text.

When the default calendar range of five years back and forward is too narrow, set `fromDate`/`toDate`.

## Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `''` |
| `dateAfterOrEqual(date)`, `dateBeforeOrEqual(date)` | `@navikt/ft-form-validators` | Limits against a fixed date |
| `dateBeforeOrEqualToToday`, `dateAfterOrEqualToToday` | `@navikt/ft-form-validators` | Limits against today |
| `dateIsNotWeekend` | `@k9-sak-web/gui/utils/validation/validators.js` | Added by `disableWeekends` |

## Tests

- Empty required field gives the required error
- The first and last allowed date are accepted, the day before and after give an error, both when typed and when chosen in the calendar
- Text that is not a date, e.g. `32.13.2025`, does not pass as a valid value
