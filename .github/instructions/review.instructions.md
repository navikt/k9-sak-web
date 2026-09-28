---
applyTo: "**"
excludeAgent: "cloud-agent"
---

# Review av kodeendringer

Les relevante instruksjoner i `.github/copilot-instructions.md` og `.github/instructions/`, og relevante skills i `.github/skills/`, før du vurderer endringene. Flagg konkrete avvik for menneskelig reviewer, ikke valgfrie steg eller regler som ikke gjelder endringen.

## Feature toggles

Kontroller hvilket miljø en ny eller flyttet feature toggle aktiveres i. Nye toggles skal først settes til `true` i `qFeatureToggles`. Når funksjonaliteten skal bli standard i prod, fjerner vi som regel togglen og den gamle implementasjonen i stedet for å aktivere togglen i prod.

Verdier i `k9SpecificFeatureToggles` og `ungSpecificFeatureToggles` gjelder både Q og prod. Det er sjelden riktig å legge en toggle der. Flagg endringen hvis behovet for et ytelsesspesifikt fellesoppsett ikke kommer tydelig frem.

## Testing

Ved endret atferd, vurder om testene dekker relevante tilstander og interaksjoner. For visningskomponenter, se etter Storybook-stories med `play`-tester som sjekker resultatet. For datagruppering og annen ren logikk, se etter Vitest-tester. Grønne CI-sjekker alene viser ikke at den endrede atferden er dekket. Flagg bare konkrete, utestede tilfeller som kan gi regresjon.

## V2

Ved endringer i `packages/v2/`, kontroller koden mot `.github/instructions/v2.instructions.md` og delen «v2 development checklist» i `.github/skills/v2-architecture/SKILL.md`. Bruk bare sjekkpunktene som er relevante for endringen. Se etter tester for tom tilstand og ulike ytelsestyper når de gir ulik atferd.

Ved nye eller endrede API-kall, kontroller at lasting og feil håndteres av relevante `Suspense`- og `ErrorBoundary`-grenser, slik at saksbehandleren ikke blir stående uten tilbakemelding. For TanStack Query må query-nøkkelen skille data fra ulike behandlinger når dataene er behandlingsspesifikke. Kontroller også at data oppdateres etter endringer som gjør cachet innhold utdatert. Flagg konkrete feil eller manglende dekning, ikke et generelt krav om tester for alle tilstander.

## Migrering

Når en eksisterende komponent flyttes til v2, kontroller også relevante steg i «Migration checklist» i `.github/skills/v2-architecture/SKILL.md`. Se på hele migreringen, også filer utenfor `packages/v2/`. Kontroller at både v1- og v2-grenen fungerer mens togglen finnes, og at v1-tester ikke fjernes før tilsvarende atferd er dekket i v2. Gamle kall må beholdes så lenge v1-grenen bruker dem. Ikke krev migreringssteg for nye komponenter eller valgfrie tiltak som versjonsvelger og sammenligningsstory.
