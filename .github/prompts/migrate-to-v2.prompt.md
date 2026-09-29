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

Hvis det finnes en comparison story med elementer med `aria-label="v1"` og `aria-label="v2"`, kjør en lokal visuell sammenligning:

- Start Storybook med `yarn storybook` (port 9001), med loggen i `.tmp/`.
- Kjør `yarn visuell-diff <story-id>`. Story-id finnes i `http://127.0.0.1:9001/index.json`.
- Skriptet lagrer `v1.png`, `v2.png` og `diff.png` i `.tmp/visuell-diff/` og skriver ut avviksprosenten. Se på `diff.png`.
- Forklar forskjellene kort (margin, fontstørrelse, avstand osv.), og rett opp de som er utilsiktede. Avvik på noen få prosent fra små avstandsforskjeller kan aksepteres, men si fra om dem.
- Stopp Storybook når du er ferdig.

Følg v2-konvensjonene:

- Bruk stabile DTO- og kodeverkeksporter fra backend-pakken, og kall genererte SDK-funksjoner gjennom API-klienter.
- Bruk `.js` på importsuffikser.
- Bruk `K9KodeverkoppslagContext` for kodeverk.
- Bruk bracket notation for CSS module-klasser.
- Unngå imports fra pakker utenfor v2, type assertions og non-null assertions.

Oppdater eller legg til stories og tester som dekker eksisterende visningstilstander og interaksjoner. Kjør relevante tester og `yarn ts-check`. Ikke fjern v1-koden eller feature togglen som del av denne migreringen.

Hvis du møter et valg som påvirker funksjonalitet eller utrulling, spør meg før du bestemmer deg. Avslutt med en kort oversikt over endringene og eventuelle tester du ikke kunne kjøre.
