---
applyTo: "**/*.{tsx,ts}"
---

# Aksel Design System

## Spacing-regler

**VIKTIG**: Bruk alltid Nav DS spacing-tokens, aldri Tailwind padding/margin.

Tokens er **rem-baserte**. Tallet = rem × 16: `space-16` = 1rem, `space-24` = 1.5rem.

### ✅ Riktig

```tsx
import { Box, VStack, HGrid } from "@navikt/ds-react";

<Box
  paddingBlock="space-48"
  paddingInline="space-40"
>
  {children}
</Box>

<Box
  background="surface-subtle"
  padding="space-32"
  borderRadius="large"
>
  <Heading size="large" level="2">Tittel</Heading>
  <BodyShort>Innhold</BodyShort>
</Box>

// Retningsbestemt padding
<Box
  paddingBlock="space-16"    // Topp og bunn
  paddingInline="space-24"   // Venstre og høyre
>
```

### ❌ Feil

```tsx
<div className="p-4 md:p-6">  // ❌ Feil
<div className="mx-4 my-2">   // ❌ Feil
<Box padding="4">             // ❌ Feil — mangler space-prefiks
```

## Spacing-tokens

Tilgjengelige tokens (alltid med `space-`-prefiks):

- `space-4` (0.25rem ≈ 4px)
- `space-8` (0.5rem ≈ 8px)
- `space-12` (0.75rem ≈ 12px)
- `space-16` (1rem ≈ 16px)
- `space-20` (1.25rem ≈ 20px)
- `space-24` (1.5rem ≈ 24px)
- `space-32` (2rem ≈ 32px)
- `space-40` (2.5rem ≈ 40px)
- `space-48` (3rem ≈ 48px)

## Responsiv design

Minimum støttet skjermstørrelse er **lg (1024px)**. Ikke legg til responsive varianter under `lg` med mindre komponenten er eksplisitt designet for mindre skjermer.

Breakpoints:

- `xs`: 0px
- `sm`: 480px
- `md`: 768px
- `lg`: 1024px ← minimum støttet
- `2xl`: 1440px

```tsx
<HGrid columns={{ lg: 3, "2xl": 4 }} gap="space-16">
  {items.map(item => <Card key={item.id} {...item} />)}
</HGrid>
```

## Komponentmønstre

### Layout-komponenter

```tsx
import { Box, VStack, HStack, HGrid } from "@navikt/ds-react";

<VStack gap="space-16">
  <Komponent1 />
  <Komponent2 />
</VStack>

<HStack gap="space-16" align="center">
  <Icon />
  <Text />
</HStack>

<HGrid columns={3} gap="space-16">
  {/* Grid-elementer */}
</HGrid>
```

### Typografi

```tsx
import { Heading, BodyShort, Label } from "@navikt/ds-react";

<Heading size="large|medium|small" level="1-6">Tittel</Heading>
<BodyShort size="large|medium|small">Vanlig tekstinnhold</BodyShort>
<BodyShort weight="semibold">Halvfet tekst</BodyShort>
<Label size="large|medium|small">Skjemaetikett</Label>
```

### Bakgrunnsfarger

```tsx
<Box background="surface-default">          {/* Hvit */}
<Box background="surface-subtle">           {/* Lys grå */}
<Box background="surface-action-subtle">    {/* Lys blå */}
<Box background="surface-success-subtle">   {/* Lys grønn */}
<Box background="surface-warning-subtle">   {/* Lys oransje */}
<Box background="surface-danger-subtle">    {/* Lys rød */}
```

## Tallformatering

Bruk alltid norsk locale for tallformatering.

## Tilgjengelighet

Alltid inkluder ARIA-labels og semantisk HTML. Bruk aldri `<div onClick>`.

## When Using React Query (Server State)

React Query (@tanstack/react-query) er standard for server state ved Nav.

```tsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function ResourceList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["resources"],
    queryFn: () => fetch("/api/resources").then((res) => res.json()),
  });

  if (isLoading) return <Loader title="Laster..." />;
  if (error) return <Alert variant="error">Kunne ikke laste data</Alert>;

  return (
    <VStack gap="space-16">
      {data.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </VStack>
  );
}

// Mutation med cache-invalidering
const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (data: CreateRequest) =>
    fetch("/api/resources", { method: "POST", body: JSON.stringify(data) }),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resources"] }),
});
```

Ikke introduser React Query i prosjekter som ikke allerede bruker det.

## When Using React Hook Form (Form State)

React Hook Form foretrekkes for komplekse skjemaer med validering.

```tsx
import { useForm } from "react-hook-form";
import { TextField, Button, VStack } from "@navikt/ds-react";

interface FormData {
  name: string;
  email: string;
}

export function RegistrationForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack gap="space-16">
        <TextField
          label="Navn"
          {...register("name", { required: "Navn er påkrevd" })}
          error={errors.name?.message}
        />
        <Button type="submit">Registrer</Button>
      </VStack>
    </form>
  );
}
```

## Package Manager

**yarn** er package manager for dette prosjektet.

```bash
yarn install
yarn add @navikt/ds-react
yarn test
```

## Boundaries

### ✅ Always

- Bruk Aksel Design System-komponenter
- Bruk spacing-tokens med `space-`-prefiks
- Norsk tallformatering
- Semantisk HTML og ARIA-labels

### ⚠️ Ask First

- Legge til egendefinerte Tailwind utilities
- Avvike fra Aksel-mønstre
- Introdusere React Query eller React Hook Form i eksisterende prosjekter

### 🚫 Never

- Bruk Tailwind padding/margin (`p-*`, `m-*`)
- Bruk numerisk spacing uten `space-`-prefiks
- Ignorer tilgjengelighetskrav
- Bruk `<div onClick>`
- Legg til kodekommentarer med mindre eksplisitt bedt om det
