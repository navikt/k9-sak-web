---
applyTo: "**/*.{tsx,ts}"
---

# Aksel Design System

## Spacing Rules

**CRITICAL**: Always use Nav DS spacing tokens, never Tailwind padding/margin utilities.

Tokens are **rem-based**. The number = rem × 16 equivalent: `space-16` = 1rem, `space-24` = 1.5rem.

### ✅ Correct Patterns

```tsx
import { Box, VStack, HGrid } from "@navikt/ds-react";

// Page container
<Box
  paddingBlock="space-48"
  paddingInline="space-40"
>
  {children}
</Box>

// Component with padding
<Box
  background="surface-subtle"
  padding="space-32"
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

For the full token list and detailed patterns, use the `aksel-spacing` skill.

## Spacing Tokens

Available spacing tokens (always with `space-` prefix):

- `space-4` (0.25rem ≈ 4px)
- `space-8` (0.5rem ≈ 8px)
- `space-12` (0.75rem ≈ 12px)
- `space-16` (1rem ≈ 16px)
- `space-20` (1.25rem ≈ 20px)
- `space-24` (1.5rem ≈ 24px)
- `space-32` (2rem ≈ 32px)
- `space-40` (2.5rem ≈ 40px)
- `space-48` (3rem ≈ 48px)

## Responsive Design

Minimum supported screen size is **lg (1024px)**. Do not add responsive variants below `lg` unless the component is explicitly designed for smaller screens.

Breakpoints:

- `xs`: 0px
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px ← minimum supported
- `2xl`: 1440px

```tsx
<HGrid columns={{ lg: 3, "2xl": 4 }} gap="space-16">
  {items.map(item => <Card key={item.id} {...item} />)}
</HGrid>
```

## Component Patterns

### Layout Components

```tsx
import { Box, VStack, HStack, HGrid } from "@navikt/ds-react";

// Vertical stack with spacing
<VStack gap="space-16">
  <Component1 />
  <Component2 />
  <Component3 />
</VStack>

// Horizontal stack
<HStack gap="space-16" align="center">
  <Icon />
  <Text />
</HStack>

// Responsive grid
<HGrid columns={3} gap="space-16">
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

## Accessibility

Always include ARIA labels and semantic HTML. Never use `<div onClick>`.

## Boundaries

### ✅ Always

- Use Aksel Design System components
- Use spacing tokens with `space-` prefix

### ⚠️ Ask First

- Adding custom Tailwind utilities
- Deviating from Aksel patterns

### 🚫 Never

- Use Tailwind padding/margin utilities (`p-*`, `m-*`)
- Use numeric spacing without `space-` prefix
- Ignore accessibility requirements
