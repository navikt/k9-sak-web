---
name: aksel-spacing
description: Responsive layout patterns using Aksel spacing tokens with Box, VStack, HStack, and HGrid
---

# Aksel Spacing Skill

This skill provides responsive layout patterns using Nav Aksel Design System spacing tokens.

## Critical Rule

**NEVER use Tailwind padding/margin utilities (`p-`, `m-`, `px-`, `py-`) with Aksel components.**

Always use Aksel spacing tokens. Token names reflect **rem-based pixel equivalents** at 16px base — `space-16` = 1rem, `space-24` = 1.5rem, etc.

## Spacing Tokens Reference

All tokens are rem values. The number in the name equals `value × 16px`.

```
space-0   → 0rem
space-1   → 0.0625rem   (micro, borders)
space-2   → 0.125rem    (micro)
space-4   → 0.25rem     (micro)
space-6   → 0.375rem    (micro)
space-8   → 0.5rem      (tight)
space-12  → 0.75rem     (tight)
space-16  → 1rem        ← Form field gaps, small padding
space-20  → 1.25rem
space-24  → 1.5rem      ← Card padding (mobile), section gaps
space-28  → 1.75rem
space-32  → 2rem        ← Card padding (desktop)
space-36  → 2.25rem
space-40  → 2.5rem      ← Page padding (desktop)
space-44  → 2.75rem
space-48  → 3rem        ← Page padding block (desktop)
space-56  → 3.5rem
space-64  → 4rem
space-72  → 4.5rem
space-80  → 5rem
space-96  → 6rem
space-128 → 8rem
```

## Minimum Supported Size

The minimum supported screen size is **lg (1024px)**. Responsive breakpoints below `lg` (`xs`, `sm`, `md`) are not needed unless the component is explicitly designed for smaller screens.

Use `lg` and `2xl` breakpoints for layouts that adapt between desktop sizes:

```typescript
// ✅ lg → 2xl responsive
padding={{ lg: 'space-32', '2xl': 'space-40' }}
gap={{ lg: 'space-24', '2xl': 'space-32' }}
columns={{ lg: 3, '2xl': 4 }}
```

## Page Container Pattern

```typescript
import { Box, VStack } from '@navikt/ds-react';

export default function Page() {
  return (
    <Box
      paddingBlock={{ lg: 'space-40', '2xl': 'space-48' }}
      paddingInline={{ lg: 'space-40', '2xl': 'space-48' }}
    >
      <VStack gap={{ lg: 'space-24', '2xl': 'space-32' }}>
        {/* Page content */}
      </VStack>
    </Box>
  );
}
```

## Card Pattern

```typescript
import { Box, VStack, Heading, BodyShort } from '@navikt/ds-react';

export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box
      background="surface-default"
      padding="space-32"
      borderRadius="large"
      borderWidth="1"
      borderColor="border-subtle"
    >
      <VStack gap="space-16">
        <Heading size="medium">{title}</Heading>
        <BodyShort>{children}</BodyShort>
      </VStack>
    </Box>
  );
}
```

## Form Layout Pattern

```typescript
import { VStack, HStack, TextField, Button } from '@navikt/ds-react';

export function UserForm() {
  return (
    <VStack gap="space-24">
      <VStack gap="space-16">
        <TextField label="Fornavn" />
        <TextField label="Etternavn" />
        <TextField label="E-post" type="email" />
      </VStack>

      <HStack gap="space-16" justify="end">
        <Button variant="secondary">Avbryt</Button>
        <Button variant="primary">Lagre</Button>
      </HStack>
    </VStack>
  );
}
```

## Dashboard Grid Pattern

```typescript
import { HGrid, VStack, Box, Heading } from '@navikt/ds-react';

export function Dashboard() {
  return (
    <VStack gap="space-32">
      <Heading size="xlarge">Oversikt</Heading>

      <HGrid gap="space-16" columns={{ lg: 2, '2xl': 4 }}>
        <MetricCard title="Brukere" value="1 234" />
        <MetricCard title="Inntekt" value="5 678" />
        <MetricCard title="Bestillinger" value="910" />
        <MetricCard title="Vekst" value="+12%" />
      </HGrid>

      <Box
        background="surface-subtle"
        padding="space-32"
        borderRadius="large"
      >
        {/* Innhold */}
      </Box>
    </VStack>
  );
}
```

## Two-Column Layout Pattern

```typescript
import { HGrid, Box, VStack } from '@navikt/ds-react';

export function TwoColumnLayout() {
  return (
    <HGrid gap="space-24" columns={2}>
      <Box
        background="surface-default"
        padding="space-32"
        borderRadius="large"
      >
        <VStack gap="space-16">
          {/* Venstre innhold */}
        </VStack>
      </Box>

      <Box
        background="surface-subtle"
        padding="space-32"
        borderRadius="large"
      >
        <VStack gap="space-16">
          {/* Høyre innhold */}
        </VStack>
      </Box>
    </HGrid>
  );
}
```

## Filter Section Pattern

```typescript
import { Box, VStack, HGrid, Select, TextField, Heading } from '@navikt/ds-react';

export function FilterSection() {
  return (
    <Box
      background="surface-subtle"
      padding="space-24"
      borderRadius="large"
    >
      <VStack gap="space-16">
        <Heading size="small">Filtre</Heading>

        <HGrid gap="space-16" columns={3}>
          <Select label="Avdeling">
            <option>Alle</option>
          </Select>

          <Select label="Status">
            <option>Alle</option>
          </Select>

          <TextField label="Søk" />
        </HGrid>
      </VStack>
    </Box>
  );
}
```

## Common Patterns Cheatsheet

```typescript
// ✅ Page padding (responsive lg → 2xl)
paddingBlock={{ lg: 'space-40', '2xl': 'space-48' }}
paddingInline={{ lg: 'space-40', '2xl': 'space-48' }}

// ✅ Card / panel padding
padding="space-32"

// ✅ Section gaps (responsive lg → 2xl)
gap={{ lg: 'space-24', '2xl': 'space-32' }}

// ✅ Form field gaps
gap="space-16"

// ✅ Button group gaps
gap="space-16"

// ❌ NEVER use Tailwind
className="p-4 m-2"   // WRONG
className="px-6 py-4" // WRONG
```

## Responsive Breakpoints

```
xs → 0px      (mobil, default)
sm → 480px
md → 768px    (nettbrett)
lg → 1024px   (desktop) ← minimum supported size
2xl → 1440px
```

Do not add responsive variants below `lg` unless the component is explicitly designed for mobile/tablet use.
