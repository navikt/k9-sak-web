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
| Date and periods: `Datovelger`, `Periodevelger`, `PeriodpickerList` | [references/date-fields.md](references/date-fields.md) |
| Radio: `RhfRadioGroup`, `RadioGroup` | [references/radio-groups.md](references/radio-groups.md) |
| Choice: `RhfSelect`, `Select`, `UNSAFE_Combobox`, `RhfCheckbox`, `RhfCheckboxGroup` | [references/choice-fields.md](references/choice-fields.md) |

## Rules across fields

| Topic | Rule |
| --- | --- |
| Revalidation | When a field changes, revalidate the fields whose rules depend on it. Otherwise an error stays after the user has fixed it, or a new error does not appear until submit. |
| Conditionally required | Put the condition in the validator, and revalidate the field when the condition changes. |
| Error placement | Show the error on the field the user must change. Name the other field in the message: `Kan ikke være før "Fra"`. |

Fields hidden by another field are never validated or sent; how to achieve this is in the `form-behavior` skill.

### Tests

- Fixing the field a rule depends on removes the error on the other field
