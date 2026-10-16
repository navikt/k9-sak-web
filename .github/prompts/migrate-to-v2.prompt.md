---
description: Migrer et fakta- eller prosesspanel fra v1 til v2
---

Migrer `${input:feature}` fra v1 til v2 i dette repoet.

Undersøk eksisterende v1-implementasjon, tester, koblingen til behandlingen og relevante v2-migreringer. Følg `AGENTS.md` hvis den finnes, `.github/instructions/v2.instructions.md` og `.github/skills/v2-architecture/SKILL.md`.

Gjennomfør migreringen, ikke stopp etter å ha laget en plan. Bevar eksisterende funksjonalitet, og avgrens endringene til migreringen. Sjekk git-status først. Ikke overskriv eller fjern lokale endringer du ikke har gjort.

For migrering av et fakta- eller prosesspanel:

- Legg til en `BRUK_V2_<FEATURE>`-feature toggle med `false` som standard, og aktiver den i Q.
- Behold v1-implementasjonen bak togglen. Spør om vi ønsker å bruke `VersjonsvelgerV1V2`. Hvis ja, spør også om vi ønsker en comparison story for å sammenligne v1 og v2 visuelt. En comparison story skal rendre begge versjoner gjennom den toggle-styrte `FaktaPanelDef` og `VersjonsvelgerV1V2`, og må ha en kompileringsvakt koblet til feature togglen slik at den slettes sammen med v1-grenen.
- Koble inn v2-panelet med bare props det trenger. Ikke spre hele v1-props-objektet til v2.
- Behold `getEndepunkter` i `FaktaPanelDef` mens v1 finnes.
- Legg til nødvendige API-contexts og providers i relevant `AppConfigResolver`.
- Sørg for at `Suspense` omslutter `ErrorBoundary` der panelet bruker `useSuspenseQuery`.
- Legg kompileringsvakter i v1-filene som skal slettes etter utrulling, ikke i `FaktaPanelDef`.

Følg v2-konvensjonene:

- Bruk stabile DTO- og kodeverkeksporter fra backend-pakken, og kall genererte SDK-funksjoner gjennom API-klienter.
- Bruk `.js` på importsuffikser.
- Bruk `K9KodeverkoppslagContext` for kodeverk.
- Bruk dot notation for CSS module-klasser (`styles.minKlasse`).
- Unngå imports fra pakker utenfor v2, type assertions og non-null assertions.

Oppdater eller legg til stories og tester som dekker eksisterende visningstilstander og interaksjoner. Kjør relevante tester og `yarn ts-check`. Ikke fjern v1-koden eller feature togglen som del av denne migreringen.

Hold `packages/v2/MIGRATION.md` oppdatert: flytt panelet fra «Ikke migrert eller ikke vurdert» (eller «Under arbeid») til «Feature togglet» med riktig `BRUK_V2_<FEATURE>`, og fjern raden fra tier-tabellen.
Når migreringen er fullført, oppdater `packages/v2/MIGRATION.md`.

Hvis du møter et valg som påvirker funksjonalitet eller utrulling, spør meg før du bestemmer deg. Avslutt med en kort oversikt over endringene og eventuelle tester du ikke kunne kjøre.
