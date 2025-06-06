import type { AlleKodeverdierSomObjektResponse } from '@k9-sak-web/backend/k9klage/generated/types.js';

// Data i denne konstant er ein direkte kopi av response body frå /k9/klage/api/kodeverk/alle/objekt, med X-Json-Serializer-Option: openapi-compat.
// Brukast for å kunne gjere kodeverk oppslag i test/stories.
// Oppdater med ny kopi frå nevnte endepunkt (feks via swagger) når kodeverk definisjoner blir endra i k9-klage kode.
export const oppslagKodeverkSomObjektK9Klage = {
  fagsakStatuser: [
    {
      kode: 'AVSLU',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Avsluttet',
      kilde: 'AVSLU',
    },
    {
      kode: 'LOP',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Løpende',
      kilde: 'LOP',
    },
    {
      kode: 'OPPR',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Opprettet',
      kilde: 'OPPR',
    },
    {
      kode: 'UBEH',
      kodeverk: 'FAGSAK_STATUS',
      navn: 'Under behandling',
      kilde: 'UBEH',
    },
  ],
  behandlingÅrsakTyper: [
    {
      kode: '-',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'ETTER_KLAGE',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Ny behandling eller revurdering etter klage eller anke',
      kilde: 'ETTER_KLAGE',
    },
    {
      kode: 'KØET-BEHANDLING',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Søker eller den andre forelderen har en åpen behandling',
      kilde: 'KØET-BEHANDLING',
    },
    {
      kode: 'RE-ANNET',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Annet',
      kilde: 'RE-ANNET',
    },
    {
      kode: 'RE-FEFAKTA',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Feil eller endret fakta',
      kilde: 'RE-FEFAKTA',
    },
    {
      kode: 'RE-KLAG-M-INNTK',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Klage/ankebehandling med endrede inntektsopplysninger',
      kilde: 'RE-KLAG-M-INNTK',
    },
    {
      kode: 'RE-KLAG-U-INNTK',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Klage/ankebehandling uten endrede inntektsopplysninger',
      kilde: 'RE-KLAG-U-INNTK',
    },
    {
      kode: 'RE-LOV',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Feil lovanvendelse',
      kilde: 'RE-LOV',
    },
    {
      kode: 'RE-PRSSL',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Prosessuell feil',
      kilde: 'RE-PRSSL',
    },
    {
      kode: 'RE-REGISTEROPPL',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Nye registeropplysninger',
      kilde: 'RE-REGISTEROPPL',
    },
    {
      kode: 'RE-RGLF',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Feil regelverksforståelse',
      kilde: 'RE-RGLF',
    },
    {
      kode: 'RE-SRTB',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Nye opplysninger om søkers relasjon til barnet',
      kilde: 'RE-SRTB',
    },
    {
      kode: 'RE-TILST-YT-INNVIL',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Tilstøtende ytelse innvilget',
      kilde: 'RE-TILST-YT-INNVIL',
    },
    {
      kode: 'RE-TILST-YT-OPPH',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Tilstøtende ytelse opphørt',
      kilde: 'RE-TILST-YT-OPPH',
    },
    {
      kode: 'RE-YTELSE',
      kodeverk: 'BEHANDLING_AARSAK',
      navn: 'Nye opplysninger om ytelse',
      kilde: 'RE-YTELSE',
    },
  ],
  historikkBegrunnelseTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINIERT',
    },
    {
      kode: 'BEH_STARTET_PA_NYTT',
      kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      navn: 'Behandling startet på nytt',
      kilde: 'BEH_STARTET_PA_NYTT',
    },
    {
      kode: 'BERORT_BEH_ENDRING_DEKNINGSGRAD',
      kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      navn: 'Endring i den andre forelderens dekningsgrad',
      kilde: 'BERORT_BEH_ENDRING_DEKNINGSGRAD',
    },
    {
      kode: 'BERORT_BEH_OPPHOR',
      kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      navn: 'Den andre forelderens vedtak er opphørt',
      kilde: 'BERORT_BEH_OPPHOR',
    },
    {
      kode: 'SAKSBEH_START_PA_NYTT',
      kodeverk: 'HISTORIKK_BEGRUNNELSE_TYPE',
      navn: 'Saksbehandling starter på nytt',
      kilde: 'SAKSBEH_START_PA_NYTT',
    },
  ],
  oppgaveÅrsaker: [
    {
      kode: '-',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'BEH_SAK',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Behandle sak',
      kilde: 'BEHANDLE_SAK',
    },
    {
      kode: 'GOD_VED',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Godkjenne vedtak',
      kilde: 'GODKJENN_VEDTAK',
    },
    {
      kode: 'RV',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Revurdere',
      kilde: 'REVURDER',
    },
    {
      kode: 'SETTVENT',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Sett utbetaling på vent',
      kilde: 'SETTVENT',
    },
    {
      kode: 'VUR',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Vurder dokument',
      kilde: 'VURDER_DOKUMENT_VL',
    },
    {
      kode: 'VUR_KONS_YTE',
      kodeverk: 'OPPGAVE_AARSAK',
      navn: 'Vurder konsekvens for ytelse',
      kilde: 'VURDER_KONSEKVENS_YTELSE',
    },
  ],
  behandlingResultatTyper: [
    {
      kode: 'AVSLÅTT',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Avslått',
      kilde: 'AVSLÅTT',
    },
    {
      kode: 'DELVIS_MEDHOLD_I_KLAGE',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Delvis medhold i klage',
      kilde: 'DELVIS_MEDHOLD_I_KLAGE',
    },
    {
      kode: 'FEILREGISTRERT',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Feilregistrert av Kabal',
      kilde: 'FEILREGISTRERT',
    },
    {
      kode: 'HENLAGT_BRUKER_DØD',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Henlagt, brukeren er død',
      kilde: 'HENLAGT_BRUKER_DØD',
    },
    {
      kode: 'HENLAGT_FEILOPPRETTET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Henlagt, søknaden er feilopprettet',
      kilde: 'HENLAGT_FEILOPPRETTET',
    },
    {
      kode: 'HENLAGT_KLAGE_TRUKKET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Henlagt, klagen er trukket',
      kilde: 'HENLAGT_KLAGE_TRUKKET',
    },
    {
      kode: 'HENLAGT_SØKNAD_MANGLER',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Henlagt søknad mangler',
      kilde: 'HENLAGT_SØKNAD_MANGLER',
    },
    {
      kode: 'HENLAGT_SØKNAD_TRUKKET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Henlagt, søknaden er trukket',
      kilde: 'HENLAGT_SØKNAD_TRUKKET',
    },
    {
      kode: 'HJEMSENDE_UTEN_OPPHEVE',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Behandlingen er hjemsendt',
      kilde: 'HJEMSENDE_UTEN_OPPHEVE',
    },
    {
      kode: 'IKKE_FASTSATT',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Ikke fastsatt',
      kilde: 'IKKE_FASTSATT',
    },
    {
      kode: 'INGEN_ENDRING',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Ingen endring',
      kilde: 'INGEN_ENDRING',
    },
    {
      kode: 'INNVILGET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Innvilget',
      kilde: 'INNVILGET',
    },
    {
      kode: 'INNVILGET_ENDRING',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Endring innvilget',
      kilde: 'INNVILGET_ENDRING',
    },
    {
      kode: 'KLAGE_AVVIST',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Klage er avvist',
      kilde: 'KLAGE_AVVIST',
    },
    {
      kode: 'KLAGE_MEDHOLD',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Medhold',
      kilde: 'KLAGE_MEDHOLD',
    },
    {
      kode: 'KLAGE_TRUKKET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Klagen er trukket',
      kilde: 'KLAGE_TRUKKET',
    },
    {
      kode: 'KLAGE_YTELSESVEDTAK_OPPHEVET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Ytelsesvedtak opphevet',
      kilde: 'KLAGE_YTELSESVEDTAK_OPPHEVET',
    },
    {
      kode: 'KLAGE_YTELSESVEDTAK_STADFESTET',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Ytelsesvedtak stadfestet',
      kilde: 'KLAGE_YTELSESVEDTAK_STADFESTET',
    },
    {
      kode: 'MERGET_OG_HENLAGT',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Mottatt ny søknad',
      kilde: 'MERGET_OG_HENLAGT',
    },
    {
      kode: 'OPPHØR',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Opphør',
      kilde: 'OPPHØR',
    },
    {
      kode: 'UGUNST_MEDHOLD_I_KLAGE',
      kodeverk: 'BEHANDLING_RESULTAT_TYPE',
      navn: 'Ugunst medhold i klage',
      kilde: 'UGUNST_MEDHOLD_I_KLAGE',
    },
  ],
  personstatusTyper: [
    {
      kode: '-',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'ABNR',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Aktivt BOSTNR',
      kilde: 'ABNR',
    },
    {
      kode: 'ADNR',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Aktivt D-nummer',
      kilde: 'ADNR',
    },
    {
      kode: 'BOSA',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Bosatt',
      kilde: 'BOSA',
    },
    {
      kode: 'DØD',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Død',
      kilde: 'DØD',
    },
    {
      kode: 'DØDD',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Dødd',
      kilde: 'DØDD',
    },
    {
      kode: 'FOSV',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Forsvunnet/savnet',
      kilde: 'FOSV',
    },
    {
      kode: 'FØDR',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Fødselregistrert',
      kilde: 'FØDR',
    },
    {
      kode: 'UFUL',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Ufullstendig fødselsnr',
      kilde: 'UFUL',
    },
    {
      kode: 'UREG',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Uregistrert person',
      kilde: 'UREG',
    },
    {
      kode: 'UTAN',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Utgått person annullert tilgang Fnr',
      kilde: 'UTAN',
    },
    {
      kode: 'UTPE',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Utgått person',
      kilde: 'UTPE',
    },
    {
      kode: 'UTVA',
      kodeverk: 'PERSONSTATUS_TYPE',
      navn: 'Utvandret',
      kilde: 'UTVA',
    },
  ],
  fagsakYtelseTyper: [
    {
      kode: '-',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'AAP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Arbeidsavklaringspenger',
      kilde: 'AAP',
    },
    {
      kode: 'DAG',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Dagpenger',
      kilde: 'DAG',
    },
    {
      kode: 'EF',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Enslig forsørger',
      kilde: 'EF',
    },
    {
      kode: 'ES',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Engangsstønad',
      kilde: 'ES',
    },
    {
      kode: 'FP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Foreldrepenger',
      kilde: 'FP',
    },
    {
      kode: 'FRISINN',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'FRIlansere og Selstendig næringsdrivendes INNtektskompensasjon',
      kilde: 'FRISINN',
    },
    {
      kode: 'OBSOLETE',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Kun brukt for å markere noen som utgått - ikke en gyldig type i seg selv',
      kilde: 'OBSOLETE',
    },
    {
      kode: 'OLP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Opplæringspenger',
      kilde: 'OLP',
    },
    {
      kode: 'OMP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Omsorgspenger',
      kilde: 'OMP',
    },
    {
      kode: 'OMP_AO',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Alene om omsorg',
      kilde: 'OMP_AO',
    },
    {
      kode: 'OMP_KS',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Omsorgspenger - Utvidet rett Kronisk sykdom',
      kilde: 'OMP_KS',
    },
    {
      kode: 'OMP_MA',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Omsorgspenger - Utvidet rett Midlertidig Alene',
      kilde: 'OMP_MA',
    },
    {
      kode: 'PPN',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Pleiepenger nærstående',
      kilde: 'PPN',
    },
    {
      kode: 'PS',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Pårørende sykdom',
      kilde: 'PS',
    },
    {
      kode: 'PSB',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Pleiepenger sykt barn',
      kilde: 'PSB',
    },
    {
      kode: 'SP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Sykepenger',
      kilde: 'SP',
    },
    {
      kode: 'SVP',
      kodeverk: 'FAGSAK_YTELSE',
      navn: 'Svangerskapspenger',
      kilde: 'SVP',
    },
  ],
  venteårsaker: [
    {
      kode: '-',
      kodeverk: 'VENT_AARSAK',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'AAP_DP_ENESTE_AKTIVITET_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Bruker har ikke rett til svangerskapspenger når eneste aktivitet er AAP/DP',
      kilde: 'AAP_DP_ENESTE_AKTIVITET_SVP',
    },
    {
      kode: 'AAP_DP_SISTE_10_MND_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'AAP_DP_SISTE_10_MND_SVP',
    },
    {
      kode: 'ANKE_OVERSENDT_TIL_TRYGDERETTEN',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på at saken blir behandlet hos Trygderetten',
      kilde: 'ANKE_OVERSENDT_TIL_TRYGDERETTEN',
    },
    {
      kode: 'ANKE_VENTER_PAA_MERKNADER_FRA_BRUKER',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på merknader fra bruker',
      kilde: 'ANKE_VENTER_PAA_MERKNADER_FRA_BRUKER',
    },
    {
      kode: 'AVV_DOK',
      kodeverk: 'VENT_AARSAK',
      navn: 'Avventer dokumentasjon',
      kilde: 'AVV_DOK',
    },
    {
      kode: 'AVV_FODSEL',
      kodeverk: 'VENT_AARSAK',
      navn: 'Avventer fødsel',
      kilde: 'AVV_FODSEL',
    },
    {
      kode: 'AVV_RESPONS_REVURDERING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Avventer respons på varsel om revurdering',
      kilde: 'AVV_RESPONS_REVURDERING',
    },
    {
      kode: 'DELVIS_TILRETTELEGGING_OG_REFUSJON_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'DELVIS_TILRETTELEGGING_OG_REFUSJON_SVP',
    },
    {
      kode: 'FLERE_ARBEIDSFORHOLD_SAMME_ORG_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Håndterer foreløpig ikke flere arbeidsforhold i samme virksomhet for SVP',
      kilde: 'FLERE_ARBEIDSFORHOLD_SAMME_ORG_SVP',
    },
    {
      kode: 'FL_SN_IKKE_STOTTET_FOR_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'FL_SN_IKKE_STOTTET_FOR_SVP',
    },
    {
      kode: 'FOR_TIDLIG_SOKNAD',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter pga for tidlig søknad',
      kilde: 'FOR_TIDLIG_SOKNAD',
    },
    {
      kode: 'GRADERING_FLERE_ARBEIDSFORHOLD',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'GRADERING_FLERE_ARBEIDSFORHOLD',
    },
    {
      kode: 'OPPD_ÅPEN_BEH',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på oppdatering av åpen behandling',
      kilde: 'OPPD_ÅPEN_BEH',
    },
    {
      kode: 'OVERSENDT_KABAL',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på at behandling utføres av Klage- og ankeenheten',
      kilde: 'OVERSENDT_KABAL',
    },
    {
      kode: 'REFUSJON_3_MÅNEDER',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'REFUSJON_3_MÅNEDER',
    },
    {
      kode: 'SCANN',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på scanning',
      kilde: 'SCANN',
    },
    {
      kode: 'ULIKE_STARTDATOER_SVP',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'ULIKE_STARTDATOER_SVP',
    },
    {
      kode: 'UTV_FRIST',
      kodeverk: 'VENT_AARSAK',
      navn: 'Utvidet frist',
      kilde: 'UTV_FRIST',
    },
    {
      kode: 'VENTELØNN_ELLER_MILITÆR_MED_FLERE_AKTIVITETER',
      kodeverk: 'VENT_AARSAK',
      navn: 'Mangel i løsning for oppgitt ventelønn og/eller militær i kombinasjon med andre statuser',
      kilde: 'VENTELØNN_ELLER_MILITÆR_MED_FLERE_AKTIVITETER',
    },
    {
      kode: 'VENT_BEREGNING_TILBAKE_I_TID',
      kodeverk: 'VENT_AARSAK',
      navn: 'Endring i tilkjent ytelse bakover i tid. Dette håndteres ikke i løsningen enda.',
      kilde: 'VENT_BEREGNING_TILBAKE_I_TID',
    },
    {
      kode: 'VENT_DEKGRAD_REGEL',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på 80% dekningsgrad-regel',
      kilde: 'VENT_DEKGRAD_REGEL',
    },
    {
      kode: 'VENT_DØDFØDSEL_80P_DEKNINGSGRAD',
      kodeverk: 'VENT_AARSAK',
      navn: 'Mangel i løsning for oppgitt 80% dekningsgrad med dødfødsel',
      kilde: 'VENT_DØDFØDSEL_80P_DEKNINGSGRAD',
    },
    {
      kode: 'VENT_FEIL_ENDRINGSSØKNAD',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av potensielt feil i endringssøknad',
      kilde: 'VENT_FEIL_ENDRINGSSØKNAD',
    },
    {
      kode: 'VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG',
      kodeverk: 'VENT_AARSAK',
      navn: 'Mangel i løsning for oppgitt gradering der utbetaling ikke finnes',
      kilde: 'VENT_GRADERING_UTEN_BEREGNINGSGRUNNLAG',
    },
    {
      kode: 'VENT_INFOTRYGD',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på en ytelse i Infotrygd',
      kilde: 'VENT_INFOTRYGD',
    },
    {
      kode: 'VENT_INNTEKT_RAPPORTERINGSFRIST',
      kodeverk: 'VENT_AARSAK',
      navn: 'Inntekt rapporteringsfrist',
      kilde: 'VENT_INNTEKT_RAPPORTERINGSFRIST',
    },
    {
      kode: 'VENT_MILITÆR_OG_BG_UNDER_3G',
      kodeverk: 'VENT_AARSAK',
      navn: 'Behandlingen er satt på vent på grunn av mangel i løsningen. Det jobbes med å løse dette.',
      kilde: 'VENT_MILITÆR_OG_BG_UNDER_3G',
    },
    {
      kode: 'VENT_OPDT_INNTEKTSMELDING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på oppdatert inntektsmelding',
      kilde: 'VENT_OPDT_INNTEKTSMELDING',
    },
    {
      kode: 'VENT_OPPTJENING_OPPLYSNINGER',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på opptjeningsopplysninger',
      kilde: 'VENT_OPPTJENING_OPPLYSNINGER',
    },
    {
      kode: 'VENT_PÅ_NY_INNTEKTSMELDING_MED_GYLDIG_ARB_ID',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på ny inntektsmelding med arbeidsforholdId som stemmer med Aareg',
      kilde: 'VENT_PÅ_NY_INNTEKTSMELDING_MED_GYLDIG_ARB_ID',
    },
    {
      kode: 'VENT_PÅ_SISTE_AAP_MELDEKORT',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på siste meldekort for AAP eller dagpenger før første uttaksdag.',
      kilde: 'VENT_PÅ_SISTE_AAP_MELDEKORT',
    },
    {
      kode: 'VENT_REGISTERINNHENTING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på registerinformasjon',
      kilde: 'VENT_REGISTERINNHENTING',
    },
    {
      kode: 'VENT_SØKNAD_SENDT_INFORMASJONSBREV',
      kodeverk: 'VENT_AARSAK',
      navn: 'Sendt informasjonsbrev venter søknad.',
      kilde: 'VENT_SØKNAD_SENDT_INFORMASJONSBREV',
    },
    {
      kode: 'VENT_TIDLIGERE_BEHANDLING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på iverksettelse av en tidligere behandling i denne saken',
      kilde: 'VENT_TIDLIGERE_BEHANDLING',
    },
    {
      kode: 'VENT_ÅPEN_BEHANDLING',
      kodeverk: 'VENT_AARSAK',
      navn: 'Søker eller den andre forelderen har en åpen behandling',
      kilde: 'VENT_ÅPEN_BEHANDLING',
    },
    {
      kode: 'VENT_ØKONOMI',
      kodeverk: 'VENT_AARSAK',
      navn: 'Venter på økonomiløsningen',
      kilde: 'VENT_ØKONOMI',
    },
  ],
  behandlingTyper: [
    {
      kode: '-',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'BT-002',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Førstegangsbehandling',
      kilde: 'BT-002',
    },
    {
      kode: 'BT-003',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Klage',
      kilde: 'BT-003',
    },
    {
      kode: 'BT-004',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Revurdering',
      kilde: 'BT-004',
    },
    {
      kode: 'BT-007',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Tilbakekreving',
      kilde: 'BT-007',
    },
    {
      kode: 'BT-008',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Anke',
      kilde: 'BT-008',
    },
    {
      kode: 'BT-009',
      kodeverk: 'BEHANDLING_TYPE',
      navn: 'Tilbakekreving revurdering',
      kilde: 'BT-009',
    },
  ],
  revurderingVarslingÅrsaker: [
    {
      kode: 'AKTIVITET',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Mors aktivitetskrav er ikke oppfylt',
      kilde: 'AKTIVITET',
    },
    {
      kode: 'ANNET',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Annet',
      kilde: 'ANNET',
    },
    {
      kode: 'BARNIKKEREG',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Barn er ikke registrert i folkeregisteret',
      kilde: 'BARNIKKEREG',
    },
    {
      kode: 'IKKEOPPHOLD',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Ikke lovlig opphold',
      kilde: 'IKKEOPPHOLD',
    },
    {
      kode: 'IKKEOPPTJENT',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Beregningsgrunnlaget er under 1/2 G',
      kilde: 'IKKEOPPTJENT',
    },
    {
      kode: 'JOBB6MND',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Opptjeningsvilkår ikke oppfylt',
      kilde: 'JOBB6MND',
    },
    {
      kode: 'JOBBFULLTID',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Arbeid i stønadsperioden',
      kilde: 'JOBBFULLTID',
    },
    {
      kode: 'JOBBUTLAND',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Arbeid i utlandet',
      kilde: 'JOBBUTLAND',
    },
    {
      kode: 'UTVANDRET',
      kodeverk: 'REVURDERING_VARSLING_AARSAK',
      navn: 'Bruker er registrert utvandret',
      kilde: 'UTVANDRET',
    },
  ],
  fagsystemer: [
    {
      kode: '-',
      kodeverk: 'FAGSYSTEM',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'AAREGISTERET',
      kodeverk: 'FAGSYSTEM',
      navn: 'AAregisteret',
      kilde: 'AAREGISTERET',
    },
    {
      kode: 'ARENA',
      kodeverk: 'FAGSYSTEM',
      navn: 'Arena',
      kilde: 'ARENA',
    },
    {
      kode: 'ENHETSREGISTERET',
      kodeverk: 'FAGSYSTEM',
      navn: 'Enhetsregisteret',
      kilde: 'ENHETSREGISTERET',
    },
    {
      kode: 'FPSAK',
      kodeverk: 'FAGSYSTEM',
      navn: 'Vedtaksløsning Foreldrepenger',
      kilde: 'FPSAK',
    },
    {
      kode: 'GOSYS',
      kodeverk: 'FAGSYSTEM',
      navn: 'Gosys',
      kilde: 'GOSYS',
    },
    {
      kode: 'INFOTRYGD',
      kodeverk: 'FAGSYSTEM',
      navn: 'Infotrygd',
      kilde: 'INFOTRYGD',
    },
    {
      kode: 'INNTEKT',
      kodeverk: 'FAGSYSTEM',
      navn: 'INNTEKT',
      kilde: 'INNTEKT',
    },
    {
      kode: 'JOARK',
      kodeverk: 'FAGSYSTEM',
      navn: 'Joark',
      kilde: 'JOARK',
    },
    {
      kode: 'K9SAK',
      kodeverk: 'FAGSYSTEM',
      navn: 'Vedtaksløsning K9 - Pleiepenger',
      kilde: 'K9SAK',
    },
    {
      kode: 'MEDL',
      kodeverk: 'FAGSYSTEM',
      navn: 'MEDL',
      kilde: 'MEDL',
    },
    {
      kode: 'TPS',
      kodeverk: 'FAGSYSTEM',
      navn: 'TPS',
      kilde: 'TPS',
    },
    {
      kode: 'VLSP',
      kodeverk: 'FAGSYSTEM',
      navn: 'Vedtaksløsning Sykepenger',
      kilde: 'VLSP',
    },
  ],
  sivilstandTyper: [
    {
      kode: 'ENKE',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Enke/-mann',
      kilde: 'ENKE',
    },
    {
      kode: 'GIFT',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Gift',
      kilde: 'GIFT',
    },
    {
      kode: 'GJPA',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Gjenlevende partner',
      kilde: 'GJPA',
    },
    {
      kode: 'GLAD',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Gift, lever adskilt',
      kilde: 'GLAD',
    },
    {
      kode: 'NULL',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Uoppgitt',
      kilde: 'NULL',
    },
    {
      kode: 'REPA',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Registrert partner',
      kilde: 'REPA',
    },
    {
      kode: 'SAMB',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Samboer',
      kilde: 'SAMB',
    },
    {
      kode: 'SEPA',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Separert partner',
      kilde: 'SEPA',
    },
    {
      kode: 'SEPR',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Separert',
      kilde: 'SEPR',
    },
    {
      kode: 'SKIL',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Skilt',
      kilde: 'SKIL',
    },
    {
      kode: 'SKPA',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Skilt partner',
      kilde: 'SKPA',
    },
    {
      kode: 'UGIF',
      kodeverk: 'SIVILSTAND_TYPE',
      navn: 'Ugift',
      kilde: 'UGIF',
    },
  ],
  skjermlenkeTyper: [
    {
      kode: '-',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'BEREGNING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Beregning',
      kilde: 'BEREGNING',
    },
    {
      kode: 'FAKTA_FOR_OPPTJENING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om opptjening',
      kilde: 'FAKTA_FOR_OPPTJENING',
    },
    {
      kode: 'FAKTA_OM_ARBEIDSFORHOLD',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om arbeidsforhold',
      kilde: 'FAKTA_OM_ARBEIDSFORHOLD',
    },
    {
      kode: 'FAKTA_OM_BEREGNING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om beregning',
      kilde: 'FAKTA_OM_BEREGNING',
    },
    {
      kode: 'FAKTA_OM_FORDELING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om fordeling',
      kilde: 'FAKTA_OM_FORDELING',
    },
    {
      kode: 'FAKTA_OM_MEDISINSK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om medisinsk',
      kilde: 'FAKTA_OM_MEDISINSK',
    },
    {
      kode: 'FAKTA_OM_MEDLEMSKAP',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om medlemskap',
      kilde: 'FAKTA_OM_MEDLEMSKAP',
    },
    {
      kode: 'FAKTA_OM_OPPTJENING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om opptjening',
      kilde: 'FAKTA_OM_OPPTJENING',
    },
    {
      kode: 'FAKTA_OM_SIMULERING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Simulering',
      kilde: 'FAKTA_OM_SIMULERING',
    },
    {
      kode: 'FAKTA_OM_UTTAK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om uttak',
      kilde: 'FAKTA_OM_UTTAK',
    },
    {
      kode: 'FAKTA_OM_VERGE',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Fakta om verge/fullmektig',
      kilde: 'FAKTA_OM_VERGE',
    },
    {
      kode: 'FORMKRAV_KLAGE_KA',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Formkrav klage Klageinstans',
      kilde: 'FORMKRAV_KLAGE_KA',
    },
    {
      kode: 'FORMKRAV_KLAGE_NFP',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Formkrav klage Vedtaksinstans',
      kilde: 'FORMKRAV_KLAGE_NFP',
    },
    {
      kode: 'KLAGE_BEH_NFP',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Klageresultat Vedtaksinstans',
      kilde: 'KLAGE_BEH_NFP',
    },
    {
      kode: 'KLAGE_BEH_NK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Klageresultat Klageinstans',
      kilde: 'KLAGE_BEH_NK',
    },
    {
      kode: 'KONTROLL_AV_SAKSOPPLYSNINGER',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Kontroll av saksopplysninger',
      kilde: 'KONTROLL_AV_SAKSOPPLYSNINGER',
    },
    {
      kode: 'OPPLYSNINGSPLIKT',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Opplysningsplikt',
      kilde: 'OPPLYSNINGSPLIKT',
    },
    {
      kode: 'PUNKT_FOR_MEDISINSK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Medisinsk',
      kilde: 'PUNKT_FOR_MEDISINSK',
    },
    {
      kode: 'PUNKT_FOR_MEDLEMSKAP',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Medlemskap',
      kilde: 'PUNKT_FOR_MEDLEMSKAP',
    },
    {
      kode: 'PUNKT_FOR_MEDLEMSKAP_LØPENDE',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Punkt for medlemskap løpende',
      kilde: 'PUNKT_FOR_MEDLEMSKAP_LØPENDE',
    },
    {
      kode: 'PUNKT_FOR_OMSORGEN_FOR',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Omsorgen for',
      kilde: 'PUNKT_FOR_OMSORGEN_FOR',
    },
    {
      kode: 'PUNKT_FOR_OPPTJENING',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Opptjening',
      kilde: 'PUNKT_FOR_OPPTJENING',
    },
    {
      kode: 'SOEKNADSFRIST',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Søknadsfrist',
      kilde: 'SOEKNADSFRIST',
    },
    {
      kode: 'TILKJENT_YTELSE',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Tilkjent ytelse',
      kilde: 'TILKJENT_YTELSE',
    },
    {
      kode: 'UTLAND',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Endret utland',
      kilde: 'UTLAND',
    },
    {
      kode: 'UTTAK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Uttak',
      kilde: 'UTTAK',
    },
    {
      kode: 'VEDTAK',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Vedtak',
      kilde: 'VEDTAK',
    },
    {
      kode: 'VURDER_FARESIGNALER',
      kodeverk: 'SKJERMLENKE_TYPE',
      navn: 'Vurder faresignaler',
      kilde: 'VURDER_FARESIGNALER',
    },
  ],
  historikkOpplysningTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_OPPLYSNING_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINIERT',
    },
  ],
  historikkEndretFeltTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'BEHANDLENDE_ENHET',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Behandlende enhet',
      kilde: 'BEHANDLENDE_ENHET',
    },
    {
      kode: 'ER_ANKEFRIST_IKKE_OVERHOLDT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er ankefrist ikke overholdt',
      kilde: 'ER_ANKEFRIST_IKKE_OVERHOLDT',
    },
    {
      kode: 'ER_ANKEN_IKKE_SIGNERT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'er anken ikke signert.',
      kilde: 'ER_ANKEN_IKKE_SIGNERT',
    },
    {
      kode: 'ER_ANKER_IKKE_PART',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Angir om anker ikke er part i saken.',
      kilde: 'ER_ANKER_IKKE_PART',
    },
    {
      kode: 'ER_ANKE_IKKE_KONKRET',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er anke ikke konkret.',
      kilde: 'ER_ANKE_IKKE_KONKRET',
    },
    {
      kode: 'ER_KLAGEFRIST_OVERHOLDT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er klagefrist overholdt',
      kilde: 'ER_KLAGEFRIST_OVERHOLDT',
    },
    {
      kode: 'ER_KLAGEN_SIGNERT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er klagefrist overholdt',
      kilde: 'ER_KLAGEN_SIGNERT',
    },
    {
      kode: 'ER_KLAGER_PART',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er klagefrist overholdt',
      kilde: 'ER_KLAGER_PART',
    },
    {
      kode: 'ER_KLAGE_KONKRET',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Er klagefrist overholdt',
      kilde: 'ER_KLAGE_KONKRET',
    },
    {
      kode: 'KLAGE_OMGJØR_ÅRSAK',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Årsak til omgjøring',
      kilde: 'KLAGE_OMGJØR_ÅRSAK',
    },
    {
      kode: 'KLAGE_RESULTAT_KA',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Ytelsesvedtak',
      kilde: 'KLAGE_RESULTAT_KA',
    },
    {
      kode: 'KLAGE_RESULTAT_NFP',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Resultat',
      kilde: 'KLAGE_RESULTAT_NFP',
    },
    {
      kode: 'OVERSTYRT_VURDERING',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Overstyrt vurdering',
      kilde: 'OVERSTYRT_VURDERING',
    },
    {
      kode: 'PA_ANKET_BEHANDLINGID',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'på anket behandlingsId.',
      kilde: 'PA_ANKET_BEHANDLINGID',
    },
    {
      kode: 'PA_KLAGD_BEHANDLINGID',
      kodeverk: 'HISTORIKK_ENDRET_FELT_TYPE',
      navn: 'Påklagd behandlingId',
      kilde: 'PA_KLAGD_BEHANDLINGID',
    },
  ],
  historikkEndretFeltVerdiTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_ENDRET_FELT_VERDI_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'VILKAR_IKKE_OPPFYLT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_VERDI_TYPE',
      navn: 'Vilkåret er ikke oppfylt',
      kilde: 'VILKAR_IKKE_OPPFYLT',
    },
    {
      kode: 'VILKAR_OPPFYLT',
      kodeverk: 'HISTORIKK_ENDRET_FELT_VERDI_TYPE',
      navn: 'Vilkåret er oppfylt',
      kilde: 'VILKAR_OPPFYLT',
    },
  ],
  historikkinnslagTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'ANKEBEH_STARTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Anke mottatt',
      kilde: 'ANKEBEH_STARTET',
    },
    {
      kode: 'ANKE_BEH',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Ankebehandling',
      kilde: 'ANKE_BEH',
    },
    {
      kode: 'AVBRUTT_BEH',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandling er henlagt',
      kilde: 'AVBRUTT_BEH',
    },
    {
      kode: 'BEH_AVBRUTT_VUR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Vurdering før vedtak',
      kilde: 'BEH_AVBRUTT_VUR',
    },
    {
      kode: 'BEH_GJEN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandling gjenopptatt',
      kilde: 'BEH_GJEN',
    },
    {
      kode: 'BEH_MAN_GJEN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Gjenoppta behandling',
      kilde: 'BEH_MAN_GJEN',
    },
    {
      kode: 'BEH_STARTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandling startet',
      kilde: 'BEH_STARTET',
    },
    {
      kode: 'BEH_STARTET_PÅ_NYTT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandling startet på nytt',
      kilde: 'BEH_STARTET_PÅ_NYTT',
    },
    {
      kode: 'BEH_VENT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandling på vent',
      kilde: 'BEH_VENT',
    },
    {
      kode: 'BREV_BESTILT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Brev bestilt',
      kilde: 'BREV_BESTILT',
    },
    {
      kode: 'BREV_SENT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Brev sendt',
      kilde: 'BREV_SENT',
    },
    {
      kode: 'BYTT_ENHET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Bytt enhet',
      kilde: 'BYTT_ENHET',
    },
    {
      kode: 'FAKTA_ENDRET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Fakta endret',
      kilde: 'FAKTA_ENDRET',
    },
    {
      kode: 'FORSLAG_VEDTAK',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Vedtak foreslått og sendt til beslutter',
      kilde: 'FORSLAG_VEDTAK',
    },
    {
      kode: 'FORSLAG_VEDTAK_UTEN_TOTRINN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Vedtak foreslått',
      kilde: 'FORSLAG_VEDTAK_UTEN_TOTRINN',
    },
    {
      kode: 'IVERKSETTELSE_VENT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Behandlingen venter på iverksettelse',
      kilde: 'IVERKSETTELSE_VENT',
    },
    {
      kode: 'KLAGEBEH_STARTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Klage mottatt',
      kilde: 'KLAGEBEH_STARTET',
    },
    {
      kode: 'KLAGE_BEH_NFP',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Klagebehandling Vedtaksinstans',
      kilde: 'KLAGE_BEH_NFP',
    },
    {
      kode: 'KLAGE_BEH_NK',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Klagebehandling Klageinstans',
      kilde: 'KLAGE_BEH_NK',
    },
    {
      kode: 'KØET_BEH_GJEN',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Køet behandling er gjenopptatt',
      kilde: 'KØET_BEH_GJEN',
    },
    {
      kode: 'OVERSTYRT',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Overstyrt',
      kilde: 'OVERSTYRT',
    },
    {
      kode: 'REVURD_OPPR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Revurdering opprettet',
      kilde: 'REVURD_OPPR',
    },
    {
      kode: 'SAK_RETUR',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Sak retur',
      kilde: 'SAK_RETUR',
    },
    {
      kode: 'UENDRET_UTFALL',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Uendret utfall',
      kilde: 'UENDRET_UTFALL',
    },
    {
      kode: 'VEDTAK_FATTET',
      kodeverk: 'HISTORIKKINNSLAG_TYPE',
      navn: 'Vedtak fattet',
      kilde: 'VEDTAK_FATTET',
    },
  ],
  historikkAktører: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'ARBEIDSGIVER',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Arbeidsgiver',
      kilde: 'ARBEIDSGIVER',
    },
    {
      kode: 'BESL',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Beslutter',
      kilde: 'BESL',
    },
    {
      kode: 'SBH',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Saksbehandler',
      kilde: 'SBH',
    },
    {
      kode: 'SOKER',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Søker',
      kilde: 'SOKER',
    },
    {
      kode: 'VL',
      kodeverk: 'HISTORIKK_AKTOER',
      navn: 'Vedtaksløsningen',
      kilde: 'VL',
    },
  ],
  historikkAvklartSoeknadsperiodeTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_AVKLART_SOEKNADSPERIODE_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
  ],
  historikkResultatTyper: [
    {
      kode: '-',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'ANKE_AVVIS',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Anken er avvist',
      kilde: 'ANKE_AVVIS',
    },
    {
      kode: 'ANKE_DELVIS_OMGJOERING_TIL_GUNST',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Delvis omgjøring, til gunst i anke',
      kilde: 'ANKE_DELVIS_OMGJOERING_TIL_GUNST',
    },
    {
      kode: 'ANKE_OMGJOER',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Omgjør i anke',
      kilde: 'ANKE_OMGJOER',
    },
    {
      kode: 'ANKE_OPPHEVE_OG_HJEMSENDE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Ytelsesvedtaket oppheve og hjemsende',
      kilde: 'ANKE_OPPHEVE_OG_HJEMSENDE',
    },
    {
      kode: 'ANKE_STADFESTET_VEDTAK',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er stadfestet',
      kilde: 'ANKE_STADFESTET_VEDTAK',
    },
    {
      kode: 'ANKE_TIL_GUNST',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Til gunst omgjør i anke',
      kilde: 'ANKE_TIL_GUNST',
    },
    {
      kode: 'ANKE_TIL_UGUNST',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Ugunst omgjør i anke',
      kilde: 'ANKE_TIL_UGUNST',
    },
    {
      kode: 'AVVIS_KLAGE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Klagen er avvist',
      kilde: 'AVVIS_KLAGE',
    },
    {
      kode: 'BEREGNET_AARSINNTEKT',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Grunnlag for beregnet årsinntekt',
      kilde: 'BEREGNET_AARSINNTEKT',
    },
    {
      kode: 'DELVIS_MEDHOLD_I_KLAGE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er delvis omgjort',
      kilde: 'DELVIS_MEDHOLD_I_KLAGE',
    },
    {
      kode: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Behandling er hjemsendt',
      kilde: 'KLAGE_HJEMSENDE_UTEN_OPPHEVE',
    },
    {
      kode: 'MEDHOLD_I_KLAGE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er omgjort, til gunst',
      kilde: 'MEDHOLD_I_KLAGE',
    },
    {
      kode: 'OPPHEVE_VEDTAK',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er opphevet',
      kilde: 'OPPHEVE_VEDTAK',
    },
    {
      kode: 'OPPRETTHOLDT_VEDTAK',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er opprettholdt',
      kilde: 'OPPRETTHOLDT_VEDTAK',
    },
    {
      kode: 'OVERSTYRING_FAKTA_UTTAK',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Overstyrt vurdering:',
      kilde: 'OVERSTYRING_FAKTA_UTTAK',
    },
    {
      kode: 'STADFESTET_VEDTAK',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er stadfestet',
      kilde: 'STADFESTET_VEDTAK',
    },
    {
      kode: 'UGUNST_MEDHOLD_I_KLAGE',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Vedtaket er omgjort til ugunst',
      kilde: 'UGUNST_MEDHOLD_I_KLAGE',
    },
    {
      kode: 'UTFALL_UENDRET',
      kodeverk: 'HISTORIKK_RESULTAT_TYPE',
      navn: 'Overstyrt vurdering: Utfall er uendret',
      kilde: 'UTFALL_UENDRET',
    },
  ],
  behandlingStatuser: [
    {
      kode: 'AVSLU',
      kodeverk: 'BEHANDLING_STATUS',
      navn: 'Avsluttet',
      kilde: 'AVSLU',
    },
    {
      kode: 'FVED',
      kodeverk: 'BEHANDLING_STATUS',
      navn: 'Fatter vedtak',
      kilde: 'FVED',
    },
    {
      kode: 'IVED',
      kodeverk: 'BEHANDLING_STATUS',
      navn: 'Iverksetter vedtak',
      kilde: 'IVED',
    },
    {
      kode: 'OPPRE',
      kodeverk: 'BEHANDLING_STATUS',
      navn: 'Opprettet',
      kilde: 'OPPRE',
    },
    {
      kode: 'UTRED',
      kodeverk: 'BEHANDLING_STATUS',
      navn: 'Behandling utredes',
      kilde: 'UTRED',
    },
  ],
  vurderingsÅrsaker: [
    {
      kode: '-',
      kodeverk: 'VURDER_AARSAK',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'ANNET',
      kodeverk: 'VURDER_AARSAK',
      navn: 'Annet',
      kilde: 'ANNET',
    },
    {
      kode: 'FEIL_FAKTA',
      kodeverk: 'VURDER_AARSAK',
      navn: 'Feil fakta',
      kilde: 'FEIL_FAKTA',
    },
    {
      kode: 'FEIL_LOV',
      kodeverk: 'VURDER_AARSAK',
      navn: 'Feil lovanvendelse',
      kilde: 'FEIL_LOV',
    },
    {
      kode: 'FEIL_REGEL',
      kodeverk: 'VURDER_AARSAK',
      navn: 'Feil regelforståelse',
      kilde: 'FEIL_REGEL',
    },
  ],
  regioner: [
    {
      kode: '-',
      kodeverk: 'REGION',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'ANNET',
      kodeverk: 'REGION',
      navn: '3djelandsborger',
      kilde: 'ANNET',
    },
    {
      kode: 'EOS',
      kodeverk: 'REGION',
      navn: 'EØS',
      kilde: 'EOS',
    },
    {
      kode: 'NORDEN',
      kodeverk: 'REGION',
      navn: 'Norden',
      kilde: 'NORDEN',
    },
  ],
  landkoder: [
    {
      kode: '-',
      kodeverk: 'LANDKODER',
      navn: '-',
      kilde: {
        kode: '-',
        kodeverk: 'LANDKODER',
        navn: '-',
      },
    },
    {
      kode: '???',
      kodeverk: 'LANDKODER',
      navn: '???',
      kilde: {
        kode: '???',
        kodeverk: 'LANDKODER',
        navn: '???',
      },
    },
    {
      kode: 'ABW',
      kodeverk: 'LANDKODER',
      navn: 'ABW',
      kilde: {
        kode: 'ABW',
        kodeverk: 'LANDKODER',
        navn: 'ABW',
      },
    },
    {
      kode: 'AFG',
      kodeverk: 'LANDKODER',
      navn: 'AFG',
      kilde: {
        kode: 'AFG',
        kodeverk: 'LANDKODER',
        navn: 'AFG',
      },
    },
    {
      kode: 'AGO',
      kodeverk: 'LANDKODER',
      navn: 'AGO',
      kilde: {
        kode: 'AGO',
        kodeverk: 'LANDKODER',
        navn: 'AGO',
      },
    },
    {
      kode: 'AIA',
      kodeverk: 'LANDKODER',
      navn: 'AIA',
      kilde: {
        kode: 'AIA',
        kodeverk: 'LANDKODER',
        navn: 'AIA',
      },
    },
    {
      kode: 'ALA',
      kodeverk: 'LANDKODER',
      navn: 'ALA',
      kilde: {
        kode: 'ALA',
        kodeverk: 'LANDKODER',
        navn: 'ALA',
      },
    },
    {
      kode: 'ALB',
      kodeverk: 'LANDKODER',
      navn: 'ALB',
      kilde: {
        kode: 'ALB',
        kodeverk: 'LANDKODER',
        navn: 'ALB',
      },
    },
    {
      kode: 'AND',
      kodeverk: 'LANDKODER',
      navn: 'AND',
      kilde: {
        kode: 'AND',
        kodeverk: 'LANDKODER',
        navn: 'AND',
      },
    },
    {
      kode: 'ANT',
      kodeverk: 'LANDKODER',
      navn: 'ANT',
      kilde: {
        kode: 'ANT',
        kodeverk: 'LANDKODER',
        navn: 'ANT',
      },
    },
    {
      kode: 'ARE',
      kodeverk: 'LANDKODER',
      navn: 'ARE',
      kilde: {
        kode: 'ARE',
        kodeverk: 'LANDKODER',
        navn: 'ARE',
      },
    },
    {
      kode: 'ARG',
      kodeverk: 'LANDKODER',
      navn: 'ARG',
      kilde: {
        kode: 'ARG',
        kodeverk: 'LANDKODER',
        navn: 'ARG',
      },
    },
    {
      kode: 'ARM',
      kodeverk: 'LANDKODER',
      navn: 'ARM',
      kilde: {
        kode: 'ARM',
        kodeverk: 'LANDKODER',
        navn: 'ARM',
      },
    },
    {
      kode: 'ASM',
      kodeverk: 'LANDKODER',
      navn: 'ASM',
      kilde: {
        kode: 'ASM',
        kodeverk: 'LANDKODER',
        navn: 'ASM',
      },
    },
    {
      kode: 'ATA',
      kodeverk: 'LANDKODER',
      navn: 'ATA',
      kilde: {
        kode: 'ATA',
        kodeverk: 'LANDKODER',
        navn: 'ATA',
      },
    },
    {
      kode: 'ATF',
      kodeverk: 'LANDKODER',
      navn: 'ATF',
      kilde: {
        kode: 'ATF',
        kodeverk: 'LANDKODER',
        navn: 'ATF',
      },
    },
    {
      kode: 'ATG',
      kodeverk: 'LANDKODER',
      navn: 'ATG',
      kilde: {
        kode: 'ATG',
        kodeverk: 'LANDKODER',
        navn: 'ATG',
      },
    },
    {
      kode: 'AUS',
      kodeverk: 'LANDKODER',
      navn: 'AUS',
      kilde: {
        kode: 'AUS',
        kodeverk: 'LANDKODER',
        navn: 'AUS',
      },
    },
    {
      kode: 'AUT',
      kodeverk: 'LANDKODER',
      navn: 'AUT',
      kilde: {
        kode: 'AUT',
        kodeverk: 'LANDKODER',
        navn: 'AUT',
      },
    },
    {
      kode: 'AZE',
      kodeverk: 'LANDKODER',
      navn: 'AZE',
      kilde: {
        kode: 'AZE',
        kodeverk: 'LANDKODER',
        navn: 'AZE',
      },
    },
    {
      kode: 'BDI',
      kodeverk: 'LANDKODER',
      navn: 'BDI',
      kilde: {
        kode: 'BDI',
        kodeverk: 'LANDKODER',
        navn: 'BDI',
      },
    },
    {
      kode: 'BEL',
      kodeverk: 'LANDKODER',
      navn: 'BEL',
      kilde: {
        kode: 'BEL',
        kodeverk: 'LANDKODER',
        navn: 'BEL',
      },
    },
    {
      kode: 'BEN',
      kodeverk: 'LANDKODER',
      navn: 'BEN',
      kilde: {
        kode: 'BEN',
        kodeverk: 'LANDKODER',
        navn: 'BEN',
      },
    },
    {
      kode: 'BES',
      kodeverk: 'LANDKODER',
      navn: 'BES',
      kilde: {
        kode: 'BES',
        kodeverk: 'LANDKODER',
        navn: 'BES',
      },
    },
    {
      kode: 'BFA',
      kodeverk: 'LANDKODER',
      navn: 'BFA',
      kilde: {
        kode: 'BFA',
        kodeverk: 'LANDKODER',
        navn: 'BFA',
      },
    },
    {
      kode: 'BGD',
      kodeverk: 'LANDKODER',
      navn: 'BGD',
      kilde: {
        kode: 'BGD',
        kodeverk: 'LANDKODER',
        navn: 'BGD',
      },
    },
    {
      kode: 'BGR',
      kodeverk: 'LANDKODER',
      navn: 'BGR',
      kilde: {
        kode: 'BGR',
        kodeverk: 'LANDKODER',
        navn: 'BGR',
      },
    },
    {
      kode: 'BHR',
      kodeverk: 'LANDKODER',
      navn: 'BHR',
      kilde: {
        kode: 'BHR',
        kodeverk: 'LANDKODER',
        navn: 'BHR',
      },
    },
    {
      kode: 'BHS',
      kodeverk: 'LANDKODER',
      navn: 'BHS',
      kilde: {
        kode: 'BHS',
        kodeverk: 'LANDKODER',
        navn: 'BHS',
      },
    },
    {
      kode: 'BIH',
      kodeverk: 'LANDKODER',
      navn: 'BIH',
      kilde: {
        kode: 'BIH',
        kodeverk: 'LANDKODER',
        navn: 'BIH',
      },
    },
    {
      kode: 'BLM',
      kodeverk: 'LANDKODER',
      navn: 'BLM',
      kilde: {
        kode: 'BLM',
        kodeverk: 'LANDKODER',
        navn: 'BLM',
      },
    },
    {
      kode: 'BLR',
      kodeverk: 'LANDKODER',
      navn: 'BLR',
      kilde: {
        kode: 'BLR',
        kodeverk: 'LANDKODER',
        navn: 'BLR',
      },
    },
    {
      kode: 'BLZ',
      kodeverk: 'LANDKODER',
      navn: 'BLZ',
      kilde: {
        kode: 'BLZ',
        kodeverk: 'LANDKODER',
        navn: 'BLZ',
      },
    },
    {
      kode: 'BMU',
      kodeverk: 'LANDKODER',
      navn: 'BMU',
      kilde: {
        kode: 'BMU',
        kodeverk: 'LANDKODER',
        navn: 'BMU',
      },
    },
    {
      kode: 'BOL',
      kodeverk: 'LANDKODER',
      navn: 'BOL',
      kilde: {
        kode: 'BOL',
        kodeverk: 'LANDKODER',
        navn: 'BOL',
      },
    },
    {
      kode: 'BRA',
      kodeverk: 'LANDKODER',
      navn: 'BRA',
      kilde: {
        kode: 'BRA',
        kodeverk: 'LANDKODER',
        navn: 'BRA',
      },
    },
    {
      kode: 'BRB',
      kodeverk: 'LANDKODER',
      navn: 'BRB',
      kilde: {
        kode: 'BRB',
        kodeverk: 'LANDKODER',
        navn: 'BRB',
      },
    },
    {
      kode: 'BRN',
      kodeverk: 'LANDKODER',
      navn: 'BRN',
      kilde: {
        kode: 'BRN',
        kodeverk: 'LANDKODER',
        navn: 'BRN',
      },
    },
    {
      kode: 'BTN',
      kodeverk: 'LANDKODER',
      navn: 'BTN',
      kilde: {
        kode: 'BTN',
        kodeverk: 'LANDKODER',
        navn: 'BTN',
      },
    },
    {
      kode: 'BUR',
      kodeverk: 'LANDKODER',
      navn: 'BUR',
      kilde: {
        kode: 'BUR',
        kodeverk: 'LANDKODER',
        navn: 'BUR',
      },
    },
    {
      kode: 'BVT',
      kodeverk: 'LANDKODER',
      navn: 'BVT',
      kilde: {
        kode: 'BVT',
        kodeverk: 'LANDKODER',
        navn: 'BVT',
      },
    },
    {
      kode: 'BWA',
      kodeverk: 'LANDKODER',
      navn: 'BWA',
      kilde: {
        kode: 'BWA',
        kodeverk: 'LANDKODER',
        navn: 'BWA',
      },
    },
    {
      kode: 'BYS',
      kodeverk: 'LANDKODER',
      navn: 'BYS',
      kilde: {
        kode: 'BYS',
        kodeverk: 'LANDKODER',
        navn: 'BYS',
      },
    },
    {
      kode: 'CAF',
      kodeverk: 'LANDKODER',
      navn: 'CAF',
      kilde: {
        kode: 'CAF',
        kodeverk: 'LANDKODER',
        navn: 'CAF',
      },
    },
    {
      kode: 'CAN',
      kodeverk: 'LANDKODER',
      navn: 'CAN',
      kilde: {
        kode: 'CAN',
        kodeverk: 'LANDKODER',
        navn: 'CAN',
      },
    },
    {
      kode: 'CCK',
      kodeverk: 'LANDKODER',
      navn: 'CCK',
      kilde: {
        kode: 'CCK',
        kodeverk: 'LANDKODER',
        navn: 'CCK',
      },
    },
    {
      kode: 'CHE',
      kodeverk: 'LANDKODER',
      navn: 'CHE',
      kilde: {
        kode: 'CHE',
        kodeverk: 'LANDKODER',
        navn: 'CHE',
      },
    },
    {
      kode: 'CHL',
      kodeverk: 'LANDKODER',
      navn: 'CHL',
      kilde: {
        kode: 'CHL',
        kodeverk: 'LANDKODER',
        navn: 'CHL',
      },
    },
    {
      kode: 'CHN',
      kodeverk: 'LANDKODER',
      navn: 'CHN',
      kilde: {
        kode: 'CHN',
        kodeverk: 'LANDKODER',
        navn: 'CHN',
      },
    },
    {
      kode: 'CIV',
      kodeverk: 'LANDKODER',
      navn: 'CIV',
      kilde: {
        kode: 'CIV',
        kodeverk: 'LANDKODER',
        navn: 'CIV',
      },
    },
    {
      kode: 'CMR',
      kodeverk: 'LANDKODER',
      navn: 'CMR',
      kilde: {
        kode: 'CMR',
        kodeverk: 'LANDKODER',
        navn: 'CMR',
      },
    },
    {
      kode: 'COD',
      kodeverk: 'LANDKODER',
      navn: 'COD',
      kilde: {
        kode: 'COD',
        kodeverk: 'LANDKODER',
        navn: 'COD',
      },
    },
    {
      kode: 'COG',
      kodeverk: 'LANDKODER',
      navn: 'COG',
      kilde: {
        kode: 'COG',
        kodeverk: 'LANDKODER',
        navn: 'COG',
      },
    },
    {
      kode: 'COK',
      kodeverk: 'LANDKODER',
      navn: 'COK',
      kilde: {
        kode: 'COK',
        kodeverk: 'LANDKODER',
        navn: 'COK',
      },
    },
    {
      kode: 'COL',
      kodeverk: 'LANDKODER',
      navn: 'COL',
      kilde: {
        kode: 'COL',
        kodeverk: 'LANDKODER',
        navn: 'COL',
      },
    },
    {
      kode: 'COM',
      kodeverk: 'LANDKODER',
      navn: 'COM',
      kilde: {
        kode: 'COM',
        kodeverk: 'LANDKODER',
        navn: 'COM',
      },
    },
    {
      kode: 'CPV',
      kodeverk: 'LANDKODER',
      navn: 'CPV',
      kilde: {
        kode: 'CPV',
        kodeverk: 'LANDKODER',
        navn: 'CPV',
      },
    },
    {
      kode: 'CRI',
      kodeverk: 'LANDKODER',
      navn: 'CRI',
      kilde: {
        kode: 'CRI',
        kodeverk: 'LANDKODER',
        navn: 'CRI',
      },
    },
    {
      kode: 'CSK',
      kodeverk: 'LANDKODER',
      navn: 'CSK',
      kilde: {
        kode: 'CSK',
        kodeverk: 'LANDKODER',
        navn: 'CSK',
      },
    },
    {
      kode: 'CUB',
      kodeverk: 'LANDKODER',
      navn: 'CUB',
      kilde: {
        kode: 'CUB',
        kodeverk: 'LANDKODER',
        navn: 'CUB',
      },
    },
    {
      kode: 'CUW',
      kodeverk: 'LANDKODER',
      navn: 'CUW',
      kilde: {
        kode: 'CUW',
        kodeverk: 'LANDKODER',
        navn: 'CUW',
      },
    },
    {
      kode: 'CXR',
      kodeverk: 'LANDKODER',
      navn: 'CXR',
      kilde: {
        kode: 'CXR',
        kodeverk: 'LANDKODER',
        navn: 'CXR',
      },
    },
    {
      kode: 'CYM',
      kodeverk: 'LANDKODER',
      navn: 'CYM',
      kilde: {
        kode: 'CYM',
        kodeverk: 'LANDKODER',
        navn: 'CYM',
      },
    },
    {
      kode: 'CYP',
      kodeverk: 'LANDKODER',
      navn: 'CYP',
      kilde: {
        kode: 'CYP',
        kodeverk: 'LANDKODER',
        navn: 'CYP',
      },
    },
    {
      kode: 'CZE',
      kodeverk: 'LANDKODER',
      navn: 'CZE',
      kilde: {
        kode: 'CZE',
        kodeverk: 'LANDKODER',
        navn: 'CZE',
      },
    },
    {
      kode: 'DEU',
      kodeverk: 'LANDKODER',
      navn: 'DEU',
      kilde: {
        kode: 'DEU',
        kodeverk: 'LANDKODER',
        navn: 'DEU',
      },
    },
    {
      kode: 'DJI',
      kodeverk: 'LANDKODER',
      navn: 'DJI',
      kilde: {
        kode: 'DJI',
        kodeverk: 'LANDKODER',
        navn: 'DJI',
      },
    },
    {
      kode: 'DMA',
      kodeverk: 'LANDKODER',
      navn: 'DMA',
      kilde: {
        kode: 'DMA',
        kodeverk: 'LANDKODER',
        navn: 'DMA',
      },
    },
    {
      kode: 'DNK',
      kodeverk: 'LANDKODER',
      navn: 'DNK',
      kilde: {
        kode: 'DNK',
        kodeverk: 'LANDKODER',
        navn: 'DNK',
      },
    },
    {
      kode: 'DOM',
      kodeverk: 'LANDKODER',
      navn: 'DOM',
      kilde: {
        kode: 'DOM',
        kodeverk: 'LANDKODER',
        navn: 'DOM',
      },
    },
    {
      kode: 'DZA',
      kodeverk: 'LANDKODER',
      navn: 'DZA',
      kilde: {
        kode: 'DZA',
        kodeverk: 'LANDKODER',
        navn: 'DZA',
      },
    },
    {
      kode: 'ECU',
      kodeverk: 'LANDKODER',
      navn: 'ECU',
      kilde: {
        kode: 'ECU',
        kodeverk: 'LANDKODER',
        navn: 'ECU',
      },
    },
    {
      kode: 'EGY',
      kodeverk: 'LANDKODER',
      navn: 'EGY',
      kilde: {
        kode: 'EGY',
        kodeverk: 'LANDKODER',
        navn: 'EGY',
      },
    },
    {
      kode: 'ERI',
      kodeverk: 'LANDKODER',
      navn: 'ERI',
      kilde: {
        kode: 'ERI',
        kodeverk: 'LANDKODER',
        navn: 'ERI',
      },
    },
    {
      kode: 'ESH',
      kodeverk: 'LANDKODER',
      navn: 'ESH',
      kilde: {
        kode: 'ESH',
        kodeverk: 'LANDKODER',
        navn: 'ESH',
      },
    },
    {
      kode: 'ESP',
      kodeverk: 'LANDKODER',
      navn: 'ESP',
      kilde: {
        kode: 'ESP',
        kodeverk: 'LANDKODER',
        navn: 'ESP',
      },
    },
    {
      kode: 'EST',
      kodeverk: 'LANDKODER',
      navn: 'EST',
      kilde: {
        kode: 'EST',
        kodeverk: 'LANDKODER',
        navn: 'EST',
      },
    },
    {
      kode: 'ETH',
      kodeverk: 'LANDKODER',
      navn: 'ETH',
      kilde: {
        kode: 'ETH',
        kodeverk: 'LANDKODER',
        navn: 'ETH',
      },
    },
    {
      kode: 'FIN',
      kodeverk: 'LANDKODER',
      navn: 'FIN',
      kilde: {
        kode: 'FIN',
        kodeverk: 'LANDKODER',
        navn: 'FIN',
      },
    },
    {
      kode: 'FJI',
      kodeverk: 'LANDKODER',
      navn: 'FJI',
      kilde: {
        kode: 'FJI',
        kodeverk: 'LANDKODER',
        navn: 'FJI',
      },
    },
    {
      kode: 'FLK',
      kodeverk: 'LANDKODER',
      navn: 'FLK',
      kilde: {
        kode: 'FLK',
        kodeverk: 'LANDKODER',
        navn: 'FLK',
      },
    },
    {
      kode: 'FRA',
      kodeverk: 'LANDKODER',
      navn: 'FRA',
      kilde: {
        kode: 'FRA',
        kodeverk: 'LANDKODER',
        navn: 'FRA',
      },
    },
    {
      kode: 'FRO',
      kodeverk: 'LANDKODER',
      navn: 'FRO',
      kilde: {
        kode: 'FRO',
        kodeverk: 'LANDKODER',
        navn: 'FRO',
      },
    },
    {
      kode: 'FSM',
      kodeverk: 'LANDKODER',
      navn: 'FSM',
      kilde: {
        kode: 'FSM',
        kodeverk: 'LANDKODER',
        navn: 'FSM',
      },
    },
    {
      kode: 'GAB',
      kodeverk: 'LANDKODER',
      navn: 'GAB',
      kilde: {
        kode: 'GAB',
        kodeverk: 'LANDKODER',
        navn: 'GAB',
      },
    },
    {
      kode: 'GBR',
      kodeverk: 'LANDKODER',
      navn: 'GBR',
      kilde: {
        kode: 'GBR',
        kodeverk: 'LANDKODER',
        navn: 'GBR',
      },
    },
    {
      kode: 'GEO',
      kodeverk: 'LANDKODER',
      navn: 'GEO',
      kilde: {
        kode: 'GEO',
        kodeverk: 'LANDKODER',
        navn: 'GEO',
      },
    },
    {
      kode: 'GGY',
      kodeverk: 'LANDKODER',
      navn: 'GGY',
      kilde: {
        kode: 'GGY',
        kodeverk: 'LANDKODER',
        navn: 'GGY',
      },
    },
    {
      kode: 'GHA',
      kodeverk: 'LANDKODER',
      navn: 'GHA',
      kilde: {
        kode: 'GHA',
        kodeverk: 'LANDKODER',
        navn: 'GHA',
      },
    },
    {
      kode: 'GIB',
      kodeverk: 'LANDKODER',
      navn: 'GIB',
      kilde: {
        kode: 'GIB',
        kodeverk: 'LANDKODER',
        navn: 'GIB',
      },
    },
    {
      kode: 'GIN',
      kodeverk: 'LANDKODER',
      navn: 'GIN',
      kilde: {
        kode: 'GIN',
        kodeverk: 'LANDKODER',
        navn: 'GIN',
      },
    },
    {
      kode: 'GLP',
      kodeverk: 'LANDKODER',
      navn: 'GLP',
      kilde: {
        kode: 'GLP',
        kodeverk: 'LANDKODER',
        navn: 'GLP',
      },
    },
    {
      kode: 'GMB',
      kodeverk: 'LANDKODER',
      navn: 'GMB',
      kilde: {
        kode: 'GMB',
        kodeverk: 'LANDKODER',
        navn: 'GMB',
      },
    },
    {
      kode: 'GNB',
      kodeverk: 'LANDKODER',
      navn: 'GNB',
      kilde: {
        kode: 'GNB',
        kodeverk: 'LANDKODER',
        navn: 'GNB',
      },
    },
    {
      kode: 'GNQ',
      kodeverk: 'LANDKODER',
      navn: 'GNQ',
      kilde: {
        kode: 'GNQ',
        kodeverk: 'LANDKODER',
        navn: 'GNQ',
      },
    },
    {
      kode: 'GRC',
      kodeverk: 'LANDKODER',
      navn: 'GRC',
      kilde: {
        kode: 'GRC',
        kodeverk: 'LANDKODER',
        navn: 'GRC',
      },
    },
    {
      kode: 'GRD',
      kodeverk: 'LANDKODER',
      navn: 'GRD',
      kilde: {
        kode: 'GRD',
        kodeverk: 'LANDKODER',
        navn: 'GRD',
      },
    },
    {
      kode: 'GRL',
      kodeverk: 'LANDKODER',
      navn: 'GRL',
      kilde: {
        kode: 'GRL',
        kodeverk: 'LANDKODER',
        navn: 'GRL',
      },
    },
    {
      kode: 'GTM',
      kodeverk: 'LANDKODER',
      navn: 'GTM',
      kilde: {
        kode: 'GTM',
        kodeverk: 'LANDKODER',
        navn: 'GTM',
      },
    },
    {
      kode: 'GUF',
      kodeverk: 'LANDKODER',
      navn: 'GUF',
      kilde: {
        kode: 'GUF',
        kodeverk: 'LANDKODER',
        navn: 'GUF',
      },
    },
    {
      kode: 'GUM',
      kodeverk: 'LANDKODER',
      navn: 'GUM',
      kilde: {
        kode: 'GUM',
        kodeverk: 'LANDKODER',
        navn: 'GUM',
      },
    },
    {
      kode: 'GUY',
      kodeverk: 'LANDKODER',
      navn: 'GUY',
      kilde: {
        kode: 'GUY',
        kodeverk: 'LANDKODER',
        navn: 'GUY',
      },
    },
    {
      kode: 'HKG',
      kodeverk: 'LANDKODER',
      navn: 'HKG',
      kilde: {
        kode: 'HKG',
        kodeverk: 'LANDKODER',
        navn: 'HKG',
      },
    },
    {
      kode: 'HMD',
      kodeverk: 'LANDKODER',
      navn: 'HMD',
      kilde: {
        kode: 'HMD',
        kodeverk: 'LANDKODER',
        navn: 'HMD',
      },
    },
    {
      kode: 'HND',
      kodeverk: 'LANDKODER',
      navn: 'HND',
      kilde: {
        kode: 'HND',
        kodeverk: 'LANDKODER',
        navn: 'HND',
      },
    },
    {
      kode: 'HRV',
      kodeverk: 'LANDKODER',
      navn: 'HRV',
      kilde: {
        kode: 'HRV',
        kodeverk: 'LANDKODER',
        navn: 'HRV',
      },
    },
    {
      kode: 'HTI',
      kodeverk: 'LANDKODER',
      navn: 'HTI',
      kilde: {
        kode: 'HTI',
        kodeverk: 'LANDKODER',
        navn: 'HTI',
      },
    },
    {
      kode: 'HUN',
      kodeverk: 'LANDKODER',
      navn: 'HUN',
      kilde: {
        kode: 'HUN',
        kodeverk: 'LANDKODER',
        navn: 'HUN',
      },
    },
    {
      kode: 'IDN',
      kodeverk: 'LANDKODER',
      navn: 'IDN',
      kilde: {
        kode: 'IDN',
        kodeverk: 'LANDKODER',
        navn: 'IDN',
      },
    },
    {
      kode: 'IMN',
      kodeverk: 'LANDKODER',
      navn: 'IMN',
      kilde: {
        kode: 'IMN',
        kodeverk: 'LANDKODER',
        navn: 'IMN',
      },
    },
    {
      kode: 'IND',
      kodeverk: 'LANDKODER',
      navn: 'IND',
      kilde: {
        kode: 'IND',
        kodeverk: 'LANDKODER',
        navn: 'IND',
      },
    },
    {
      kode: 'IOT',
      kodeverk: 'LANDKODER',
      navn: 'IOT',
      kilde: {
        kode: 'IOT',
        kodeverk: 'LANDKODER',
        navn: 'IOT',
      },
    },
    {
      kode: 'IRL',
      kodeverk: 'LANDKODER',
      navn: 'IRL',
      kilde: {
        kode: 'IRL',
        kodeverk: 'LANDKODER',
        navn: 'IRL',
      },
    },
    {
      kode: 'IRN',
      kodeverk: 'LANDKODER',
      navn: 'IRN',
      kilde: {
        kode: 'IRN',
        kodeverk: 'LANDKODER',
        navn: 'IRN',
      },
    },
    {
      kode: 'IRQ',
      kodeverk: 'LANDKODER',
      navn: 'IRQ',
      kilde: {
        kode: 'IRQ',
        kodeverk: 'LANDKODER',
        navn: 'IRQ',
      },
    },
    {
      kode: 'ISL',
      kodeverk: 'LANDKODER',
      navn: 'ISL',
      kilde: {
        kode: 'ISL',
        kodeverk: 'LANDKODER',
        navn: 'ISL',
      },
    },
    {
      kode: 'ISR',
      kodeverk: 'LANDKODER',
      navn: 'ISR',
      kilde: {
        kode: 'ISR',
        kodeverk: 'LANDKODER',
        navn: 'ISR',
      },
    },
    {
      kode: 'ITA',
      kodeverk: 'LANDKODER',
      navn: 'ITA',
      kilde: {
        kode: 'ITA',
        kodeverk: 'LANDKODER',
        navn: 'ITA',
      },
    },
    {
      kode: 'JAM',
      kodeverk: 'LANDKODER',
      navn: 'JAM',
      kilde: {
        kode: 'JAM',
        kodeverk: 'LANDKODER',
        navn: 'JAM',
      },
    },
    {
      kode: 'JEY',
      kodeverk: 'LANDKODER',
      navn: 'JEY',
      kilde: {
        kode: 'JEY',
        kodeverk: 'LANDKODER',
        navn: 'JEY',
      },
    },
    {
      kode: 'JOR',
      kodeverk: 'LANDKODER',
      navn: 'JOR',
      kilde: {
        kode: 'JOR',
        kodeverk: 'LANDKODER',
        navn: 'JOR',
      },
    },
    {
      kode: 'JPN',
      kodeverk: 'LANDKODER',
      navn: 'JPN',
      kilde: {
        kode: 'JPN',
        kodeverk: 'LANDKODER',
        navn: 'JPN',
      },
    },
    {
      kode: 'KAZ',
      kodeverk: 'LANDKODER',
      navn: 'KAZ',
      kilde: {
        kode: 'KAZ',
        kodeverk: 'LANDKODER',
        navn: 'KAZ',
      },
    },
    {
      kode: 'KEN',
      kodeverk: 'LANDKODER',
      navn: 'KEN',
      kilde: {
        kode: 'KEN',
        kodeverk: 'LANDKODER',
        navn: 'KEN',
      },
    },
    {
      kode: 'KGZ',
      kodeverk: 'LANDKODER',
      navn: 'KGZ',
      kilde: {
        kode: 'KGZ',
        kodeverk: 'LANDKODER',
        navn: 'KGZ',
      },
    },
    {
      kode: 'KHM',
      kodeverk: 'LANDKODER',
      navn: 'KHM',
      kilde: {
        kode: 'KHM',
        kodeverk: 'LANDKODER',
        navn: 'KHM',
      },
    },
    {
      kode: 'KIR',
      kodeverk: 'LANDKODER',
      navn: 'KIR',
      kilde: {
        kode: 'KIR',
        kodeverk: 'LANDKODER',
        navn: 'KIR',
      },
    },
    {
      kode: 'KNA',
      kodeverk: 'LANDKODER',
      navn: 'KNA',
      kilde: {
        kode: 'KNA',
        kodeverk: 'LANDKODER',
        navn: 'KNA',
      },
    },
    {
      kode: 'KOR',
      kodeverk: 'LANDKODER',
      navn: 'KOR',
      kilde: {
        kode: 'KOR',
        kodeverk: 'LANDKODER',
        navn: 'KOR',
      },
    },
    {
      kode: 'KWT',
      kodeverk: 'LANDKODER',
      navn: 'KWT',
      kilde: {
        kode: 'KWT',
        kodeverk: 'LANDKODER',
        navn: 'KWT',
      },
    },
    {
      kode: 'LAO',
      kodeverk: 'LANDKODER',
      navn: 'LAO',
      kilde: {
        kode: 'LAO',
        kodeverk: 'LANDKODER',
        navn: 'LAO',
      },
    },
    {
      kode: 'LBN',
      kodeverk: 'LANDKODER',
      navn: 'LBN',
      kilde: {
        kode: 'LBN',
        kodeverk: 'LANDKODER',
        navn: 'LBN',
      },
    },
    {
      kode: 'LBR',
      kodeverk: 'LANDKODER',
      navn: 'LBR',
      kilde: {
        kode: 'LBR',
        kodeverk: 'LANDKODER',
        navn: 'LBR',
      },
    },
    {
      kode: 'LBY',
      kodeverk: 'LANDKODER',
      navn: 'LBY',
      kilde: {
        kode: 'LBY',
        kodeverk: 'LANDKODER',
        navn: 'LBY',
      },
    },
    {
      kode: 'LCA',
      kodeverk: 'LANDKODER',
      navn: 'LCA',
      kilde: {
        kode: 'LCA',
        kodeverk: 'LANDKODER',
        navn: 'LCA',
      },
    },
    {
      kode: 'LIE',
      kodeverk: 'LANDKODER',
      navn: 'LIE',
      kilde: {
        kode: 'LIE',
        kodeverk: 'LANDKODER',
        navn: 'LIE',
      },
    },
    {
      kode: 'LKA',
      kodeverk: 'LANDKODER',
      navn: 'LKA',
      kilde: {
        kode: 'LKA',
        kodeverk: 'LANDKODER',
        navn: 'LKA',
      },
    },
    {
      kode: 'LSO',
      kodeverk: 'LANDKODER',
      navn: 'LSO',
      kilde: {
        kode: 'LSO',
        kodeverk: 'LANDKODER',
        navn: 'LSO',
      },
    },
    {
      kode: 'LTU',
      kodeverk: 'LANDKODER',
      navn: 'LTU',
      kilde: {
        kode: 'LTU',
        kodeverk: 'LANDKODER',
        navn: 'LTU',
      },
    },
    {
      kode: 'LUX',
      kodeverk: 'LANDKODER',
      navn: 'LUX',
      kilde: {
        kode: 'LUX',
        kodeverk: 'LANDKODER',
        navn: 'LUX',
      },
    },
    {
      kode: 'LVA',
      kodeverk: 'LANDKODER',
      navn: 'LVA',
      kilde: {
        kode: 'LVA',
        kodeverk: 'LANDKODER',
        navn: 'LVA',
      },
    },
    {
      kode: 'MAC',
      kodeverk: 'LANDKODER',
      navn: 'MAC',
      kilde: {
        kode: 'MAC',
        kodeverk: 'LANDKODER',
        navn: 'MAC',
      },
    },
    {
      kode: 'MAF',
      kodeverk: 'LANDKODER',
      navn: 'MAF',
      kilde: {
        kode: 'MAF',
        kodeverk: 'LANDKODER',
        navn: 'MAF',
      },
    },
    {
      kode: 'MAR',
      kodeverk: 'LANDKODER',
      navn: 'MAR',
      kilde: {
        kode: 'MAR',
        kodeverk: 'LANDKODER',
        navn: 'MAR',
      },
    },
    {
      kode: 'MCO',
      kodeverk: 'LANDKODER',
      navn: 'MCO',
      kilde: {
        kode: 'MCO',
        kodeverk: 'LANDKODER',
        navn: 'MCO',
      },
    },
    {
      kode: 'MDA',
      kodeverk: 'LANDKODER',
      navn: 'MDA',
      kilde: {
        kode: 'MDA',
        kodeverk: 'LANDKODER',
        navn: 'MDA',
      },
    },
    {
      kode: 'MDG',
      kodeverk: 'LANDKODER',
      navn: 'MDG',
      kilde: {
        kode: 'MDG',
        kodeverk: 'LANDKODER',
        navn: 'MDG',
      },
    },
    {
      kode: 'MDV',
      kodeverk: 'LANDKODER',
      navn: 'MDV',
      kilde: {
        kode: 'MDV',
        kodeverk: 'LANDKODER',
        navn: 'MDV',
      },
    },
    {
      kode: 'MEX',
      kodeverk: 'LANDKODER',
      navn: 'MEX',
      kilde: {
        kode: 'MEX',
        kodeverk: 'LANDKODER',
        navn: 'MEX',
      },
    },
    {
      kode: 'MHL',
      kodeverk: 'LANDKODER',
      navn: 'MHL',
      kilde: {
        kode: 'MHL',
        kodeverk: 'LANDKODER',
        navn: 'MHL',
      },
    },
    {
      kode: 'MKD',
      kodeverk: 'LANDKODER',
      navn: 'MKD',
      kilde: {
        kode: 'MKD',
        kodeverk: 'LANDKODER',
        navn: 'MKD',
      },
    },
    {
      kode: 'MLI',
      kodeverk: 'LANDKODER',
      navn: 'MLI',
      kilde: {
        kode: 'MLI',
        kodeverk: 'LANDKODER',
        navn: 'MLI',
      },
    },
    {
      kode: 'MLT',
      kodeverk: 'LANDKODER',
      navn: 'MLT',
      kilde: {
        kode: 'MLT',
        kodeverk: 'LANDKODER',
        navn: 'MLT',
      },
    },
    {
      kode: 'MMR',
      kodeverk: 'LANDKODER',
      navn: 'MMR',
      kilde: {
        kode: 'MMR',
        kodeverk: 'LANDKODER',
        navn: 'MMR',
      },
    },
    {
      kode: 'MNE',
      kodeverk: 'LANDKODER',
      navn: 'MNE',
      kilde: {
        kode: 'MNE',
        kodeverk: 'LANDKODER',
        navn: 'MNE',
      },
    },
    {
      kode: 'MNG',
      kodeverk: 'LANDKODER',
      navn: 'MNG',
      kilde: {
        kode: 'MNG',
        kodeverk: 'LANDKODER',
        navn: 'MNG',
      },
    },
    {
      kode: 'MNP',
      kodeverk: 'LANDKODER',
      navn: 'MNP',
      kilde: {
        kode: 'MNP',
        kodeverk: 'LANDKODER',
        navn: 'MNP',
      },
    },
    {
      kode: 'MOZ',
      kodeverk: 'LANDKODER',
      navn: 'MOZ',
      kilde: {
        kode: 'MOZ',
        kodeverk: 'LANDKODER',
        navn: 'MOZ',
      },
    },
    {
      kode: 'MRT',
      kodeverk: 'LANDKODER',
      navn: 'MRT',
      kilde: {
        kode: 'MRT',
        kodeverk: 'LANDKODER',
        navn: 'MRT',
      },
    },
    {
      kode: 'MSR',
      kodeverk: 'LANDKODER',
      navn: 'MSR',
      kilde: {
        kode: 'MSR',
        kodeverk: 'LANDKODER',
        navn: 'MSR',
      },
    },
    {
      kode: 'MTQ',
      kodeverk: 'LANDKODER',
      navn: 'MTQ',
      kilde: {
        kode: 'MTQ',
        kodeverk: 'LANDKODER',
        navn: 'MTQ',
      },
    },
    {
      kode: 'MUS',
      kodeverk: 'LANDKODER',
      navn: 'MUS',
      kilde: {
        kode: 'MUS',
        kodeverk: 'LANDKODER',
        navn: 'MUS',
      },
    },
    {
      kode: 'MWI',
      kodeverk: 'LANDKODER',
      navn: 'MWI',
      kilde: {
        kode: 'MWI',
        kodeverk: 'LANDKODER',
        navn: 'MWI',
      },
    },
    {
      kode: 'MYS',
      kodeverk: 'LANDKODER',
      navn: 'MYS',
      kilde: {
        kode: 'MYS',
        kodeverk: 'LANDKODER',
        navn: 'MYS',
      },
    },
    {
      kode: 'MYT',
      kodeverk: 'LANDKODER',
      navn: 'MYT',
      kilde: {
        kode: 'MYT',
        kodeverk: 'LANDKODER',
        navn: 'MYT',
      },
    },
    {
      kode: 'NAM',
      kodeverk: 'LANDKODER',
      navn: 'NAM',
      kilde: {
        kode: 'NAM',
        kodeverk: 'LANDKODER',
        navn: 'NAM',
      },
    },
    {
      kode: 'NCL',
      kodeverk: 'LANDKODER',
      navn: 'NCL',
      kilde: {
        kode: 'NCL',
        kodeverk: 'LANDKODER',
        navn: 'NCL',
      },
    },
    {
      kode: 'NER',
      kodeverk: 'LANDKODER',
      navn: 'NER',
      kilde: {
        kode: 'NER',
        kodeverk: 'LANDKODER',
        navn: 'NER',
      },
    },
    {
      kode: 'NFK',
      kodeverk: 'LANDKODER',
      navn: 'NFK',
      kilde: {
        kode: 'NFK',
        kodeverk: 'LANDKODER',
        navn: 'NFK',
      },
    },
    {
      kode: 'NGA',
      kodeverk: 'LANDKODER',
      navn: 'NGA',
      kilde: {
        kode: 'NGA',
        kodeverk: 'LANDKODER',
        navn: 'NGA',
      },
    },
    {
      kode: 'NIC',
      kodeverk: 'LANDKODER',
      navn: 'NIC',
      kilde: {
        kode: 'NIC',
        kodeverk: 'LANDKODER',
        navn: 'NIC',
      },
    },
    {
      kode: 'NIU',
      kodeverk: 'LANDKODER',
      navn: 'NIU',
      kilde: {
        kode: 'NIU',
        kodeverk: 'LANDKODER',
        navn: 'NIU',
      },
    },
    {
      kode: 'NLD',
      kodeverk: 'LANDKODER',
      navn: 'NLD',
      kilde: {
        kode: 'NLD',
        kodeverk: 'LANDKODER',
        navn: 'NLD',
      },
    },
    {
      kode: 'NOR',
      kodeverk: 'LANDKODER',
      navn: 'NOR',
      kilde: {
        kode: 'NOR',
        kodeverk: 'LANDKODER',
        navn: 'NOR',
      },
    },
    {
      kode: 'NPL',
      kodeverk: 'LANDKODER',
      navn: 'NPL',
      kilde: {
        kode: 'NPL',
        kodeverk: 'LANDKODER',
        navn: 'NPL',
      },
    },
    {
      kode: 'NRU',
      kodeverk: 'LANDKODER',
      navn: 'NRU',
      kilde: {
        kode: 'NRU',
        kodeverk: 'LANDKODER',
        navn: 'NRU',
      },
    },
    {
      kode: 'NZL',
      kodeverk: 'LANDKODER',
      navn: 'NZL',
      kilde: {
        kode: 'NZL',
        kodeverk: 'LANDKODER',
        navn: 'NZL',
      },
    },
    {
      kode: 'OMN',
      kodeverk: 'LANDKODER',
      navn: 'OMN',
      kilde: {
        kode: 'OMN',
        kodeverk: 'LANDKODER',
        navn: 'OMN',
      },
    },
    {
      kode: 'PAK',
      kodeverk: 'LANDKODER',
      navn: 'PAK',
      kilde: {
        kode: 'PAK',
        kodeverk: 'LANDKODER',
        navn: 'PAK',
      },
    },
    {
      kode: 'PAN',
      kodeverk: 'LANDKODER',
      navn: 'PAN',
      kilde: {
        kode: 'PAN',
        kodeverk: 'LANDKODER',
        navn: 'PAN',
      },
    },
    {
      kode: 'PCN',
      kodeverk: 'LANDKODER',
      navn: 'PCN',
      kilde: {
        kode: 'PCN',
        kodeverk: 'LANDKODER',
        navn: 'PCN',
      },
    },
    {
      kode: 'PER',
      kodeverk: 'LANDKODER',
      navn: 'PER',
      kilde: {
        kode: 'PER',
        kodeverk: 'LANDKODER',
        navn: 'PER',
      },
    },
    {
      kode: 'PHL',
      kodeverk: 'LANDKODER',
      navn: 'PHL',
      kilde: {
        kode: 'PHL',
        kodeverk: 'LANDKODER',
        navn: 'PHL',
      },
    },
    {
      kode: 'PLW',
      kodeverk: 'LANDKODER',
      navn: 'PLW',
      kilde: {
        kode: 'PLW',
        kodeverk: 'LANDKODER',
        navn: 'PLW',
      },
    },
    {
      kode: 'PNG',
      kodeverk: 'LANDKODER',
      navn: 'PNG',
      kilde: {
        kode: 'PNG',
        kodeverk: 'LANDKODER',
        navn: 'PNG',
      },
    },
    {
      kode: 'POL',
      kodeverk: 'LANDKODER',
      navn: 'POL',
      kilde: {
        kode: 'POL',
        kodeverk: 'LANDKODER',
        navn: 'POL',
      },
    },
    {
      kode: 'PRI',
      kodeverk: 'LANDKODER',
      navn: 'PRI',
      kilde: {
        kode: 'PRI',
        kodeverk: 'LANDKODER',
        navn: 'PRI',
      },
    },
    {
      kode: 'PRK',
      kodeverk: 'LANDKODER',
      navn: 'PRK',
      kilde: {
        kode: 'PRK',
        kodeverk: 'LANDKODER',
        navn: 'PRK',
      },
    },
    {
      kode: 'PRT',
      kodeverk: 'LANDKODER',
      navn: 'PRT',
      kilde: {
        kode: 'PRT',
        kodeverk: 'LANDKODER',
        navn: 'PRT',
      },
    },
    {
      kode: 'PRY',
      kodeverk: 'LANDKODER',
      navn: 'PRY',
      kilde: {
        kode: 'PRY',
        kodeverk: 'LANDKODER',
        navn: 'PRY',
      },
    },
    {
      kode: 'PSE',
      kodeverk: 'LANDKODER',
      navn: 'PSE',
      kilde: {
        kode: 'PSE',
        kodeverk: 'LANDKODER',
        navn: 'PSE',
      },
    },
    {
      kode: 'PYF',
      kodeverk: 'LANDKODER',
      navn: 'PYF',
      kilde: {
        kode: 'PYF',
        kodeverk: 'LANDKODER',
        navn: 'PYF',
      },
    },
    {
      kode: 'QAT',
      kodeverk: 'LANDKODER',
      navn: 'QAT',
      kilde: {
        kode: 'QAT',
        kodeverk: 'LANDKODER',
        navn: 'QAT',
      },
    },
    {
      kode: 'REU',
      kodeverk: 'LANDKODER',
      navn: 'REU',
      kilde: {
        kode: 'REU',
        kodeverk: 'LANDKODER',
        navn: 'REU',
      },
    },
    {
      kode: 'ROM',
      kodeverk: 'LANDKODER',
      navn: 'ROM',
      kilde: {
        kode: 'ROM',
        kodeverk: 'LANDKODER',
        navn: 'ROM',
      },
    },
    {
      kode: 'ROU',
      kodeverk: 'LANDKODER',
      navn: 'ROU',
      kilde: {
        kode: 'ROU',
        kodeverk: 'LANDKODER',
        navn: 'ROU',
      },
    },
    {
      kode: 'RUS',
      kodeverk: 'LANDKODER',
      navn: 'RUS',
      kilde: {
        kode: 'RUS',
        kodeverk: 'LANDKODER',
        navn: 'RUS',
      },
    },
    {
      kode: 'RWA',
      kodeverk: 'LANDKODER',
      navn: 'RWA',
      kilde: {
        kode: 'RWA',
        kodeverk: 'LANDKODER',
        navn: 'RWA',
      },
    },
    {
      kode: 'SAU',
      kodeverk: 'LANDKODER',
      navn: 'SAU',
      kilde: {
        kode: 'SAU',
        kodeverk: 'LANDKODER',
        navn: 'SAU',
      },
    },
    {
      kode: 'SCG',
      kodeverk: 'LANDKODER',
      navn: 'SCG',
      kilde: {
        kode: 'SCG',
        kodeverk: 'LANDKODER',
        navn: 'SCG',
      },
    },
    {
      kode: 'SDN',
      kodeverk: 'LANDKODER',
      navn: 'SDN',
      kilde: {
        kode: 'SDN',
        kodeverk: 'LANDKODER',
        navn: 'SDN',
      },
    },
    {
      kode: 'SEN',
      kodeverk: 'LANDKODER',
      navn: 'SEN',
      kilde: {
        kode: 'SEN',
        kodeverk: 'LANDKODER',
        navn: 'SEN',
      },
    },
    {
      kode: 'SGP',
      kodeverk: 'LANDKODER',
      navn: 'SGP',
      kilde: {
        kode: 'SGP',
        kodeverk: 'LANDKODER',
        navn: 'SGP',
      },
    },
    {
      kode: 'SGS',
      kodeverk: 'LANDKODER',
      navn: 'SGS',
      kilde: {
        kode: 'SGS',
        kodeverk: 'LANDKODER',
        navn: 'SGS',
      },
    },
    {
      kode: 'SHN',
      kodeverk: 'LANDKODER',
      navn: 'SHN',
      kilde: {
        kode: 'SHN',
        kodeverk: 'LANDKODER',
        navn: 'SHN',
      },
    },
    {
      kode: 'SJM',
      kodeverk: 'LANDKODER',
      navn: 'SJM',
      kilde: {
        kode: 'SJM',
        kodeverk: 'LANDKODER',
        navn: 'SJM',
      },
    },
    {
      kode: 'SLB',
      kodeverk: 'LANDKODER',
      navn: 'SLB',
      kilde: {
        kode: 'SLB',
        kodeverk: 'LANDKODER',
        navn: 'SLB',
      },
    },
    {
      kode: 'SLE',
      kodeverk: 'LANDKODER',
      navn: 'SLE',
      kilde: {
        kode: 'SLE',
        kodeverk: 'LANDKODER',
        navn: 'SLE',
      },
    },
    {
      kode: 'SLV',
      kodeverk: 'LANDKODER',
      navn: 'SLV',
      kilde: {
        kode: 'SLV',
        kodeverk: 'LANDKODER',
        navn: 'SLV',
      },
    },
    {
      kode: 'SMR',
      kodeverk: 'LANDKODER',
      navn: 'SMR',
      kilde: {
        kode: 'SMR',
        kodeverk: 'LANDKODER',
        navn: 'SMR',
      },
    },
    {
      kode: 'SOM',
      kodeverk: 'LANDKODER',
      navn: 'SOM',
      kilde: {
        kode: 'SOM',
        kodeverk: 'LANDKODER',
        navn: 'SOM',
      },
    },
    {
      kode: 'SPM',
      kodeverk: 'LANDKODER',
      navn: 'SPM',
      kilde: {
        kode: 'SPM',
        kodeverk: 'LANDKODER',
        navn: 'SPM',
      },
    },
    {
      kode: 'SRB',
      kodeverk: 'LANDKODER',
      navn: 'SRB',
      kilde: {
        kode: 'SRB',
        kodeverk: 'LANDKODER',
        navn: 'SRB',
      },
    },
    {
      kode: 'SSD',
      kodeverk: 'LANDKODER',
      navn: 'SSD',
      kilde: {
        kode: 'SSD',
        kodeverk: 'LANDKODER',
        navn: 'SSD',
      },
    },
    {
      kode: 'STP',
      kodeverk: 'LANDKODER',
      navn: 'STP',
      kilde: {
        kode: 'STP',
        kodeverk: 'LANDKODER',
        navn: 'STP',
      },
    },
    {
      kode: 'SUN',
      kodeverk: 'LANDKODER',
      navn: 'SUN',
      kilde: {
        kode: 'SUN',
        kodeverk: 'LANDKODER',
        navn: 'SUN',
      },
    },
    {
      kode: 'SUR',
      kodeverk: 'LANDKODER',
      navn: 'SUR',
      kilde: {
        kode: 'SUR',
        kodeverk: 'LANDKODER',
        navn: 'SUR',
      },
    },
    {
      kode: 'SVK',
      kodeverk: 'LANDKODER',
      navn: 'SVK',
      kilde: {
        kode: 'SVK',
        kodeverk: 'LANDKODER',
        navn: 'SVK',
      },
    },
    {
      kode: 'SVN',
      kodeverk: 'LANDKODER',
      navn: 'SVN',
      kilde: {
        kode: 'SVN',
        kodeverk: 'LANDKODER',
        navn: 'SVN',
      },
    },
    {
      kode: 'SWE',
      kodeverk: 'LANDKODER',
      navn: 'SWE',
      kilde: {
        kode: 'SWE',
        kodeverk: 'LANDKODER',
        navn: 'SWE',
      },
    },
    {
      kode: 'SWZ',
      kodeverk: 'LANDKODER',
      navn: 'SWZ',
      kilde: {
        kode: 'SWZ',
        kodeverk: 'LANDKODER',
        navn: 'SWZ',
      },
    },
    {
      kode: 'SXM',
      kodeverk: 'LANDKODER',
      navn: 'SXM',
      kilde: {
        kode: 'SXM',
        kodeverk: 'LANDKODER',
        navn: 'SXM',
      },
    },
    {
      kode: 'SYC',
      kodeverk: 'LANDKODER',
      navn: 'SYC',
      kilde: {
        kode: 'SYC',
        kodeverk: 'LANDKODER',
        navn: 'SYC',
      },
    },
    {
      kode: 'SYR',
      kodeverk: 'LANDKODER',
      navn: 'SYR',
      kilde: {
        kode: 'SYR',
        kodeverk: 'LANDKODER',
        navn: 'SYR',
      },
    },
    {
      kode: 'TCA',
      kodeverk: 'LANDKODER',
      navn: 'TCA',
      kilde: {
        kode: 'TCA',
        kodeverk: 'LANDKODER',
        navn: 'TCA',
      },
    },
    {
      kode: 'TCD',
      kodeverk: 'LANDKODER',
      navn: 'TCD',
      kilde: {
        kode: 'TCD',
        kodeverk: 'LANDKODER',
        navn: 'TCD',
      },
    },
    {
      kode: 'TGO',
      kodeverk: 'LANDKODER',
      navn: 'TGO',
      kilde: {
        kode: 'TGO',
        kodeverk: 'LANDKODER',
        navn: 'TGO',
      },
    },
    {
      kode: 'THA',
      kodeverk: 'LANDKODER',
      navn: 'THA',
      kilde: {
        kode: 'THA',
        kodeverk: 'LANDKODER',
        navn: 'THA',
      },
    },
    {
      kode: 'TJK',
      kodeverk: 'LANDKODER',
      navn: 'TJK',
      kilde: {
        kode: 'TJK',
        kodeverk: 'LANDKODER',
        navn: 'TJK',
      },
    },
    {
      kode: 'TKL',
      kodeverk: 'LANDKODER',
      navn: 'TKL',
      kilde: {
        kode: 'TKL',
        kodeverk: 'LANDKODER',
        navn: 'TKL',
      },
    },
    {
      kode: 'TKM',
      kodeverk: 'LANDKODER',
      navn: 'TKM',
      kilde: {
        kode: 'TKM',
        kodeverk: 'LANDKODER',
        navn: 'TKM',
      },
    },
    {
      kode: 'TLS',
      kodeverk: 'LANDKODER',
      navn: 'TLS',
      kilde: {
        kode: 'TLS',
        kodeverk: 'LANDKODER',
        navn: 'TLS',
      },
    },
    {
      kode: 'TMP',
      kodeverk: 'LANDKODER',
      navn: 'TMP',
      kilde: {
        kode: 'TMP',
        kodeverk: 'LANDKODER',
        navn: 'TMP',
      },
    },
    {
      kode: 'TON',
      kodeverk: 'LANDKODER',
      navn: 'TON',
      kilde: {
        kode: 'TON',
        kodeverk: 'LANDKODER',
        navn: 'TON',
      },
    },
    {
      kode: 'TTO',
      kodeverk: 'LANDKODER',
      navn: 'TTO',
      kilde: {
        kode: 'TTO',
        kodeverk: 'LANDKODER',
        navn: 'TTO',
      },
    },
    {
      kode: 'TUN',
      kodeverk: 'LANDKODER',
      navn: 'TUN',
      kilde: {
        kode: 'TUN',
        kodeverk: 'LANDKODER',
        navn: 'TUN',
      },
    },
    {
      kode: 'TUR',
      kodeverk: 'LANDKODER',
      navn: 'TUR',
      kilde: {
        kode: 'TUR',
        kodeverk: 'LANDKODER',
        navn: 'TUR',
      },
    },
    {
      kode: 'TUV',
      kodeverk: 'LANDKODER',
      navn: 'TUV',
      kilde: {
        kode: 'TUV',
        kodeverk: 'LANDKODER',
        navn: 'TUV',
      },
    },
    {
      kode: 'TWN',
      kodeverk: 'LANDKODER',
      navn: 'TWN',
      kilde: {
        kode: 'TWN',
        kodeverk: 'LANDKODER',
        navn: 'TWN',
      },
    },
    {
      kode: 'TZA',
      kodeverk: 'LANDKODER',
      navn: 'TZA',
      kilde: {
        kode: 'TZA',
        kodeverk: 'LANDKODER',
        navn: 'TZA',
      },
    },
    {
      kode: 'UGA',
      kodeverk: 'LANDKODER',
      navn: 'UGA',
      kilde: {
        kode: 'UGA',
        kodeverk: 'LANDKODER',
        navn: 'UGA',
      },
    },
    {
      kode: 'UKR',
      kodeverk: 'LANDKODER',
      navn: 'UKR',
      kilde: {
        kode: 'UKR',
        kodeverk: 'LANDKODER',
        navn: 'UKR',
      },
    },
    {
      kode: 'UMI',
      kodeverk: 'LANDKODER',
      navn: 'UMI',
      kilde: {
        kode: 'UMI',
        kodeverk: 'LANDKODER',
        navn: 'UMI',
      },
    },
    {
      kode: 'URY',
      kodeverk: 'LANDKODER',
      navn: 'URY',
      kilde: {
        kode: 'URY',
        kodeverk: 'LANDKODER',
        navn: 'URY',
      },
    },
    {
      kode: 'USA',
      kodeverk: 'LANDKODER',
      navn: 'USA',
      kilde: {
        kode: 'USA',
        kodeverk: 'LANDKODER',
        navn: 'USA',
      },
    },
    {
      kode: 'UZB',
      kodeverk: 'LANDKODER',
      navn: 'UZB',
      kilde: {
        kode: 'UZB',
        kodeverk: 'LANDKODER',
        navn: 'UZB',
      },
    },
    {
      kode: 'VAT',
      kodeverk: 'LANDKODER',
      navn: 'VAT',
      kilde: {
        kode: 'VAT',
        kodeverk: 'LANDKODER',
        navn: 'VAT',
      },
    },
    {
      kode: 'VCT',
      kodeverk: 'LANDKODER',
      navn: 'VCT',
      kilde: {
        kode: 'VCT',
        kodeverk: 'LANDKODER',
        navn: 'VCT',
      },
    },
    {
      kode: 'VEN',
      kodeverk: 'LANDKODER',
      navn: 'VEN',
      kilde: {
        kode: 'VEN',
        kodeverk: 'LANDKODER',
        navn: 'VEN',
      },
    },
    {
      kode: 'VGB',
      kodeverk: 'LANDKODER',
      navn: 'VGB',
      kilde: {
        kode: 'VGB',
        kodeverk: 'LANDKODER',
        navn: 'VGB',
      },
    },
    {
      kode: 'VIR',
      kodeverk: 'LANDKODER',
      navn: 'VIR',
      kilde: {
        kode: 'VIR',
        kodeverk: 'LANDKODER',
        navn: 'VIR',
      },
    },
    {
      kode: 'VNM',
      kodeverk: 'LANDKODER',
      navn: 'VNM',
      kilde: {
        kode: 'VNM',
        kodeverk: 'LANDKODER',
        navn: 'VNM',
      },
    },
    {
      kode: 'VUT',
      kodeverk: 'LANDKODER',
      navn: 'VUT',
      kilde: {
        kode: 'VUT',
        kodeverk: 'LANDKODER',
        navn: 'VUT',
      },
    },
    {
      kode: 'WLF',
      kodeverk: 'LANDKODER',
      navn: 'WLF',
      kilde: {
        kode: 'WLF',
        kodeverk: 'LANDKODER',
        navn: 'WLF',
      },
    },
    {
      kode: 'WSM',
      kodeverk: 'LANDKODER',
      navn: 'WSM',
      kilde: {
        kode: 'WSM',
        kodeverk: 'LANDKODER',
        navn: 'WSM',
      },
    },
    {
      kode: 'XXK',
      kodeverk: 'LANDKODER',
      navn: 'XXK',
      kilde: {
        kode: 'XXK',
        kodeverk: 'LANDKODER',
        navn: 'XXK',
      },
    },
    {
      kode: 'XXX',
      kodeverk: 'LANDKODER',
      navn: 'XXX',
      kilde: {
        kode: 'XXX',
        kodeverk: 'LANDKODER',
        navn: 'XXX',
      },
    },
    {
      kode: 'YEM',
      kodeverk: 'LANDKODER',
      navn: 'YEM',
      kilde: {
        kode: 'YEM',
        kodeverk: 'LANDKODER',
        navn: 'YEM',
      },
    },
    {
      kode: 'YUG',
      kodeverk: 'LANDKODER',
      navn: 'YUG',
      kilde: {
        kode: 'YUG',
        kodeverk: 'LANDKODER',
        navn: 'YUG',
      },
    },
    {
      kode: 'ZAF',
      kodeverk: 'LANDKODER',
      navn: 'ZAF',
      kilde: {
        kode: 'ZAF',
        kodeverk: 'LANDKODER',
        navn: 'ZAF',
      },
    },
    {
      kode: 'ZAR',
      kodeverk: 'LANDKODER',
      navn: 'ZAR',
      kilde: {
        kode: 'ZAR',
        kodeverk: 'LANDKODER',
        navn: 'ZAR',
      },
    },
    {
      kode: 'ZMB',
      kodeverk: 'LANDKODER',
      navn: 'ZMB',
      kilde: {
        kode: 'ZMB',
        kodeverk: 'LANDKODER',
        navn: 'ZMB',
      },
    },
    {
      kode: 'ZWE',
      kodeverk: 'LANDKODER',
      navn: 'ZWE',
      kilde: {
        kode: 'ZWE',
        kodeverk: 'LANDKODER',
        navn: 'ZWE',
      },
    },
  ],
  språkkoder: [
    {
      kode: '-',
      kodeverk: 'SPRAAK_KODE',
      navn: '-',
      kilde: {
        kode: '-',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AA',
      kilde: {
        kode: 'AA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AB',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AB',
      kilde: {
        kode: 'AB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AE',
      kilde: {
        kode: 'AE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AF',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AF',
      kilde: {
        kode: 'AF',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AK',
      kilde: {
        kode: 'AK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AM',
      kilde: {
        kode: 'AM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AN',
      kilde: {
        kode: 'AN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AR',
      kilde: {
        kode: 'AR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AS',
      kilde: {
        kode: 'AS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AV',
      kilde: {
        kode: 'AV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AY',
      kilde: {
        kode: 'AY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'AZ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'AZ',
      kilde: {
        kode: 'AZ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BA',
      kilde: {
        kode: 'BA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BE',
      kilde: {
        kode: 'BE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BG',
      kilde: {
        kode: 'BG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BH',
      kilde: {
        kode: 'BH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BI',
      kilde: {
        kode: 'BI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BM',
      kilde: {
        kode: 'BM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BN',
      kilde: {
        kode: 'BN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BO',
      kilde: {
        kode: 'BO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BR',
      kilde: {
        kode: 'BR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'BS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'BS',
      kilde: {
        kode: 'BS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CA',
      kilde: {
        kode: 'CA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CE',
      kilde: {
        kode: 'CE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CH',
      kilde: {
        kode: 'CH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CO',
      kilde: {
        kode: 'CO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CR',
      kilde: {
        kode: 'CR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CS',
      kilde: {
        kode: 'CS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CU',
      kilde: {
        kode: 'CU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CV',
      kilde: {
        kode: 'CV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'CY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'CY',
      kilde: {
        kode: 'CY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'DA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'DA',
      kilde: {
        kode: 'DA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'DE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'DE',
      kilde: {
        kode: 'DE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'DV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'DV',
      kilde: {
        kode: 'DV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'DZ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'DZ',
      kilde: {
        kode: 'DZ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'EE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'EE',
      kilde: {
        kode: 'EE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'EL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'EL',
      kilde: {
        kode: 'EL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'EN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'EN',
      kilde: {
        kode: 'EN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'EO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'EO',
      kilde: {
        kode: 'EO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ES',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ES',
      kilde: {
        kode: 'ES',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ET',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ET',
      kilde: {
        kode: 'ET',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'EU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'EU',
      kilde: {
        kode: 'EU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FA',
      kilde: {
        kode: 'FA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FF',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FF',
      kilde: {
        kode: 'FF',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FI',
      kilde: {
        kode: 'FI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FJ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FJ',
      kilde: {
        kode: 'FJ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FO',
      kilde: {
        kode: 'FO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FR',
      kilde: {
        kode: 'FR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'FY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'FY',
      kilde: {
        kode: 'FY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GA',
      kilde: {
        kode: 'GA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GD',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GD',
      kilde: {
        kode: 'GD',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GL',
      kilde: {
        kode: 'GL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GN',
      kilde: {
        kode: 'GN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GU',
      kilde: {
        kode: 'GU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'GV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'GV',
      kilde: {
        kode: 'GV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HA',
      kilde: {
        kode: 'HA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HE',
      kilde: {
        kode: 'HE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HI',
      kilde: {
        kode: 'HI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HO',
      kilde: {
        kode: 'HO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HR',
      kilde: {
        kode: 'HR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HT',
      kilde: {
        kode: 'HT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HU',
      kilde: {
        kode: 'HU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HY',
      kilde: {
        kode: 'HY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'HZ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'HZ',
      kilde: {
        kode: 'HZ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IA',
      kilde: {
        kode: 'IA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ID',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ID',
      kilde: {
        kode: 'ID',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IE',
      kilde: {
        kode: 'IE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IG',
      kilde: {
        kode: 'IG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'II',
      kodeverk: 'SPRAAK_KODE',
      navn: 'II',
      kilde: {
        kode: 'II',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IK',
      kilde: {
        kode: 'IK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IN',
      kilde: {
        kode: 'IN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IO',
      kilde: {
        kode: 'IO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IS',
      kilde: {
        kode: 'IS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IT',
      kilde: {
        kode: 'IT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IU',
      kilde: {
        kode: 'IU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'IW',
      kodeverk: 'SPRAAK_KODE',
      navn: 'IW',
      kilde: {
        kode: 'IW',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'JA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'JA',
      kilde: {
        kode: 'JA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'JI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'JI',
      kilde: {
        kode: 'JI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'JV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'JV',
      kilde: {
        kode: 'JV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KA',
      kilde: {
        kode: 'KA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KG',
      kilde: {
        kode: 'KG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KI',
      kilde: {
        kode: 'KI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KJ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KJ',
      kilde: {
        kode: 'KJ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KK',
      kilde: {
        kode: 'KK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KL',
      kilde: {
        kode: 'KL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KM',
      kilde: {
        kode: 'KM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KN',
      kilde: {
        kode: 'KN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KO',
      kilde: {
        kode: 'KO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KR',
      kilde: {
        kode: 'KR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KS',
      kilde: {
        kode: 'KS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KU',
      kilde: {
        kode: 'KU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KV',
      kilde: {
        kode: 'KV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KW',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KW',
      kilde: {
        kode: 'KW',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'KY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'KY',
      kilde: {
        kode: 'KY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LA',
      kilde: {
        kode: 'LA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LB',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LB',
      kilde: {
        kode: 'LB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LG',
      kilde: {
        kode: 'LG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LI',
      kilde: {
        kode: 'LI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LN',
      kilde: {
        kode: 'LN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LO',
      kilde: {
        kode: 'LO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LT',
      kilde: {
        kode: 'LT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LU',
      kilde: {
        kode: 'LU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'LV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'LV',
      kilde: {
        kode: 'LV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MG',
      kilde: {
        kode: 'MG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MH',
      kilde: {
        kode: 'MH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MI',
      kilde: {
        kode: 'MI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MK',
      kilde: {
        kode: 'MK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ML',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ML',
      kilde: {
        kode: 'ML',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MN',
      kilde: {
        kode: 'MN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MO',
      kilde: {
        kode: 'MO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MR',
      kilde: {
        kode: 'MR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MS',
      kilde: {
        kode: 'MS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MT',
      kilde: {
        kode: 'MT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'MY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'MY',
      kilde: {
        kode: 'MY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NA',
      kilde: {
        kode: 'NA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NB',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NB',
      kilde: {
        kode: 'NB',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ND',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ND',
      kilde: {
        kode: 'ND',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NE',
      kilde: {
        kode: 'NE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NG',
      kilde: {
        kode: 'NG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NL',
      kilde: {
        kode: 'NL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NN',
      kilde: {
        kode: 'NN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NO',
      kilde: {
        kode: 'NO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NR',
      kilde: {
        kode: 'NR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NV',
      kilde: {
        kode: 'NV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'NY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'NY',
      kilde: {
        kode: 'NY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'OC',
      kodeverk: 'SPRAAK_KODE',
      navn: 'OC',
      kilde: {
        kode: 'OC',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'OJ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'OJ',
      kilde: {
        kode: 'OJ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'OM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'OM',
      kilde: {
        kode: 'OM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'OR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'OR',
      kilde: {
        kode: 'OR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'OS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'OS',
      kilde: {
        kode: 'OS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'PA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'PA',
      kilde: {
        kode: 'PA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'PI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'PI',
      kilde: {
        kode: 'PI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'PL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'PL',
      kilde: {
        kode: 'PL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'PS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'PS',
      kilde: {
        kode: 'PS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'PT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'PT',
      kilde: {
        kode: 'PT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'QU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'QU',
      kilde: {
        kode: 'QU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'RM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'RM',
      kilde: {
        kode: 'RM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'RN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'RN',
      kilde: {
        kode: 'RN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'RO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'RO',
      kilde: {
        kode: 'RO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'RU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'RU',
      kilde: {
        kode: 'RU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'RW',
      kodeverk: 'SPRAAK_KODE',
      navn: 'RW',
      kilde: {
        kode: 'RW',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SA',
      kilde: {
        kode: 'SA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SC',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SC',
      kilde: {
        kode: 'SC',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SD',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SD',
      kilde: {
        kode: 'SD',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SE',
      kilde: {
        kode: 'SE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SG',
      kilde: {
        kode: 'SG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SI',
      kilde: {
        kode: 'SI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SK',
      kilde: {
        kode: 'SK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SL',
      kilde: {
        kode: 'SL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SM',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SM',
      kilde: {
        kode: 'SM',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SN',
      kilde: {
        kode: 'SN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SO',
      kilde: {
        kode: 'SO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SQ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SQ',
      kilde: {
        kode: 'SQ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SR',
      kilde: {
        kode: 'SR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SS',
      kilde: {
        kode: 'SS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ST',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ST',
      kilde: {
        kode: 'ST',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SU',
      kilde: {
        kode: 'SU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SV',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SV',
      kilde: {
        kode: 'SV',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'SW',
      kodeverk: 'SPRAAK_KODE',
      navn: 'SW',
      kilde: {
        kode: 'SW',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TA',
      kilde: {
        kode: 'TA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TE',
      kilde: {
        kode: 'TE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TG',
      kilde: {
        kode: 'TG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TH',
      kilde: {
        kode: 'TH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TI',
      kilde: {
        kode: 'TI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TK',
      kilde: {
        kode: 'TK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TL',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TL',
      kilde: {
        kode: 'TL',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TN',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TN',
      kilde: {
        kode: 'TN',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TO',
      kilde: {
        kode: 'TO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TR',
      kilde: {
        kode: 'TR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TS',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TS',
      kilde: {
        kode: 'TS',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TT',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TT',
      kilde: {
        kode: 'TT',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TW',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TW',
      kilde: {
        kode: 'TW',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'TY',
      kodeverk: 'SPRAAK_KODE',
      navn: 'TY',
      kilde: {
        kode: 'TY',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'UG',
      kodeverk: 'SPRAAK_KODE',
      navn: 'UG',
      kilde: {
        kode: 'UG',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'UK',
      kodeverk: 'SPRAAK_KODE',
      navn: 'UK',
      kilde: {
        kode: 'UK',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'UR',
      kodeverk: 'SPRAAK_KODE',
      navn: 'UR',
      kilde: {
        kode: 'UR',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'UZ',
      kodeverk: 'SPRAAK_KODE',
      navn: 'UZ',
      kilde: {
        kode: 'UZ',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'VE',
      kodeverk: 'SPRAAK_KODE',
      navn: 'VE',
      kilde: {
        kode: 'VE',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'VI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'VI',
      kilde: {
        kode: 'VI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'VO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'VO',
      kilde: {
        kode: 'VO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'WA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'WA',
      kilde: {
        kode: 'WA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'WO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'WO',
      kilde: {
        kode: 'WO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'XH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'XH',
      kilde: {
        kode: 'XH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'YI',
      kodeverk: 'SPRAAK_KODE',
      navn: 'YI',
      kilde: {
        kode: 'YI',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'YO',
      kodeverk: 'SPRAAK_KODE',
      navn: 'YO',
      kilde: {
        kode: 'YO',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ZA',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ZA',
      kilde: {
        kode: 'ZA',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ZH',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ZH',
      kilde: {
        kode: 'ZH',
        kodeverk: 'SPRAAK_KODE',
      },
    },
    {
      kode: 'ZU',
      kodeverk: 'SPRAAK_KODE',
      navn: 'ZU',
      kilde: {
        kode: 'ZU',
        kodeverk: 'SPRAAK_KODE',
      },
    },
  ],
  vedtakResultatTyper: [
    {
      kode: '-',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'Ikke definert',
      kilde: '-',
    },
    {
      kode: 'AVSLAG',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'Avslag',
      kilde: 'AVSLAG',
    },
    {
      kode: 'DELVIS_INNVILGET',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'delvis innvilget',
      kilde: 'DELVIS_INNVILGET',
    },
    {
      kode: 'FEILREGISTRERT',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'Feilregistrert av Kabal',
      kilde: 'FEILREGISTRERT',
    },
    {
      kode: 'INNVILGET',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'Innvilget',
      kilde: 'INNVILGET',
    },
    {
      kode: 'OPPHØR',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'Opphør',
      kilde: 'OPPHØR',
    },
    {
      kode: 'VEDTAK_I_ANKEBEHANDLING',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'vedtak i ankebehandling',
      kilde: 'VEDTAK_I_ANKEBEHANDLING',
    },
    {
      kode: 'VEDTAK_I_INNSYNBEHANDLING',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'vedtak i innsynbehandling',
      kilde: 'VEDTAK_I_INNSYNBEHANDLING',
    },
    {
      kode: 'VEDTAK_I_KLAGEBEHANDLING',
      kodeverk: 'VEDTAK_RESULTAT_TYPE',
      navn: 'vedtak i klagebehandling',
      kilde: 'VEDTAK_I_KLAGEBEHANDLING',
    },
  ],
  dokumentTypeIder: [
    {
      kode: '-',
      kodeverk: 'DOKUMENT_TYPE_ID',
      navn: '-',
      kilde: '-',
    },
    {
      kode: 'I500027',
      kodeverk: 'DOKUMENT_TYPE_ID',
      navn: 'I500027',
      kilde: 'I500027',
    },
    {
      kode: 'INNTEKTSMELDING',
      kodeverk: 'DOKUMENT_TYPE_ID',
      navn: 'INNTEKTSMELDING',
      kilde: 'INNTEKTSMELDING',
    },
    {
      kode: 'KLAGE_DOKUMENT',
      kodeverk: 'DOKUMENT_TYPE_ID',
      navn: 'KLAGE_DOKUMENT',
      kilde: 'KLAGE_DOKUMENT',
    },
    {
      kode: 'LEGEERKLÆRING',
      kodeverk: 'DOKUMENT_TYPE_ID',
      navn: 'LEGEERKLÆRING',
      kilde: 'LEGEERKLÆRING',
    },
  ],
  klageMedholdÅrsaker: [
    {
      kode: '-',
      kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'NYE_OPPLYSNINGER',
      kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      navn: 'Nytt faktum',
      kilde: 'NYE_OPPLYSNINGER',
    },
    {
      kode: 'PROSESSUELL_FEIL',
      kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      navn: 'Saksbehandlingsfeil',
      kilde: 'PROSESSUELL_FEIL',
    },
    {
      kode: 'ULIK_REGELVERKSTOLKNING',
      kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      navn: 'Feil lovanvendelse',
      kilde: 'ULIK_REGELVERKSTOLKNING',
    },
    {
      kode: 'ULIK_VURDERING',
      kodeverk: 'KLAGE_MEDHOLD_AARSAK',
      navn: 'Ulik skjønnsvurdering',
      kilde: 'ULIK_VURDERING',
    },
  ],
  klageAvvistÅrsaker: [
    {
      kode: '-',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Ikke definert',
      kilde: 'UDEFINERT',
    },
    {
      kode: 'IKKE_KONKRET',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Klagen er ikke konkret',
      kilde: 'IKKE_KONKRET',
    },
    {
      kode: 'IKKE_PAKLAGD_VEDTAK',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Ikke påklagd et vedtak',
      kilde: 'IKKE_PAKLAGD_VEDTAK',
    },
    {
      kode: 'IKKE_SIGNERT',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Klagen er ikke signert',
      kilde: 'IKKE_SIGNERT',
    },
    {
      kode: 'KLAGER_IKKE_PART',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Klager er ikke part',
      kilde: 'KLAGER_IKKE_PART',
    },
    {
      kode: 'KLAGET_FOR_SENT',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Bruker har klaget for sent',
      kilde: 'KLAGET_FOR_SENT',
    },
    {
      kode: 'KLAGE_UGYLDIG',
      kodeverk: 'KLAGE_AVVIST_AARSAK',
      navn: 'Klage er ugyldig',
      kilde: 'KLAGE_UGYLDIG',
    },
  ],
} satisfies AlleKodeverdierSomObjektResponse;
