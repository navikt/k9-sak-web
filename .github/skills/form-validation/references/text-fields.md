# Text field validation

Decide the validation for each text field from the backend contract. Add a rule only when the backend or the domain requires it. Rules that depend on other fields are in [SKILL.md](../SKILL.md).

Applies to `TextField`, `Textarea`, `RhfTextField` and `RhfTextarea`, e.g. begrunnelse, vurdering and fritekst in brev.

## Checklist

| Topic | Rule |
| --- | --- |
| Required | Read it from the DTO the field is sent in. See below. Reject empty values and values with only whitespace. `required` from `@navikt/ft-form-validators` does this. With a hand-written `validate`, use `value.trim()`. |
| Max length | Use `maxLength` from the OpenAPI schema of the DTO the field is sent in. See below. |
| Min length | Only when the backend or the domain requires it. Do not use it as a measure of quality. |
| Characters | Do not restrict characters without a reason. Use `hasValidText` only where the text ends up somewhere that requires it, e.g. brev. |
| Line breaks | Allow line breaks in `Textarea`. Use `TextField` when the value must be one line. |
| Character counter | Pass the same limit as `maxLength` to `Textarea`. It only shows a counter and does not block input, so the validator is still required. |
| Error message | Say what to fix: `Begrunnelse er påkrevd`, `Begrunnelse kan være maks 4000 tegn`. |

## Required and max length from the backend

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

## Validators

| Validator | From | Behaviour |
| --- | --- | --- |
| `required` | `@navikt/ft-form-validators` | Fails for `null`, `undefined` and whitespace-only text |
| `maxLength(n)`, `minLength(n)` | `@navikt/ft-form-validators` | Count trimmed text; empty values pass, so combine with `required` |
| `hasValidText` | `@navikt/ft-form-validators` | Allows letters, digits, spaces, line breaks and `.'-/%§!?@_()+:;,="&`; rejects tabs |
| `validateTextCharacters` | `@k9-sak-web/gui/utils/validation/validateTextCharacters.js` | Used for brev. Stricter than the backend in some cases and rejects `[` and `]` on purpose, see `regexes.ts` |

## Tests

Cover in the story or test for the form:

- Empty field and whitespace only give the required error
- Text at exactly the limit is accepted, one character over gives the max length error
- Line breaks are kept in a `Textarea`
- The error disappears when the user fixes the value
