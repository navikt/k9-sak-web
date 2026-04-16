---
name: storybook-testing
description: 'Patterns for writing Storybook stories and interaction tests in k9-sak-web. USE FOR: creating stories for v2 components, writing play() interaction tests, setting up fake backend clients for stories, structuring Default vs interaction stories, and running Storybook tests with Vitest addon. DO NOT USE FOR: Vitest unit tests (use for pure logic/utils only), MSW setup, or vi.spyOn HTTP mocking.'
---

# Storybook Testing

Storybook is the primary testing tool for React components in v2. Interaction tests run with the Storybook Vitest addon.

## Story File Conventions

- File: `MyComponent.stories.tsx` alongside `MyComponent.tsx`
- Title: `'gui/<path>/MyComponent.tsx'` mirroring the file path
- Import from `@storybook/react-vite`, not `@storybook/react`

```typescript
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import MyComponent from './MyComponent.js';

const meta = {
  title: 'gui/fakta/myfeature/MyComponent.tsx',
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;
export default meta;

type Story = StoryObj<typeof meta>;
```

## Story Structure Rules

| Story type | Has `play`? | Purpose |
|---|---|---|
| `Default` (or `DefaultStory`) | No | Interactive via args/controls in Storybook UI |
| Named interaction stories | Yes | Automated test scenarios run in Storybook test command |

```typescript
// ✅ Default: interactive, no play
export const DefaultStory: Story = {
  args: { title: 'Test', items: [] },
};

// ✅ Interaction test: specific scenario with play
export const SendsBrevOnSubmit: Story = {
  args: { ... },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    await step('Fyll ut skjema', async () => {
      await userEvent.click(canvas.getByLabelText('Mal'));
      // ...
    });
    await expect(canvas.getByText('Sendt')).toBeInTheDocument();
  },
};
```

## Fake Backend Pattern

**Never use MSW.** Inject fake API clients via React Context.

### Step 1: Fake class implements the API interface
```typescript
// storybook/mocks/FakeMyFeatureApi.ts
import { action } from 'storybook/actions';
import type { MyFeatureApi } from '../../myfeature/api/MyFeatureApi.js';
import type { MyDataDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export class FakeMyFeatureApi implements MyFeatureApi {
  public fakeDelayMillis = 800; // Set to 0 in play() stories

  async getMyData(id: string): Promise<MyDataDto> {
    action('getMyData')({ id });
    return { id, name: 'Test data' };
  }

  async saveMyData(data: unknown): Promise<void> {
    action('saveMyData')(data);
  }
}
```

### Step 2: Decorator wraps the context
```typescript
// storybook/decorators/withFakeMyFeatureApi.tsx
import type { Decorator } from '@storybook/react';
import { FakeMyFeatureApi } from '../mocks/FakeMyFeatureApi.js';
import { MyFeatureApiContext } from '../../myfeature/api/MyFeatureApiContext.js';

export const withFakeMyFeatureApi = (): Decorator => Story => {
  const api = new FakeMyFeatureApi();
  return (
    <MyFeatureApiContext value={api}>
      <Story />
    </MyFeatureApiContext>
  );
};
```

### Step 3: Use in stories
```typescript
const api = new FakeMyFeatureApi();

const meta = {
  title: 'gui/myfeature/MyComponent.tsx',
  component: MyComponent,
  decorators: [withFakeMyFeatureApi()],
  beforeEach: () => {
    api.reset(); // Reset stateful fakes between stories
  },
} satisfies Meta<typeof MyComponent>;
```

### Stateful fakes (for asserting calls)
```typescript
export class FakeMyFeatureApi implements MyFeatureApi {
  #lastSavedData: unknown;

  get lastSavedData() { return this.#lastSavedData; }

  reset() { this.#lastSavedData = undefined; }

  async saveMyData(data: unknown): Promise<void> {
    this.#lastSavedData = data;
    action('saveMyData')(data);
  }
}

// In play():
play: async ({ canvasElement }) => {
  // ... trigger save ...
  expect(api.lastSavedData).toEqual({ expected: 'value' });
},
```

## Interaction Test Tips

- Use `step()` to group assertions for better test output
- Use `await userEvent.click/type/selectOptions` — never `.click()` directly
- Use `fn()` for prop callbacks you want to assert on:
  ```typescript
  args: { onSave: fn() },
  play: async ({ args }) => {
    // ...trigger save...
    expect(args.onSave).toHaveBeenCalledWith({ ... });
  },
  ```
- Set `api.fakeDelayMillis = 0` in the play function to avoid slow tests

## Form Validation Stories

Collect validation/error stories in dedicated named stories:

```typescript
export const VisValideringsfeil: Story = {
  args: { /* minimal args */ },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Send' }));
    await expect(canvas.getByText('Feltet er påkrevd')).toBeInTheDocument();
  },
};
```

## Running Tests

```bash
yarn storybook                           # Start Storybook dev server
yarn build-storybook-test                # Build Storybook for Storybook test command
yarn test-storybook                      # Run all interaction tests
yarn test-storybook -- --watch           # Watch mode
```

## Common Shared Mocks

Shared mock data and utilities live in `packages/v2/gui/src/storybook/mocks/`:

- `fakePdf.ts` — returns a fake `Blob` for PDF preview tests
- `ignoreUnusedDeclared.ts` — suppresses unused-variable lint in fakes
- `arbeidsgivere.json` — reusable mock arbeidsgiver data
- `personopplysninger.ts` — reusable mock personopplysninger

## Stories with `useSuspenseQuery`

Components that use `useSuspenseQuery` need `QueryClientProvider` and `Suspense` in addition to the fake API context. Create a local `withFakeApi` decorator:

```typescript
import type { Decorator } from '@storybook/react-vite';
import { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MyFeatureApiContext } from './api/MyFeatureApiContext.js';
import type { MyDataDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

const withFakeApi = (data: MyDataDto): Decorator => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return Story => (
    <QueryClientProvider client={queryClient}>
      <MyFeatureApiContext value={{ getMyData: async () => data }}>
        <Suspense>
          <Story />
        </Suspense>
      </MyFeatureApiContext>
    </QueryClientProvider>
  );
};

const meta = {
  decorators: [withFakeApi(mockData)],
  args: { behandlingUuid: 'test-uuid' },
} satisfies Meta<typeof MyComponent>;
```

Per-story data overrides use story-level decorators:
```typescript
export const SpecificScenario: Story = {
  decorators: [withFakeApi(alternativeData)],
};
```

## Kodeverk decorator

Components that use `K9KodeverkoppslagContext` (the type-safe kodeverk system) need a decorator in stories. Use `withK9Kodeverkoppslag()` — it provides mock kodeverk for all backends:

```typescript
import withK9Kodeverkoppslag from '@k9-sak-web/gui/storybook/decorators/withK9Kodeverkoppslag.js';

const meta = {
  title: 'gui/fakta/myfeature/MyComponent',
  component: MyComponent,
  decorators: [withK9Kodeverkoppslag()],
} satisfies Meta<typeof MyComponent>;
```

For legacy components still using `useKodeverkContext()`, use `withKodeverkContext()` instead. **Do not use `withKodeverkContext()` in new code.**

**Never** inline kodeverk mock data in stories. The decorators cover all kodeverk lookups automatically.
