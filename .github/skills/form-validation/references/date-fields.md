# Date and period field validation

Use `Datovelger` from `@k9-sak-web/gui/shared/datovelger/Datovelger.js` for a single date, `Periodevelger` from `@k9-sak-web/gui/shared/periodevelger/Periodevelger.js` for a fom/tom pair, and `PeriodpickerList` from `@k9-sak-web/gui/shared/periodPickerList/PeriodpickerList.js` for a list of non-overlapping periods. Each date value in the form is an ISO date string (`YYYY-MM-DD`) or `''`.

## Checklist

| Topic | Rule |
| --- | --- |
| Required | Required when the field is in the `required` list of the DTO it is sent in, or when the domain requires it. Date fields have `format: 'date'` and rarely other limits in the schema. Use `required`. |
| Earliest and latest date | Decide from the domain, e.g. within the søknadsperiode, not in the future. Set `fromDate`/`toDate` and add a validator; see the limitations below. |
| Weekends and other days | Use `disableWeekends`; it adds `dateIsNotWeekend`. Use `disabledDays` only for days that can never be chosen. |
| fom and tom | fom ≤ tom, and changing one revalidates the other. See below. |
| Several periods | Decide from the domain whether periods may overlap, and whether a period may start on the day another ends. See below. |
| Error message | Name the limit as a date or the other field: `Dato må være etter 01.01.2025`, `Kan ikke være før "Fra"`. |

## Limitations in `Datovelger`

`DatovelgerPlain` passes `fromDate` and `toDate` only to the calendar, not to `useDatepicker`:

- **Typed dates outside `fromDate`/`toDate` are accepted.** Add a validator for the limit, e.g. `dateAfterOrEqual` and `dateBeforeOrEqual` from `@navikt/ft-form-validators`.
- **Text that is not a date, and disabled days, become `''`.** A required field then shows the required error instead of an invalid date error, and an optional field silently becomes empty. `hasValidDate` cannot catch this, because it never sees the typed text.

When the default calendar range of five years back and forward is too narrow, set `fromDate`/`toDate`.

## fom and tom

Use `Periodevelger` for a fom/tom pair. It validates fom ≤ tom, validates `minDate`/`maxDate` also for typed dates, and revalidates the other field when one changes. fom equal to tom is accepted.

Do not copy: `packages/v2/gui/src/prosess/tilkjent-ytelse/components/manuellePerioder/NyPeriode.tsx` validates tom against fom with `dateAfterOrEqual`, but does not revalidate tom when fom changes.

## Several periods

Decide from the domain:

- whether periods may overlap
- whether a period may start on the day another ends

Validate only what is not allowed. When overlap is checked, revalidate the other periods when one changes.

| Tool | From | Behaviour |
| --- | --- | --- |
| `PeriodpickerList` | `@k9-sak-web/gui/shared/periodPickerList/PeriodpickerList.js` | List of periods that must not overlap. Validates required, valid date, `fromDate`/`toDate`, fom ≤ tom and overlap, and revalidates all fields on change after the first submit |
| `checkForOverlap(index, periode, allePerioder)` | `@k9-sak-web/lib/dateUtils/dateUtils.js` | `true` if the period overlaps another in the list. Periods sharing a day overlap; consecutive days do not. Ignores periods with an empty fom or tom |

When overlap is allowed, or a period may start on the day another ends, write the check yourself. `packages/v2/gui/src/fakta/sykdom-og-opplæring/3-nødvendig-opplæring/components/DelvisOpplæring.tsx` shows a hand-written list that uses `checkForOverlap` and revalidates the other periods.

## Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `''` |
| `dateAfterOrEqual(date)`, `dateBeforeOrEqual(date)` | `@navikt/ft-form-validators` | Limits against a fixed date or another field's date |
| `dateBeforeOrEqualToToday`, `dateAfterOrEqualToToday` | `@navikt/ft-form-validators` | Limits against today |
| `dateIsNotWeekend` | `@k9-sak-web/gui/utils/validation/validators.js` | Added by `disableWeekends` |

## Tests

- Empty required field gives the required error
- The first and last allowed date are accepted, the day before and after give an error, both when typed and when chosen in the calendar
- Text that is not a date, e.g. `32.13.2025`, does not pass as a valid value
- fom after tom gives an error, fom equal to tom is accepted, and fixing one removes the error on the other
- With several periods: overlap, a shared day and consecutive days give an error or are accepted as decided
