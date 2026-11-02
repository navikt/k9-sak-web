---
name: form-validation
description: 'Validation of input fields in saksbehandling forms (react-hook-form and Rhf* components): what to decide per field type, rules that involve several fields, which validators to use and which cases to test. USE FOR: adding, changing or reviewing validation, påkrevd felt, begrunnelse, fritekst, maks antall tegn, maxLength, ugyldige tegn, hasValidText, datovelger, ugyldig dato, dato før/etter, helgedag, radioknapp, RhfRadioGroup, ja/nei, forhåndsvalgt svar, nedtrekksliste, RhfSelect, combobox, avkrysningsboks, RhfCheckbox, fom/tom, Periodevelger, PeriodpickerList, overlapp, overlappende perioder, avhengige felt, betinget påkrevd, feilmelding som ikke forsvinner. DO NOT USE FOR: hidden fields and what the form submits (use form-behavior), validating backend data with assertion functions (use typescript), handling errors from mutations (use data-fetching), or validating skills (use skill-authoring).'
---

# Form validation

Decide the validation for each field from its type and the backend contract, and check the rules that involve several fields. Applies to new forms and forms you change anyway.

## Field types

Read the file for each field type in the form before writing or reviewing its validation.

| Field type | File |
| --- | --- |
| Text: `TextField`, `Textarea`, `RhfTextField`, `RhfTextarea` | [references/text-fields.md](references/text-fields.md) |
| Date: `Datovelger` | [references/date-fields.md](references/date-fields.md) |
| Radio: `RhfRadioGroup`, `RadioGroup` | [references/radio-groups.md](references/radio-groups.md) |
| Choice: `RhfSelect`, `Select`, `UNSAFE_Combobox`, `RhfCheckbox`, `RhfCheckboxGroup` | [references/choice-fields.md](references/choice-fields.md) |

## Rules across fields

| Topic | Rule |
| --- | --- |
| Revalidation | When a field changes, revalidate the fields whose rules depend on it. Otherwise an error stays after the user has fixed it, or a new error does not appear until submit. |
| Conditionally required | Put the condition in the validator, and revalidate the field when the condition changes. |
| Error placement | Show the error on the field the user must change. Name the other field in the message: `Kan ikke være før "Fra"`. |

Fields hidden by another field are never validated or sent; how to achieve this is in the `form-behavior` skill.

### fom and tom

Use `Periodevelger` from `@k9-sak-web/gui/shared/periodevelger/Periodevelger.js` for a fom/tom pair. It validates fom ≤ tom, validates `minDate`/`maxDate` also for typed dates, and revalidates the other field when one changes. fom equal to tom is accepted.

Do not copy: `packages/v2/gui/src/prosess/tilkjent-ytelse/components/manuellePerioder/NyPeriode.tsx` validates tom against fom with `dateAfterOrEqual`, but does not revalidate tom when fom changes.

### Several periods

Decide from the domain:

- whether periods may overlap
- whether a period may start on the day another ends

Validate only what is not allowed. When overlap is checked, revalidate the other periods when one changes.

| Tool | From | Behaviour |
| --- | --- | --- |
| `PeriodpickerList` | `@k9-sak-web/gui/shared/periodPickerList/PeriodpickerList.js` | List of periods that must not overlap. Validates required, valid date, `fromDate`/`toDate`, fom ≤ tom and overlap, and revalidates all fields on change after the first submit |
| `checkForOverlap(index, periode, allePerioder)` | `@k9-sak-web/lib/dateUtils/dateUtils.js` | `true` if the period overlaps another in the list. Periods sharing a day overlap; consecutive days do not. Ignores periods with an empty fom or tom |

When overlap is allowed, or a period may start on the day another ends, write the check yourself. `packages/v2/gui/src/fakta/sykdom-og-opplæring/3-nødvendig-opplæring/components/DelvisOpplæring.tsx` shows a hand-written list that uses `checkForOverlap` and revalidates the other periods.

### Tests

- Fixing the field a rule depends on removes the error on the other field
- fom after tom gives an error, fom equal to tom is accepted
- With several periods: overlap, a shared day and consecutive days give an error or are accepted as decided
