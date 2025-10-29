# Remaining Intl Removal Work

## Summary
This document outlines the remaining work to complete the removal of react-intl from the codebase.

## Current Status
- **Files Modified**: 213
- **React-intl Imports**: 0 (all removed from non-test files)
- **Simple Intl Usage**: ✅ Removed
- **Remaining Complex Cases**: 115 FormattedMessage usages in 61 files

## What's Been Done

### Phase 1: Simple Patterns (163 files)
- ✅ Replaced `<FormattedMessage id="key" />` with hardcoded Norwegian text
- ✅ Replaced `intl.formatMessage({ id: 'key' })` with hardcoded text
- ✅ Removed `useIntl()` hook declarations

### Phase 2: Label Component
- ✅ Created `packages/form/src/translations.ts` with all 1653 translations
- ✅ Updated Label component to look up translations internally
- ✅ Removed injectIntl HOC dependency
- ✅ Label component now works without react-intl

### Phase 3: Provider Removal (40 files)
- ✅ Removed all RawIntlProvider wrappers
- ✅ Removed createIntl() and createIntlCache() setup
- ✅ Removed all react-intl imports from non-test files
- ✅ Updated Storybook stories

### Phase 4: Template Literals (10 files)
- ✅ Converted simple FormattedMessage with values to template literals
- Example: `<FormattedMessage id="key" values={{x: val}}/>` → `` `text ${val}` ``

## Remaining Work (115 usages in 61 files)

### Complex Patterns Requiring Manual Conversion

1. **FormattedMessage with Multiple/Complex Values**
   ```tsx
   <FormattedMessage id="key" values={{ dager: x, timer: y }} />
   ```
   → Convert to: ``Tekst med ${x} dager og ${y} timer``

2. **FormattedMessage with Dynamic IDs**
   ```tsx
   <FormattedMessage id={variableId} />
   ```
   → Requires context-specific logic to determine possible values

3. **FormattedMessage with JSX in Values**
   ```tsx
   <FormattedMessage id="key" values={{ br: <br /> }} />
   <FormattedMessage id="key" values={{ b: chunks => <b>{chunks}</b> }} />
   ```
   → Requires rewriting with JSX fragments

4. **Multiline FormattedMessage**
   ```tsx
   <FormattedMessage
     id="key"
     values={{
       param1: value1,
       param2: value2
     }}
   />
   ```
   → Convert to template literal with proper interpolation

### Files with Most Remaining Usage

Top files needing attention (check with):
```bash
cd /home/runner/work/k9-sak-web/k9-sak-web
grep -r "FormattedMessage" packages --include="*.tsx" | \
  grep -v ".test\|.spec\|node_modules" | \
  cut -d: -f1 | sort | uniq -c | sort -rn | head -20
```

## Next Steps

### Step 1: Manual Conversion
For each of the 61 files with remaining FormattedMessage:
1. View the file
2. Look up each translation key in the translations.ts file
3. Convert FormattedMessage to appropriate JSX/template literal
4. Test the change if possible

### Step 2: Remove Dependencies
Update package.json files to remove react-intl:
```bash
find packages -name "package.json" -exec grep -l "react-intl" {} \;
```

### Step 3: Remove i18n Directories
Once all usage is removed:
```bash
find packages -type d -name "i18n" -path "*/packages/*/i18n"
```

### Step 4: Testing
- Run type checker: `yarn ts-check`
- Run linter: `yarn lint`
- Run tests: `yarn test`
- Build: `yarn build`

## Helper Scripts

### Find Remaining FormattedMessage Usage
```bash
grep -r "FormattedMessage" packages --include="*.tsx" --include="*.ts" | \
  grep -v ".test\|.spec\|node_modules\|translations.ts" | wc -l
```

### View Specific File Usage
```bash
grep -n "FormattedMessage" packages/path/to/file.tsx
```

### Look Up Translation
```bash
grep "TranslationKey" packages/*/i18n/nb_NO.json
```

## Translation Reference

All translations are now centralized in:
- `packages/form/src/translations.ts` (1653 translations)

Original sources (for reference only, can be removed after completion):
- Various `packages/*/i18n/nb_NO.json` files (38 files)

## Notes

- Test files (.test.tsx, .spec.tsx) were intentionally left with react-intl as they may need different handling
- The Label component is backwards compatible - it accepts but ignores the `intl` prop
- All changes maintain Norwegian language only (no other languages were supported)
