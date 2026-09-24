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
- [x] `prosess/vilkar-sykdom`
- [x] `prosess/uttak`
- [x] `prosess/ti-dager`
- [x] `prosess/ung-beregning`
- [x] `prosess/ung-inngangsvilkår`
- [x] `prosess/ung-vedtak`
- [x] `fakta/utenlandsopphold`

---

### Under migrering

#### Feature togglet
Paneler der v1 og v2 eksisterer parallelt, styrt av feature toggle.

- [ ] `prosess-tilkjent-ytelse` → `BRUK_V2_TILKJENT_YTELSE` 
    I v1 bruker vi egen tidslinje, mens v2 bruker aksel sin. Dette måtte revertes da saksbehandlerne var misfornøyde med Aksel sin. Må avklares hva veien videre blir. Se tråd: https://nav-it.slack.com/archives/C02M0NEFHNZ/p1763718652362509 
- [ ] `prosess-avregning` → `BRUK_V2_AVREGNING`

#### Under arbeid
- fakta-omsorgen-for (Hallvard)
- fakta-feilutbetaling (Aleksei)
- fakta-direkte-overgang (Aleksei)
- fakta-uttak (Vebjørn)
---

### Trenger avklaringer
- fakta-medisinsk-vilkår
    Kjernefunksjonalitet med masse kode og logikk. 
    Design ønsker å flytte denne til prosesspanel, og samtidig gjøre omfattende endringer i flyt.
    Virker sannsynlig at en komplett omskrivning vil være beste løsning for panelet i den sammenheng.
- prosess-vedtak
    Her er det snakk om å gjøre omfattende endringer i backend også, for det er mye forretningslogikk i frontend.
    Tror vi ønsker å flytte mye logikk til backend

### Skal IKKE migreres
- fakta-inntekt-og-ytelser 
    Erstattes av arbeid og inntekt. fakta-inntekt-og-ytelser kan slettes når arbeid og inntekt er togglet på i prod.

### Ikke migrert eller ikke vurdert

Sortert etter estimert migreringskompleksitet (enklest først).

### Tier 1 — Svært enkelt

| Panel                                  | ~Linjer | Konsumenter                                            | Merknad                                                        |
| -------------------------------------- | ------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| `prosess-uttak-antall-dager-sluttfase` | 189     | 1 (psb-sluttfase)                                      | Viser kun kvoteinfo; tyngre logikk ligger i v2 `Uttak`         |
| `prosess-unntak`                       | 387     | 1 (behandling-unntak)                                  | Enkel vilkårsskjema                                            |
| `fakta-om-pleietrengende`              | 51      | 1 (psb-sluttfase)                                      | Enkel visning av opplysninger om den pleietrengende            |
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
| `fakta-soknadsperioder`           | 727     | 5                     | Periodeoversikt koblet til vilkår, 1 API                |
| `prosess-avregning` (Simulering)  | 1007    | 6                     | Simuleringsvisning + tilbakekrevingsvalg-skjema         |
| `fakta-opplysninger-fra-soknaden` | 1268    | 1 (frisinn)           | Frisinn-spesifikk, overstyringsskjema, 1 API            |
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