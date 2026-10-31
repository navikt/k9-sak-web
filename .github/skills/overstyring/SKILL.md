---
name: overstyring
description: >-
  Hvordan overstyring og overstyringsaksjonspunkter fungerer i k9-sak-web, hvor
  i løsningen det kan overstyres, og hvordan vi gjør det tydelig at et
  aksjonspunkt er overstyrt og må behandles av en saksbehandler med
  overstyrerrolle. USE FOR: overstyring, overstyrt aksjonspunkt,
  overstyrerrolle, erOverstyrer, kanOverstyreAccess, aksjonspunktType OVST/SAOV,
  OverstyringKnapp,
  ProsessStegOverstyringPanelDef, VilkarresultatMedOverstyring,
  OverstyringAksjonspunktVarsel, "saksbehandler prøver å løse overstyrt
  aksjonspunkt", nye eller endrede overstyringspaneler. DO NOT USE FOR:
  generelle v2-mønstre (bruk v2-architecture) eller API-kontrakter (bruk
  v2-api-contract).
---

# Overstyring

Saksbehandlere uten overstyrerrolle prøver ofte å løse aksjonspunkter som er overstyrt, fordi det ikke er tydelig at aksjonspunktet krever overstyrerrolle. Alle paneler med overstyring skal derfor vise tydelig at noe er overstyrt, og hvem som kan behandle det.

## Begreper

- **Overstyrerrolle**: Rollen `navAnsatt.kanOverstyre`. Bare saksbehandlere som har den, kan overstyre og løse overstyringsaksjonspunkter.
- **Overstyringsaksjonspunkt**: Aksjonspunkt med `aksjonspunktType === 'OVST'` (`aksjonspunktType.OVERSTYRING` fra `@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktType.js`). Det kan være opprettet i denne eller i en tidligere behandling. Det er derfor ikke sikkert at saksbehandleren vet at noen har overstyrt.

Det er tilgangskontrollen (`sif-abac-pdp`, `TilgangTilOperasjonTjenesteK9`) som krever rollen. Den avviser oppdateringer som inneholder et aksjonspunkt med type `OVST` når saksbehandleren ikke har overstyrerrolle (`ER_IKKE_OVERSTYRER`). Det gjelder både `/behandling/aksjonspunkt` og `/behandling/aksjonspunkt/overstyr`.

### Hvorfor vi ikke tar med `SAOV` og `MANU`

Varselet skal fortelle saksbehandleren at hen ikke kan løse aksjonspunktet uten overstyrerrolle. Det stemmer bare for `OVST`, fordi det er den eneste typen tilgangskontrollen sjekker rollen for.

- **`SAOV` (saksbehandleroverstyring)**, f.eks. søknadsfrist (6006) og opplysningsplikt (6002): Saksbehandleren overstyrer en automatisk vurdering, men alle saksbehandlere kan gjøre det. Tilgangskontrollen krever ikke overstyrerrolle.
- **`MANU` (manuell)**: Vanlige aksjonspunkter som alle saksbehandlere kan løse. Noen heter «overstyr» i frontend (f.eks. `OVERSTYR_BEREGNING_INPUT` (9005) og `OVERSTYRING_FRISINN_OPPGITT_OPPTJENING` (8004)), men de krever ikke rollen.

Hvis vi viste varselet for disse, ville vi sagt til vanlige saksbehandlere at de ikke kan løse noe de faktisk kan løse. Da mister varselet tilliten, og saker blir sendt videre uten grunn.

Bruk `aksjonspunktType` for å avgjøre om noe er overstyring. Ikke bruk navn eller kode på aksjonspunktet: navnene i frontend er delvis utdaterte, og kodene `6004` og `6008` betyr noe annet i backend enn i `AksjonspunktCodes`.

## Hvor `erOverstyrer` kommer fra

1. `packages/sak-app/src/app/util/access.ts`: `kanOverstyreAccess` gir `{ employeeHasAccess, isEnabled }`.
   - `employeeHasAccess`: den ansatte kan saksbehandle **og** har overstyrerrolle.
   - `isEnabled`: som over, **og** fagsaken er `UNDER_BEHANDLING` **og** behandlingen er `BEHANDLING_UTREDES`.
2. Behandlingspakkene sender verdien videre som `rettigheter.kanOverstyreAccess` (`packages/behandling-felles/src/types/rettigheterTsType.ts`).
3. Panelene får enten hele `kanOverstyreAccess` eller `erOverstyrer={rettigheter.kanOverstyreAccess.isEnabled}`.

Fallgruve: `isEnabled === false` kan bety både «mangler rollen» og «behandlingen har feil status», f.eks. en avsluttet behandling. Varselet sier noe om rollen, så bruk `employeeHasAccess` for varselet. Behold `isEnabled` for handlingsknapper som skal være deaktivert når behandlingen ikke kan redigeres.

## Slik gjør vi overstyring tydelig

Varselet er for saksbehandlere **uten** overstyrerrolle. Overstyrere får ikke det felles varselet. Unntaket er uttak, som også før endringen hadde et eget varsel til overstyrere (`OverstyrUttak`).

Bruk `OverstyringAksjonspunktVarsel` (`packages/v2/gui/src/shared/overstyring/`). Send inn aksjonspunktene **som hører til panelet**. Varselet finner selv aksjonspunktet med type `OVST`, og rendrer ingenting når saksbehandleren er overstyrer eller det ikke finnes et åpent eller utført overstyringsaksjonspunkt.

```tsx
{
  skalViseOverstyringAksjonspunktVarsel(aksjonspunkter, erOverstyrer) && (
    <Box marginBlock="space-0 space-16">
      <OverstyringAksjonspunktVarsel
        aksjonspunkter={aksjonspunkter}
        erOverstyrer={erOverstyrer}
        overstyrtHva="vilkåret"
      />
    </Box>
  );
}
```

Har du ingen wrapper rundt, kan du droppe `skalViseOverstyringAksjonspunktVarsel`.

Regler:

1. **Send bare inn panelets aksjonspunkter.** Får panelet alle aksjonspunktene i behandlingen, f.eks. uttak, filtrer på definisjon først. Ellers vises overstyringer fra andre steg.
2. **Vis varselet inni panelet**, rett under overskriften og før andre aksjonspunkter og skjema. Ikke legg det over panelet i `PanelDef`; send heller `aksjonspunkter` og `erOverstyrer` inn til panelkomponenten. Finnes både v1 og v2 bak en feature toggle, skal varselet inn i begge.
3. **Bare overstyringsaksjonspunktet skal styre varselet.** Ikke legg det inni en komponent som skjules av andre betingelser, f.eks. andre uløste aksjonspunkter eller tomme lister.
4. **Vis varselet både når aksjonspunktet er åpent (`OPPRETTET`) og utført (`UTFØRT`)**, slik at saksbehandleren skjønner at redigering må gjøres av en overstyrer. Ikke vis det når aksjonspunktet er `AVBRUTT`.
5. **Tekst og farge avhenger av status.** Åpen og utført overstyring har ulik farge og tekst. Teksten nevner ikke «aksjonspunkt», og bruker ikke «behandling» om det som gjenstår, siden «behandling» er selve saken. Tekst, farge og ikon ligger i `OverstyringAksjonspunktVarsel`. Endre dem der.
6. Skjul handlingsknapper (overstyr, lagre, bekreft) for saksbehandlere uten overstyrerrolle.

## Oversikt: hvor kreves overstyrerrolle

Listen tar bare med steder i frontend der det kan overstyres, og der aksjonspunktet har type `OVST` i `AksjonspunktDefinisjon.java` i k9-sak. Se over for hvorfor `SAOV` og `MANU` ikke er med.

### Inngangsvilkår

Alle inngangsvilkår som krever overstyrerrolle. Søknadsfrist (`SAOV`) og alder (ingen overstyring i backend) er ikke med.

| Vilkår              | Behandlingstyper                                                | Aksjonspunkt i backend (kode)               | Komponent            | Varsel                                                                                                                                                                                                        |
| ------------------- | --------------------------------------------------------------- | ------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Omsorgen for        | Pleiepenger, opplæringspenger, omsorgspenger                    | `OVERSTYRING_AV_OMSORGEN_FOR` (6003)        | Felles vilkårspanel¹ | Ja                                                                                                                                                                                                            |
| Medlemskap          | Pleiepenger, sluttfase, opplæringspenger, omsorgspenger, unntak | `OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET` (6005) | Felles vilkårspanel¹ | Ja                                                                                                                                                                                                            |
| Fortsatt medlemskap | Pleiepenger, sluttfase, opplæringspenger                        | `OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET` (6005) | Felles vilkårspanel¹ | Ja i init-panelet for pleiepenger. Nei i `FortsattMedlemskapProsessStegPanelDef`: den filtrerer på `OVERSTYR_LØPENDE_MEDLEMSKAPSVILKAR` (6012), som ikke finnes i backend, og får derfor aldri aksjonspunktet |
| Opptjening          | Pleiepenger, sluttfase, opplæringspenger, omsorgspenger, unntak | `OVERSTYRING_AV_OPPTJENINGSVILKÅRET` (6011) | Felles vilkårspanel¹ | Ja                                                                                                                                                                                                            |

### Andre steder

| Område            | Aksjonspunkt i backend (kode)                                                             | Komponent                                                                      | Varsel                                                    |
| ----------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------- |
| Uttak             | `OVERSTYRING_AV_UTTAK` (6017)                                                             | `v2/gui/src/prosess/uttak/`                                                    | Ja                                                        |
| Unntak            | `OVERSTYRING_AV_K9_VILKÅRET` (6016, i frontend `OVERSTYRING_MANUELL_VURDERING_VILKÅR`)    | v1 `prosess-unntak/` (`BehandleUnntakForm`) og v2 `v2/gui/src/prosess/unntak/` | Ja                                                        |
| Beregning (fakta) | `OVERSTYRING_AV_BEREGNINGSAKTIVITETER` (6014), `OVERSTYRING_AV_BEREGNINGSGRUNNLAG` (6015) | `BeregningFaktaPanelDef` → `@navikt/ft-fakta-beregning`                        | Nei: må fikses i felleskomponentene (ft-frontend-pakkene) |

¹ `v2/gui/src/prosess/vilkar-overstyring/` (`VilkarresultatMedOverstyringProsessIndex`). Brukes både av `ProsessStegOverstyringPanelDef` i det gamle rammeverket og av init-panelene i `behandling-pleiepenger/src/prosess/`.

Oppdater tabellene når du tar i bruk varselet i et nytt panel, eller når et nytt panel får overstyring.

## Stories og tester

- Sett `aksjonspunktType: aksjonspunktType.OVERSTYRING` på overstyringsaksjonspunkter i mocks. Ellers vises ikke varselet.
- Stories viser bare tilfeller der varselet faktisk vises: åpent og utført aksjonspunkt uten overstyrerrolle. Tilfeller uten varsel (overstyrer, `SAOV`, `MANU`, `AVBRUTT`) rendrer ingenting og testes i Vitest i `overstyringsaksjonspunkt.test.ts`.
- Oversikt over alle steder med varsel: `OverstyringOversikt.stories.tsx` (Storybook: «gui/shared/overstyring/Oversikt over overstyringer»). Legg til en story der når et nytt panel får varselet.
- Eksempler: `OverstyringAksjonspunktVarsel.stories.tsx`, `OverstyrUttak.stories.tsx` og `VilkarresultatMedOverstyringProsessIndex.stories.tsx`.
- Varselet har ingen heading. Finn det med `getByText`, ikke `getByRole('heading')`.
