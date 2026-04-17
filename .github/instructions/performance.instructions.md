---
applyTo: "src/**/*.{tsx,ts}"
---

# Performance Optimization

Core Web Vitals targets and performance patterns for React applications with Aksel Design System on NAIS.

## Core Web Vitals Targets

All user-facing pages must meet "Good" thresholds:

| Metric | Good | Needs Improvement | Poor |
| --- | --- | --- | --- |
| LCP (Largest Contentful Paint) | < 2.5s | 2.5s – 4.0s | > 4.0s |
| INP (Interaction to Next Paint) | < 200ms | 200ms – 500ms | > 500ms |
| CLS (Cumulative Layout Shift) | < 0.1 | 0.1 – 0.25 | > 0.25 |
| TTFB (Time to First Byte) | < 800ms | 800ms – 1800ms | > 1800ms |

## Data Fetching

### Parallel data fetching

```tsx
// ✅ Good — parallel fetching with Promise.all
const [users, metrics, config] = await Promise.all([
  fetchUsers(),
  fetchMetrics(),
  fetchConfig(),
]);

// ❌ Bad — sequential awaits block each other
const users = await fetchUsers();       // 200ms
const metrics = await fetchMetrics();   // 300ms
const config = await fetchConfig();     // 100ms
// Total: 600ms instead of ~300ms
```

### Streaming with Suspense

```tsx
import { Suspense } from "react";
import { Skeleton } from "@navikt/ds-react";

export default function Page() {
  return (
    <VStack gap="space-8">
      <Heading size="large" level="1">Oversikt</Heading>
      <QuickSummary />
      <Suspense fallback={<Skeleton variant="rounded" height={300} />}>
        <SlowAnalytics />
      </Suspense>
    </VStack>
  );
}
```

## Bundle Optimization

### Lazy loading heavy components

```tsx
import { lazy, Suspense } from "react";
import { Skeleton } from "@navikt/ds-react";

// ✅ Good — heavy component only loaded when needed
const HeavyChart = lazy(() => import("@/components/heavy-chart"));

<Suspense fallback={<Skeleton variant="rounded" height={400} />}>
  <HeavyChart />
</Suspense>
```

### Tree-shaking: named imports

```tsx
// ✅ Good — tree-shakeable named import
import { Button, Heading } from "@navikt/ds-react";

// ❌ Bad — imports the entire package, defeats tree-shaking
import * as Aksel from "@navikt/ds-react";
```

### Barrel file anti-pattern

```tsx
// ❌ Bad — barrel export pulls in every component
// components/index.ts
export { Header } from "./header";
export { Footer } from "./footer";
export { HeavyChart } from "./heavy-chart"; // Always bundled even if unused

// ✅ Good — import directly from the component file
import { Header } from "@/components/header";
```

## Aksel-Specific Performance

```tsx
// ✅ Good — individual component imports (tree-shakeable)
import { Button } from "@navikt/ds-react";
import { Heading } from "@navikt/ds-react";

// ❌ Bad — wildcard import loads the entire library
import * as Aksel from "@navikt/ds-react";

// ✅ Good — specific icon import
import { ChevronRightIcon } from "@navikt/aksel-icons";

// ❌ Bad — barrel import of all icons
import * as Icons from "@navikt/aksel-icons";
```

CSS tokens from `@navikt/ds-css` are loaded once globally — no additional performance concern.

## Anti-Patterns

Common performance mistakes to avoid:

1. **Sequential `await`** when requests are independent — use `Promise.all()`
2. **Missing `key` prop** on list items — causes unnecessary re-renders and DOM thrashing
3. **State in parent** when it belongs in child — triggers render cascades in the entire subtree
4. **Missing `React.memo` / `useMemo`** for expensive computations or stable references
5. **Synchronous `import()` of large libraries** — use `React.lazy` or dynamic `import()`
6. **Layout shifts from dynamic content** without skeleton or placeholder
7. **Over-fetching** — returning entire database rows when only 2 fields are needed

## Measurement

- **`web-vitals`** library for Real User Monitoring (RUM)
- **Lighthouse CI** in GitHub Actions for automated performance budgets
- **Chrome DevTools Performance tab** for profiling renders and long tasks

## Backend Performance

Response time budget: **< 200ms** for user-facing APIs.

Key rules:
- **Connection pooling** — reuse database connections across requests
- **Indexed queries** — add indexes for WHERE and ORDER BY columns
- **Pagination** — never return unbounded result sets
- **Avoid N+1 queries** — use JOINs or batch fetching instead of loops
- **Streaming responses** — use `ReadableStream` for large datasets
- **Cache-Control headers** — set appropriate caching for API responses

## Boundaries

### ✅ Always

- Meet Core Web Vitals "Good" thresholds
- Measure performance with Lighthouse
- Use named imports from `@navikt/ds-react` and `@navikt/aksel-icons`

### ⚠️ Ask First

- Adding client-side state management libraries (Zustand, Jotai)
- Custom caching strategies

### 🚫 Never

- Barrel exports that pull in entire packages
- Sequential `await` for independent data fetches
- `import *` from `@navikt/ds-react` or `@navikt/aksel-icons`

## Related

| Resource | Use For |
|----------|---------|
| `@aksel-agent` | Aksel Design System component patterns and spacing tokens |
| `@observability-agent` | Prometheus metrics and Grafana dashboards for Core Web Vitals |
| `playwright-testing` skill | E2E testing to validate performance optimizations |
