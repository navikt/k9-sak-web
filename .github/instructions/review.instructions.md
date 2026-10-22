---
applyTo: "**"
excludeAgent: "cloud-agent"
---

# Review av kodeendringer

Les relevante instruksjoner i `.github/copilot-instructions.md` og `.github/instructions/` før du vurderer endringene. Flagg konkrete avvik for menneskelig reviewer, ikke valgfrie steg eller regler som ikke gjelder endringen.

## Skills

Kontroller alle endrede filer mot relevante skills i `.github/skills/`, også uendrede linjer i filer som PR-en endrer. Vis til skillen og regelen når du flagger et avvik. Hvis endringen innfører et mønster som strider mot en skill, flagg at enten koden eller skillen må oppdateres.

## Omfang

Flagg endringer som går lenger enn formålet med PR-en, for eksempel omdøpte variabler, omstrukturert kode som virket, eller refaktorering utenfor oppgaven. Se «Minimal Editing» i `.github/copilot-instructions.md`.

## Feature toggles

Kontroller nye eller flyttede feature toggles mot `feature-toggles`-skillen, særlig hvilket miljø togglen aktiveres i. Flagg avvik der begrunnelsen ikke kommer tydelig frem.

## Testing

Ved endret atferd, vurder om testene dekker relevante tilstander og interaksjoner. Hvilke testtyper vi bruker, står i `storybook`-skillen. Grønne CI-sjekker alene viser ikke at den endrede atferden er dekket. Flagg bare konkrete, utestede tilfeller som kan gi regresjon.

## V2

Ved endringer i `packages/v2/`, kontroller koden mot `.github/instructions/v2.instructions.md` og sjekklisten i `v2-architecture`-skillen. Bruk bare sjekkpunktene som er relevante for endringen.

Ved nye eller endrede API-kall, kontroller query-nøkler, invalidering og håndtering av lasting og feil mot `data-fetching`-skillen. Flagg konkrete feil eller manglende dekning, ikke et generelt krav om tester for alle tilstander.

## Migrering

Når en eksisterende komponent flyttes til v2, kontroller relevante steg i `v2-migration`-skillen. Se på hele migreringen, også filer utenfor `packages/v2/`. Ikke krev migreringssteg for nye komponenter eller valgfrie tiltak som versjonsvelger og sammenligningsstory.
