# V2 migrering – oversikt

Oversikt over alle fakta- og prosess-paneler og migreringsstatus til v2.
Oppdater avmerkingsboksene etterhvert som arbeid fullføres.

Se [v2-arkitekturmønsteret](./../v2/README.md) og migreringsskilden i `.github/skills/v2-architecture/SKILL.md` for fremgangsmåte.

---

## Ferdig migrert

Paneler som er fullstendig migrert – bruker v2 direkte uten feature toggle.

- [x] `fakta/medlemskap` — erstatter `fakta-bosted-soker` (Memberskapsvilkår)
- [x] `fakta/ny-inntekt`
- [x] `fakta/sykdom-og-opplæring`
- [x] `fakta/vurder-nyoppstartet`
- [x] `prosess/formkrav`
- [x] `prosess/klagevurdering`
- [x] `prosess/vedtak-klage`
- [x] `prosess/vilkar-overstyring`
- [x] `prosess/vilkar-soknadsfrist`
- [x] `prosess/vilkar-alder`
- [x] `prosess/uttak`
- [x] `prosess/ung-beregning`
- [x] `prosess/ung-inngangsvilkår`
- [x] `prosess/ung-vedtak`

---

## Under migrering

Paneler der v1 og v2 eksisterer parallelt, styrt av feature toggle.

- [ ] `fakta-inntektsmelding` → `BRUK_V2_INNTEKTSMELDING`
- [ ] `fakta-utenlandsopphold` → `BRUK_V2_UTENLANDSOPPHOLD`
- [ ] `prosess-tilkjent-ytelse` → `BRUK_V2_TILKJENT_YTELSE`
- [ ] `prosess-vilkar-opptjening` → `BRUK_V2_VILKAR_OPPTJENING`

---

## Ikke migrert

Sortert etter estimert migreringskompleksitet (enklest først).

### Tier 1 — Svært enkelt

| Panel | ~Linjer | Konsumenter | Merknad |
|---|---|---|---|
| `fakta-bosted-soker` | 369 | 0 | Allerede erstattet av v2 `fakta/medlemskap` — kan slettes direkte |
| `fakta-inntekt-og-ytelser` | 104 | 3 (oms, frisinn, unntak) | Kun visning, 1 API |
| `fakta-direkte-overgang` | 285 | 2 (opl, psb) | Enkel skjema, 0 API-avhengigheter |
| `prosess-vilkar-sykdom` | 134 | 3 (opl, psb, psb-sluttfase) | Én fil, periodedata fra forelder |
| `prosess-uttak-antall-dager-sluttfase` | 189 | 1 (psb-sluttfase) | Viser kun kvoteinfo; tyngre logikk ligger i v2 `Uttak` |
| `prosess-unntak` | 387 | 1 (behandling-unntak) | Enkel vilkårsskjema |

### Tier 2 — Enkelt/middels

| Panel | ~Linjer | Konsumenter | Merknad |
|---|---|---|---|
| `fakta-om-barnet` | 441 | 2 (opl, psb) | Fokusert på pleietrengendes dødsfall, 1 aksjonspunkt |
| `fakta-verge` | 507 | 4 (oms, tilbakekreving ×2, unntak) | Rett frem verge-skjema, 1 API |
| `fakta-overstyr-beregning` | 622 | 3 (opl, psb, psb-sluttfase) | Overstyringsskjema, 1 API |
| `fakta-barn-og-overfoeringsdager` | 895 | 2 (oms, unntak) | Visningsorientert, leser rammevedtak-tre |
| `fakta-barn-oms` | 903 | 3 (oms, unntak, utvidet-rett) | Visning av barn-liste, 0 API-avhengigheter |
| `prosess-anke-merknader` | 363 | 1 (behandling-anke) | Gammel JSX, enkel, 0 API — migrer alle 3 anke-paneler samlet |
| `prosess-anke-resultat` | 620 | 1 (behandling-anke) | Gammel JSX, vedtak-lignende resultatform |
| `prosess-anke` | 772 | 1 (behandling-anke) | Gammel JSX, 0 API-avhengigheter |

### Tier 3 — Middels

| Panel | ~Linjer | Konsumenter | Merknad |
|---|---|---|---|
| `prosess-varsel-om-revurdering` | 647 | 5 | Gammel JSX, forhåndsvisnings-callback for brev, 3 APIer |
| `fakta-soknadsperioder` | 727 | 5 | Periodeoversikt koblet til vilkår, 1 API |
| `fakta-feilutbetaling` | 1122 | 2 (tilbakekreving ×2) | Periodebasert årsak-skjema, 1 API |
| `prosess-avregning` (Simulering) | 1007 | 6 | Simuleringsvisning + tilbakekrevingsvalg-skjema |
| `fakta-opplysninger-fra-soknaden` | 1268 | 1 (frisinn) | Frisinn-spesifikk, overstyringsskjema, 1 API |
| `fakta-omsorgen-for` | 1272 | 3 (oms, opl, psb) | Vurderingsskjema, 0 API-avhengigheter |
| `prosess-vedtak-tilbakekreving` | 1498 | 2 (tilbakekreving ×2) | Vedtak med fritekstforhåndsvisning, 1 API |

### Tier 4 — Krevende

| Panel | ~Linjer | Konsumenter | Merknad |
|---|---|---|---|
| `prosess-foreldelse` | 2027 | 2 (tilbakekreving ×2) | JSX+TS blandet, kompleks peridetidslinje for foreldelsevurdering |
| `fakta-arbeidsforhold` | 2664 | 5 | Skjemadrevet, kryssreferanser mot arbeidsgiverOpplysninger |
| `fakta-opptjening-oms` | 2815 | 4 | Store individuelle filer, kompleks periodebasert opptjeningsredigering |
| `fakta-etablert-tilsyn` | 2907 | 2 (opl, psb) | Dobble flyter for Nattevåk+Beredskap, periodenavigering, egendefinert kontekst |
| `prosess-tilbakekreving` | 4185 | 2 (tilbakekreving ×2) | Komplekst periode-for-periode vurderingsrutenett, aktsomhet/god-tro-flyter |
| `prosess-omsorgsdager` | 4839 | 1 (utvidet-rett) | Mikrofrontend ContainerContext, React Hook Form, flere delflyter |

### Tier 5 — Svært krevende (migrer sist)

| Panel | ~Linjer | Konsumenter | Merknad |
|---|---|---|---|
| `fakta-medisinsk-vilkår` | 11 216 | 3 (psb, opl, psb-sluttfase) | Største panel i kodebasen; intern React Query, dokumenthåndtering, diagnosekoder, dobbel logikk for under/over 18 år |
| `prosess-vedtak` | 7 211 | 9 | Mest brukte panel; EditorJS brev-editor, 8 APIer, informasjonsbehov, overlappende ytelser, 10 aksjonspunkter |
