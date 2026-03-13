---
applyTo: "**/*.{tsx,ts}"
---

# Aksel Design System

## Spacing Rules

**CRITICAL**: Always use Nav DS spacing tokens, never Tailwind padding/margin utilities.

### ✅ Correct Patterns

```tsx
import { Box, VStack, HGrid } from "@navikt/ds-react";

// Page container
<main className="max-w-7xl mx-auto">
  <Box
    paddingBlock={{ xs: "space-16", md: "space-24" }}
    paddingInline={{ xs: "space-16", md: "space-40" }}
  >
    {children}
  </Box>
</main>

// Component with responsive padding
<Box
  background="surface-subtle"
  padding={{ xs: "space-12", sm: "space-16", md: "space-24" }}
  borderRadius="large"
>
  <Heading size="large" level="2">Title</Heading>
  <BodyShort>Content</BodyShort>
</Box>

// Directional padding
<Box
  paddingBlock="space-16"    // Top and bottom
  paddingInline="space-24"   // Left and right
>
```

### ❌ Incorrect Patterns

```tsx
// Never use Tailwind padding/margin
<div className="p-4 md:p-6">  // ❌ Wrong
<div className="mx-4 my-2">   // ❌ Wrong
<Box padding="4">             // ❌ Wrong - no space- prefix
```

## Spacing Tokens

Available spacing tokens (always with `space-` prefix):

- `space-4` (4px)
- `space-8` (8px)
- `space-12` (12px)
- `space-16` (16px)
- `space-20` (20px)
- `space-24` (24px)
- `space-32` (32px)
- `space-40` (40px)

## Responsive Design

Mobile-first approach with breakpoints:

- `xs`: 0px (mobile)
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

```tsx
<HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="4">
  {items.map(item => <Card key={item.id} {...item} />)}
</HGrid>

<Box
  padding={{ xs: "space-16", sm: "space-20", md: "space-24" }}
>
```

## Component Patterns

### Layout Components

```tsx
import { Box, VStack, HStack, HGrid } from "@navikt/ds-react";

// Vertical stack with spacing
<VStack gap="4">
  <Component1 />
  <Component2 />
  <Component3 />
</VStack>

// Horizontal stack
<HStack gap="4" align="center">
  <Icon />
  <Text />
</HStack>

// Responsive grid
<HGrid columns={{ xs: 1, md: 2, lg: 3 }} gap="4">
  {/* Grid items */}
</HGrid>
```

### Typography

```tsx
import { Heading, BodyShort, Label } from "@navikt/ds-react";

<Heading size="large|medium|small" level="1-6">
  Title
</Heading>

<BodyShort size="large|medium|small">
  Regular text content
</BodyShort>

<BodyShort weight="semibold">
  Bold text
</BodyShort>

<Label size="large|medium|small">
  Input label
</Label>
```

### Background Colors

```tsx
<Box background="surface-default">     {/* White */}
<Box background="surface-subtle">      {/* Light gray */}
<Box background="surface-action-subtle">  {/* Light blue */}
<Box background="surface-success-subtle"> {/* Light green */}
<Box background="surface-warning-subtle"> {/* Light orange */}
<Box background="surface-danger-subtle">  {/* Light red */}
```

## Boundaries

### ✅ Always

- Use Aksel Design System components
- Use spacing tokens with `space-` prefix
- Mobile-first responsive design

### ⚠️ Ask First

- Adding custom Tailwind utilities
- Deviating from Aksel patterns

### 🚫 Never

- Use Tailwind padding/margin utilities (`p-*`, `m-*`)
- Use numeric spacing without `space-` prefix
- Ignore accessibility requirements
- Skip responsive props
