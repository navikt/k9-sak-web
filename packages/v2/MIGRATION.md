# V2 migrering – arbeidsliste

Dette dokumentet viser hva som er ferdig migrert, hva som pågår og hva som gjenstår. 
Alle panelene tilknyttet tilbakekreving og beregning har store implementasjoner delt med foreldrepenger og lever i [fellesrepo med FP](https://github.com/navikt/ft-frontend-saksbehandling/tree/main/packages). Men felleskoden trenger nok ikke vi røre i førsteomgang.

Se [v2-arkitekturmønsteret](./../v2/README.md) og migreringsskilden i `.github/skills/v2-architecture/SKILL.md` for fremgangsmåte.

---

## Migreringsstatus

### Ferdig migrert

Paneler som er fullstendig migrert – bruker v2 direkte uten feature toggle.

- [x] `fakta/medlemskap`
- [x] `fakta/inntektsmelding`
- [x] `fakta/ny-inntekt`
- [x] `fakta/sykdom-og-opplæring`
- [x] `fakta/vurder-nyoppstartet`
- [x] `fakta/ytelser`
- [x] `prosess/formkrav`
- [x] `prosess/klagevurdering`
- [x] `prosess/vedtak-klage`
- [x] `prosess/vilkar-overstyring`
- [x] `prosess/vilkar-soknadsfrist`
- [x] `prosess/vilkar-alder`
- [x] `prosess/vilkar-opptjening`
- [x] `prosess/uttak`
- [x] `prosess/ti-dager`
- [x] `prosess/ung-beregning`
- [x] `prosess/ung-inngangsvilkår`
- [x] `prosess/ung-vedtak`

---

### Under migrering

Paneler der v1 og v2 eksisterer parallelt, styrt av feature toggle.

- [ ] `fakta-utenlandsopphold` → `BRUK_V2_UTENLANDSOPPHOLD`
- [ ] `prosess-tilkjent-ytelse` → `BRUK_V2_TILKJENT_YTELSE`
- [ ] `prosess-avregning` → `BRUK_V2_AVREGNING`

---

### Ikke migrert eller ikke vurdert

Sortert etter estimert migreringskompleksitet (enklest først).

### Tier 1 — Svært enkelt

| Panel                                  | ~Linjer | Konsumenter                                            | Merknad                                                        |
| -------------------------------------- | ------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| `fakta-bosted-soker`                   | 369     | 0                                                      |
| `fakta-inntekt-og-ytelser`             | 104     | 3 (oms, frisinn, unntak)                               | Kun visning, 1 API                                             |
| `fakta-direkte-overgang`               | 285     | 2 (opl, psb)                                           | Enkel skjema, 0 API-avhengigheter                              |
| `prosess-vilkar-sykdom`                | 134     | 3 (opl, psb, psb-sluttfase)                            | Én fil, periodedata fra forelder                               |
| `prosess-uttak-antall-dager-sluttfase` | 189     | 1 (psb-sluttfase)                                      | Viser kun kvoteinfo; tyngre logikk ligger i v2 `Uttak`         |
| `prosess-unntak`                       | 387     | 1 (behandling-unntak)                                  | Enkel vilkårsskjema                                            |
| `fakta-om-pleietrengende`              | 51      | 1 (psb-sluttfase)                                      | Enkel visning av opplysninger om den pleietrengende            |
| `fakta-uttak`                          | 38      | 2 (oms, unntak)                                        | Enkel visning av uttaksdata                                    |
| `fakta-beregning`                      | 313     | 5 (frisinn, oms, opl, psb, psb-sluttfase)              | Fem lokale paneldefinisjoner rundt felles beregningskomponent  |
| `fakta-fordeling`                      | 180     | 4 (oms, opl, psb, psb-sluttfase)                       | Fire lokale paneldefinisjoner rundt felles fordelingskomponent |
| `prosess-fortsatt-medlemskap`          | 75      | 3 (opl, psb, psb-sluttfase)                            | Tre korte paneldefinisjoner med overstyringsstøtte             |
| `prosess-inngangsvilkar`               | 132     | 7 (oms, opl, psb, psb-sluttfase, ung, unntak, utvidet) | Felles inngangsvilkår med ytelsesspesifikke varianter          |
| `prosess-opplaering`                   | 19      | 1 (opl)                                                | Ytelsesspesifikk vilkårsvurdering                              |
| `prosess-beregningsgrunnlag`           | 331     | 5 (frisinn, oms, opl, psb, psb-sluttfase)              | Fem lokale paneldefinisjoner rundt felles beregningsgrunnlag   |

### Tier 2 — Enkelt/middels

| Panel                             | ~Linjer | Konsumenter                        | Merknad                                                      |
| --------------------------------- | ------- | ---------------------------------- | ------------------------------------------------------------ |
| `fakta-om-barnet`                 | 441     | 2 (opl, psb)                       | Fokusert på pleietrengendes dødsfall, 1 aksjonspunkt         |
| `fakta-verge`                     | 507     | 4 (oms, tilbakekreving ×2, unntak) | Rett frem verge-skjema, 1 API                                |
| `fakta-overstyr-beregning`        | 622     | 3 (opl, psb, psb-sluttfase)        | Overstyringsskjema, 1 API                                    |
| `fakta-barn-og-overfoeringsdager` | 895     | 2 (oms, unntak)                    | Visningsorientert, leser rammevedtak-tre                     |
| `fakta-barn-oms`                  | 903     | 3 (oms, unntak, utvidet-rett)      | Visning av barn-liste, 0 API-avhengigheter                   |
| `prosess-anke-merknader`          | 363     | 1 (behandling-anke)                | Gammel JSX, enkel, 0 API — migrer alle 3 anke-paneler samlet |
| `prosess-anke-resultat`           | 620     | 1 (behandling-anke)                | Gammel JSX, vedtak-lignende resultatform                     |
| `prosess-anke`                    | 772     | 1 (behandling-anke)                | Gammel JSX, 0 API-avhengigheter                              |

### Tier 3 — Middels

| Panel                             | ~Linjer | Konsumenter           | Merknad                                                 |
| --------------------------------- | ------- | --------------------- | ------------------------------------------------------- |
| `prosess-varsel-om-revurdering`   | 647     | 5                     | Gammel JSX, forhåndsvisnings-callback for brev, 3 APIer |
| `fakta-soknadsperioder`           | 727     | 5                     | Periodeoversikt koblet til vilkår, 1 API                |
| `fakta-feilutbetaling`            | 1122    | 2 (tilbakekreving ×2) | Periodebasert årsak-skjema, 1 API                       |
| `prosess-avregning` (Simulering)  | 1007    | 6                     | Simuleringsvisning + tilbakekrevingsvalg-skjema         |
| `fakta-opplysninger-fra-soknaden` | 1268    | 1 (frisinn)           | Frisinn-spesifikk, overstyringsskjema, 1 API            |
| `fakta-omsorgen-for`              | 1272    | 3 (oms, opl, psb)     | Vurderingsskjema, 0 API-avhengigheter                   |
| `prosess-vedtak-tilbakekreving`   | 1498    | 2 (tilbakekreving ×2) | Vedtak med fritekstforhåndsvisning, 1 API               |

### Tier 4 — Krevende

| Panel                    | ~Linjer | Konsumenter           | Merknad                                                                        |
| ------------------------ | ------- | --------------------- | ------------------------------------------------------------------------------ |
| `prosess-foreldelse`     | 2027    | 2 (tilbakekreving ×2) | JSX+TS blandet, kompleks periodetidslinje for foreldelsevurdering               |
| `fakta-arbeidsforhold`   | 2664    | 5                     | Skjemadrevet, kryssreferanser mot arbeidsgiverOpplysninger                     |
| `fakta-opptjening-oms`   | 2815    | 4                     | Store individuelle filer, kompleks periodebasert opptjeningsredigering         |
| `fakta-etablert-tilsyn`  | 2907    | 2 (opl, psb)          | Dobble flyter for Nattevåk+Beredskap, periodenavigering, egendefinert kontekst |
| `prosess-tilbakekreving` | 4185    | 2 (tilbakekreving ×2) | Komplekst periode-for-periode vurderingsrutenett, aktsomhet/god-tro-flyter     |
| `prosess-omsorgsdager`   | 4839    | 1 (utvidet-rett)      | Mikrofrontend ContainerContext, React Hook Form, flere delflyter               |
| `prosess-utvidet-rett`   | 2387    | 1 (utvidet-rett)      | Mikrofrontend-avhengighet og flere underpaneler                                |

### Tier 5 — Svært krevende 
Før man gjør noe med disse panelene bør man kanskje snakke litt sammen på tvers av grupper

| Panel                    | ~Linjer | Konsumenter                 | Merknad                                                                                                              |
| ------------------------ | ------- | --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `fakta-medisinsk-vilkår` | 11 216  | 3 (psb, opl, psb-sluttfase) | Design har snakket om å flytte denne til prosesspanel |
| `prosess-vedtak`         | 7 211   | 9                           | Her har det vært snakk om å gjøre omfattende endringer i backend også |
