# GitHub Copilot Instructions for K9 Sak Web

## Project Context

You're working on **k9-sak-web**, a monorepo containing React/TypeScript applications for NAV's K9 case handling system. This system processes various benefit types including Pleiepenger, Omsorgspenger, Opplæringspenger, and Ungdomsytelse.

## Technology Stack

- **React 19.2.0** with TypeScript 5.9.3
- **Vite 7.x** for building and dev server
- **Yarn 4.6.0** - ALWAYS use yarn, never npm
- **NAV Design System** (@navikt/ds-react, @navikt/ds-css, @navikt/ds-tailwind)
- **CSS Modules + Tailwind CSS** for styling
- **Testing**: Prefer Storybook interaction tests for UI components; use Vitest for pure logic and utilities
- **Mocking**: Prefer test data builders and module-level mocks. Avoid MSW and avoid `vi.spyOn` for HTTP.
- **react-hook-form** for form management
- **react-router 7.x** for routing

## Code Style Preferences

### TypeScript

- Use strict null checks (always check for `null` and `undefined`)
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Use type for unions and utility types
- Enable strict mode for new code in `packages/v2/`

### React Patterns

```typescript
// ✅ Preferred: Functional components with TypeScript
interface MyComponentProps {
  title: string;
  onAction: () => void;
  items?: string[];
}

export const MyComponent = ({ title, onAction, items = [] }: MyComponentProps) => {
  // Component logic
  return <div>{title}</div>;
};

// ❌ Avoid: Class components
class MyComponent extends React.Component { }
```

### Hooks Usage

```typescript
// ✅ Proper hook usage with types
const [state, setState] = useState<string>('');
const value = useMemo(() => expensiveComputation(data), [data]);
const callback = useCallback(() => handleAction(), [deps]);

// Custom hooks
const useMyFeature = (id: string) => {
  // Hook logic
  return { data, loading, error };
};
```

### Forms with react-hook-form

```typescript
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
}

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Handle form submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name', { required: true })} />
      {errors.name && <span>This field is required</span>}
    </form>
  );
};
```

### Styling Patterns

```typescript
// ✅ CSS Modules
import styles from './myComponent.module.css';

export const MyComponent = () => (
  <div className={styles.container}>
    <h1 className={styles.title}>Title</h1>
  </div>
);

// ✅ NAV Design System components
import { Button, TextField, Alert } from '@navikt/ds-react';

export const MyForm = () => (
  <div>
    <TextField label="Name" />
    <Button>Submit</Button>
    <Alert variant="info">Information message</Alert>
  </div>
);
```

### Text handling (no i18n, language policy)

```typescript
// ✅ Use plain strings or centralized constants
import { APP_TITLE } from '@k9-sak-web/konstanter';

const MyComponent = () => (
  <div>{APP_TITLE}</div>
);

// Language policy:
// - Domain wording in Norwegian
// - Technical terms in English
const MyOtherComponent = () => <h1>Saksoversikt</h1>; // norsk domene

// Example mixing correctly: norsk domene + engelsk teknisk
const label = 'Kall endpoint for å hente sak';
```

### API Calls & Data Fetching

```typescript
// ✅ Use existing REST API utilities
import { useRestApi } from '@k9-sak-web/rest-api-hooks';

const MyComponent = ({ saksnummer }: Props) => {
  const { data, loading, error } = useRestApi(endpoints.getSak, { saksnummer });

  if (loading) return <Loader />;
  if (error) return <ErrorMessage error={error} />;

  return <div>{data?.title}</div>;
};
```

## Project Structure Awareness

### Monorepo Organization

```
packages/
├── v2/              # Modern code with strict TypeScript (NEW CODE GOES HERE)
├── behandling-*     # Treatment/case type modules
├── fakta-*          # Fact-gathering UI components
├── prosess-*        # Process step components
├── shared-components/ # Reusable UI components
├── types/           # Shared TypeScript types
├── utils/           # Utility functions
├── rest-api/        # API client utilities
└── form/            # Form utilities and components
```

### Import Path Rules

```typescript
// ✅ Use path aliases
import { MyUtil } from '@k9-sak-web/utils';
import { MyType } from '@k9-sak-web/types';

// ✅ V2 code should only import from V2 or external packages
// When in packages/v2/, never import from non-v2 packages

// ❌ Avoid relative imports across packages
import { MyUtil } from '../../../utils/src/myUtil';
```

## Critical Rules

### 1. Package Manager

**ALWAYS use `yarn`, NEVER use `npm`**

```bash
✅ yarn add package-name
✅ yarn install
❌ npm install package-name
```

### 2. Dependency Versions

These packages MUST stay in sync (same version everywhere):

- @navikt/aksel-icons
- @navikt/ds-css
- @navikt/ds-react
- @navikt/ds-tailwind
- @navikt/ft-plattform-komponenter

### 3. V2 Package Isolation

Code in `packages/v2/` cannot import from non-v2 packages. V2 is the modernization zone with stricter TypeScript.

### 4. CSS Modules

- Use `.module.css` extension for CSS modules
- Class names are camelCase in TypeScript (auto-converted from kebab-case)
- Type definitions are auto-generated

### 5. Accessibility

Always include proper ARIA labels and semantic HTML:

```typescript
// ✅ Good accessibility
<button aria-label="Close dialog" onClick={onClose}>
  <XMarkIcon aria-hidden="true" />
</button>

// ❌ Poor accessibility
<div onClick={onClose}>X</div>
```

## Common Patterns

### Loading States

```typescript
// ✅ Show loading indicators
if (isLoading) {
  return <Loader />;
}

if (error) {
  return <Alert variant="error">{error.message}</Alert>;
}

return <DataView data={data} />;
```

### Type Safety

```typescript
// ✅ Use type guards
const isValidData = (data: unknown): data is MyType => {
  return data !== null && typeof data === 'object' && 'id' in data;
};

// ✅ Proper optional chaining
const value = data?.property?.nestedProperty ?? defaultValue;
```

### Storybook testing (preferred for UI components)

```typescript
// Example: test a Storybook story using @storybook/test and React Testing Library
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as stories from './MyComponent.stories';

const { Default } = stories;

test('renders story and handles interaction', async () => {
  render(<Default {...Default.args} />);
  await userEvent.click(screen.getByRole('button'));
  expect(screen.getByText('Lagret')).toBeInTheDocument();
});
```

### Testing Patterns

For UI components, prefer Storybook interaction tests (see Storybook testing section above). Use Vitest for:

- Pure utility functions
- Hooks that don't render UI
- Business logic

```typescript
// ✅ Vitest for utilities/logic
import { expect, test } from 'vitest';
import { formatDate } from './utils';

test('formats date correctly', () => {
  expect(formatDate('2024-01-15')).toBe('15.01.2024');
});
```

For UI, write Storybook interaction tests. If you feel the need to mock HTTP or use `vi.spyOn`, the test probably belongs in Storybook instead of Vitest. For pure logic, use module-level mocks or pass in test doubles via dependency injection.

## File Naming Conventions

- **Components (files + names)**: PascalCase (e.g., `MyComponent.tsx`, export `MyComponent`)
- **Hooks (files + names)**: camelCase starting with `use` (e.g., `useMyHook.ts` exports `useMyHook`)
- **Utilities (files)**: camelCase (e.g., `myUtils.ts`)
- **Types/Interfaces (names)**: PascalCase
- **Constants**: SCREAMING_SNAKE_CASE for true constants
- **CSS Modules (class names)**: camelCase for class names (converted from kebab-case)
- **CSS Modules (files)**: camelCase `myComponent.module.css`
- **Tests**: mirror target file naming (e.g., `MyComponent.spec.tsx`, `myUtils.spec.ts`)
- **Storybook**: match component filename (e.g., `MyComponent.stories.tsx`)
- **Constants**: SCREAMING_SNAKE_CASE for true constants

## What to Generate

### When suggesting code:

1. **Type Safety First**: Always include proper TypeScript types
2. **Accessibility**: Include ARIA labels and semantic HTML
3. **Error Handling**: Include loading, error, and empty states
4. **No i18n**: Use plain strings/constants (centralize if reused)
5. **Language**: Use Norwegian for domain language; keep technical terms in English
6. **Story templates**: Use `packages/storybook/story-templates` and follow `packages/storybook/story-templates/README.md`.
7. **NAV Design System**: Prefer @navikt/ds-react components
8. **CSS Modules**: Use CSS modules for styling, not inline styles

### When refactoring:

1. Move code to `packages/v2/` when possible
2. Convert class components to functional components
3. Add proper TypeScript types
4. Ensure accessibility compliance
5. Use modern React patterns (hooks)

## Anti-Patterns to Avoid

```typescript
// ❌ Don't use npm
npm install something

// ❌ Don't use any without good reason
const data: any = getData();

// ❌ Don't introduce i18n frameworks
import i18n from 'some-i18n-lib';

// ❌ Don't translate technical terms to Norwegian
const tekst = 'Kall endepunkt for å fetch-e data'; // "endepunkt" + "fetch-e" er dårlig

// ❌ Don't write domain content in English
const title = 'Case overview'; // bruk "Saksoversikt"

// ❌ Don't use inline styles
<div style={{ color: 'red' }}>Text</div>

// ❌ Don't ignore null checks
const value = data.property; // Could be undefined

// ❌ Don't create inaccessible UI
<div onClick={handleClick}>Click me</div>

// ❌ Don't use MSW for mocking in tests or vi.spyOn. If vi.spyOn is used, the test should probably be in storybook instead of vitest.

```

## Commands You'll See

```bash
yarn dev              # Start development server (K9)
yarn dev:ung          # Start development server (Ungdomsytelse)
yarn test             # Run tests
yarn test:watch       # Run tests in watch mode
yarn ts-check         # Type check all code
yarn lint             # Lint code
yarn lint:fix         # Auto-fix linting issues
yarn css:lint         # Lint CSS
yarn storybook        # Start Storybook
yarn build            # Build for production
```

## Context Clues

- **NAV**: Norwegian Labour and Welfare Administration
- **K9**: Category 9 benefits (sickness, care benefits)
- **Sak**: Case
- **Behandling**: Treatment/case processing
- **Fakta**: Facts/information
- **Prosess**: Process
- **Ungdomsytelse**: Youth benefit
- **Pleiepenger**: Care benefits
- **Omsorgspenger**: Caregiving benefits
- **Opplæringspenger**: Training benefits

## Summary

When writing code for this project:

- Use TypeScript with proper types
- Follow React hooks patterns
- Use NAV Design System components
- Ensure accessibility
- Write tests
- Use CSS modules for styling
- Always use yarn (never npm)
- Keep V2 code isolated
- Handle errors and loading states
