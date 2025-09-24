import type {AlleKodeverdierSomObjektResponse} from "@k9-sak-web/backend/ungsak/generated/types.js";

export const oppslagKodeverkSomObjektUngSak = {
  "fagsakStatuser": [
    {
      "kode": "AVSLU",
      "kodeverk": "FAGSAK_STATUS",
      "navn": "Avsluttet",
      "kilde": "AVSLU"
    },
    {
      "kode": "LOP",
      "kodeverk": "FAGSAK_STATUS",
      "navn": "Løpende",
      "kilde": "LOP"
    },
    {
      "kode": "OPPR",
      "kodeverk": "FAGSAK_STATUS",
      "navn": "Opprettet",
      "kilde": "OPPR"
    },
    {
      "kode": "UBEH",
      "kodeverk": "FAGSAK_STATUS",
      "navn": "Under behandling",
      "kilde": "UBEH"
    }
  ],
  "fagsakYtelseTyper": [
    {
      "kode": "-",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "AAP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Arbeidsavklaringspenger",
      "kilde": "AAP"
    },
    {
      "kode": "DAG",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Dagpenger",
      "kilde": "DAG"
    },
    {
      "kode": "EF",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Enslig forsørger",
      "kilde": "EF"
    },
    {
      "kode": "ES",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Engangsstønad",
      "kilde": "ES"
    },
    {
      "kode": "FP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Foreldrepenger",
      "kilde": "FP"
    },
    {
      "kode": "FRISINN",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "FRIlansere og Selvstendig næringsdrivendes INNtektskompensasjon",
      "kilde": "FRISINN"
    },
    {
      "kode": "OBSOLETE",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Kun brukt for å markere noen som utgått - ikke en gyldig type i seg selv",
      "kilde": "OBSOLETE"
    },
    {
      "kode": "OLP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Opplæringspenger",
      "kilde": "OLP"
    },
    {
      "kode": "OMP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Omsorgspenger",
      "kilde": "OMP"
    },
    {
      "kode": "OMP_AO",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Alene om omsorgen",
      "kilde": "OMP_AO"
    },
    {
      "kode": "OMP_KS",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Ekstra omsorgsdager kronisk syk",
      "kilde": "OMP_KS"
    },
    {
      "kode": "OMP_MA",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Ekstra omsorgsdager midlertidig alene",
      "kilde": "OMP_MA"
    },
    {
      "kode": "PPN",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Pleiepenger livets sluttfase",
      "kilde": "PPN"
    },
    {
      "kode": "PSB",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Pleiepenger sykt barn",
      "kilde": "PSB"
    },
    {
      "kode": "SP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Sykepenger",
      "kilde": "SP"
    },
    {
      "kode": "SVP",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Svangerskapspenger",
      "kilde": "SVP"
    },
    {
      "kode": "UNG",
      "kodeverk": "FAGSAK_YTELSE",
      "navn": "Ungdomsprogramytelse",
      "kilde": "UNG"
    }
  ],
  "behandlingÅrsakTyper": [
    {
      "kode": "-",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "ETTER_KLAGE",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Ny behandling eller revurdering etter klage eller anke",
      "kilde": "ETTER_KLAGE"
    },
    {
      "kode": "RE-ANNET",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Annet",
      "kilde": "RE-ANNET"
    },
    {
      "kode": "RE-DØD",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Nye opplysninger om brukers eller barns dødsfall",
      "kilde": "RE-DØD"
    },
    {
      "kode": "RE-END-FRA-BRUKER",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Endring fra deltaker",
      "kilde": "RE-END-FRA-BRUKER"
    },
    {
      "kode": "RE-HENDELSE-DØD-B",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Melding om registrert død på pleietrengende i folkeregisteret",
      "kilde": "RE-HENDELSE-DØD-B"
    },
    {
      "kode": "RE-HENDELSE-DØD-F",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Melding om registrert død på bruker i folkeregisteret",
      "kilde": "RE-HENDELSE-DØD-F"
    },
    {
      "kode": "RE-HENDELSE-ENDRET-STARTDATO-UNG",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Melding om endret startdato av ungdomsprogram for deltaker",
      "kilde": "RE-HENDELSE-ENDRET-STARTDATO-UNG"
    },
    {
      "kode": "RE-HENDELSE-FØDSEL",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Melding om registrert fødsel i folkeregisteret",
      "kilde": "RE-HENDELSE-FØDSEL"
    },
    {
      "kode": "RE-HENDELSE-OPPHØR-UNG",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Melding om opphør av ungdomsprogram for deltaker",
      "kilde": "RE-HENDELSE-OPPHØR-UNG"
    },
    {
      "kode": "RE-INNTEKTOPPL",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Nye opplysninger om inntekt",
      "kilde": "RE-INNTEKTOPPL"
    },
    {
      "kode": "RE-KONTROLL-REGISTER-INNTEKT",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Kontroll av registerinntekt",
      "kilde": "RE-KONTROLL-REGISTER-INNTEKT"
    },
    {
      "kode": "RE-RAPPORTERING-INNTEKT",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Rapportering av inntekt",
      "kilde": "RE-RAPPORTERING-INNTEKT"
    },
    {
      "kode": "RE-REGISTEROPPL",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Nye registeropplysninger",
      "kilde": "RE-REGISTEROPPL"
    },
    {
      "kode": "RE-SATS-ENDRING",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Generelle endringer som påvirker sats og barnetillegg",
      "kilde": "RE-SATS-ENDRING"
    },
    {
      "kode": "RE-SATS-REGULERING",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Regulering av grunnbeløp",
      "kilde": "RE-SATS-REGULERING"
    },
    {
      "kode": "RE_TRIGGER_BEREGNING_HØY_SATS",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Beregn høy sats",
      "kilde": "RE_TRIGGER_BEREGNING_HØY_SATS"
    },
    {
      "kode": "UTTALELSE-FRA-BRUKER",
      "kodeverk": "BEHANDLING_AARSAK",
      "navn": "Uttalelse fra bruker",
      "kilde": "UTTALELSE-FRA-BRUKER"
    }
  ],
  "oppgaveÅrsaker": [
    {
      "kode": "-",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "BEH_SAK",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Behandle sak",
      "kilde": "BEH_SAK"
    },
    {
      "kode": "BEH_SAK_VL",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Behandle sak i VL",
      "kilde": "BEH_SAK_VL"
    },
    {
      "kode": "FEILUTBET",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Feilutbetalingsvedtak",
      "kilde": "FEILUTBET"
    },
    {
      "kode": "GOD_VED_VL",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Godkjenne vedtak i VL",
      "kilde": "GOD_VED_VL"
    },
    {
      "kode": "INNH_DOK",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Innhent dokumentasjon",
      "kilde": "INNH_DOK"
    },
    {
      "kode": "REG_SOK_VL",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Registrere søknad i VL",
      "kilde": "REG_SOK_VL"
    },
    {
      "kode": "RV_VL",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Revurdere i VL",
      "kilde": "RV_VL"
    },
    {
      "kode": "SETTVENT",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Sett utbetaling på vent",
      "kilde": "SETTVENT"
    },
    {
      "kode": "VUR",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Vurder dokument",
      "kilde": "VUR"
    },
    {
      "kode": "VUR_KONS_YTE",
      "kodeverk": "OPPGAVE_AARSAK",
      "navn": "Vurder konsekvens for ytelse",
      "kilde": "VUR_KONS_YTE"
    }
  ],
  "behandlingResultatTyper": [
    {
      "kode": "AVSLÅTT",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Avslått",
      "kilde": "AVSLÅTT"
    },
    {
      "kode": "DELVIS_INNVILGET",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Delvis innvilget",
      "kilde": "DELVIS_INNVILGET"
    },
    {
      "kode": "HENLAGT_BRUKER_DØD",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Henlagt, brukeren er død",
      "kilde": "HENLAGT_BRUKER_DØD"
    },
    {
      "kode": "HENLAGT_FEILOPPRETTET",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Henlagt, søknaden er feilopprettet",
      "kilde": "HENLAGT_FEILOPPRETTET"
    },
    {
      "kode": "HENLAGT_MASKINELT",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Henlagt maskinelt",
      "kilde": "HENLAGT_MASKINELT"
    },
    {
      "kode": "HENLAGT_SØKNAD_MANGLER",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Henlagt søknad mangler",
      "kilde": "HENLAGT_SØKNAD_MANGLER"
    },
    {
      "kode": "HENLAGT_SØKNAD_TRUKKET",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Henlagt, søknaden er trukket",
      "kilde": "HENLAGT_SØKNAD_TRUKKET"
    },
    {
      "kode": "IKKE_FASTSATT",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Ikke fastsatt",
      "kilde": "IKKE_FASTSATT"
    },
    {
      "kode": "INGEN_ENDRING",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Ingen endring",
      "kilde": "INGEN_ENDRING"
    },
    {
      "kode": "INNVILGET",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Innvilget",
      "kilde": "INNVILGET"
    },
    {
      "kode": "INNVILGET_ENDRING",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Endring innvilget",
      "kilde": "INNVILGET_ENDRING"
    },
    {
      "kode": "MANGLER_BEREGNINGSREGLER",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Mangler beregningsregler",
      "kilde": "MANGLER_BEREGNINGSREGLER"
    },
    {
      "kode": "MERGET_OG_HENLAGT",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Mottatt ny søknad",
      "kilde": "MERGET_OG_HENLAGT"
    },
    {
      "kode": "OPPHØR",
      "kodeverk": "BEHANDLING_RESULTAT_TYPE",
      "navn": "Opphør",
      "kilde": "OPPHØR"
    }
  ],
  "venteårsaker": [
    {
      "kode": "-",
      "kodeverk": "VENT_AARSAK",
      "navn": "Ikke definert",
      "kilde": "-",
      "kanVelges": false
    },
    {
      "kode": "ANNET",
      "kodeverk": "VENT_AARSAK",
      "navn": "Annet",
      "kilde": "ANNET",
      "kanVelges": true
    },
    {
      "kode": "AVV_DOK",
      "kodeverk": "VENT_AARSAK",
      "navn": "Annen dokumentasjon",
      "kilde": "AVV_DOK",
      "kanVelges": true
    },
    {
      "kode": "FOR_TIDLIG_SOKNAD",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter pga for tidlig søknad",
      "kilde": "FOR_TIDLIG_SOKNAD",
      "kanVelges": false
    },
    {
      "kode": "VENTER_BEKREFT_ENDRET_UNGDOMSPROGRAMPERIODE",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter på svar fra deltaker om endring i ungdomsprogramperiode",
      "kilde": "VENTER_BEKREFT_ENDRET_UNGDOMSPROGRAMPERIODE",
      "kanVelges": false
    },
    {
      "kode": "VENTER_ETTERLYS_INNTEKT_UTTALELSE",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter på svar fra deltaker om avvik i registerinntekt",
      "kilde": "VENTER_ETTERLYS_INNTEKT_UTTALELSE",
      "kanVelges": false
    },
    {
      "kode": "VENTER_SVAR_TEAMS",
      "kodeverk": "VENT_AARSAK",
      "navn": "Sak meldt i Teams, venter på svar",
      "kilde": "VENTER_SVAR_TEAMS",
      "kanVelges": true
    },
    {
      "kode": "VENT_INNTEKT_RAPPORTERINGSFRIST",
      "kodeverk": "VENT_AARSAK",
      "navn": "Inntekt rapporteringsfrist",
      "kilde": "VENT_INNTEKT_RAPPORTERINGSFRIST",
      "kanVelges": false
    },
    {
      "kode": "VENT_TIDLIGERE_BEHANDLING",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter på iverksettelse av en tidligere behandling i denne saken",
      "kilde": "VENT_TIDLIGERE_BEHANDLING",
      "kanVelges": false
    },
    {
      "kode": "VENT_TILBAKEKREVING",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter på tilbakekrevingsbehandling",
      "kilde": "VENT_TILBAKEKREVING",
      "kanVelges": true
    },
    {
      "kode": "VENT_ØKONOMI",
      "kodeverk": "VENT_AARSAK",
      "navn": "Venter på økonomiløsningen",
      "kilde": "VENT_ØKONOMI",
      "kanVelges": false
    }
  ],
  "behandlingTyper": [
    {
      "kode": "-",
      "kodeverk": "BEHANDLING_TYPE",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "BT-002",
      "kodeverk": "BEHANDLING_TYPE",
      "navn": "Førstegangsbehandling",
      "kilde": "BT-002"
    },
    {
      "kode": "BT-004",
      "kodeverk": "BEHANDLING_TYPE",
      "navn": "Revurdering",
      "kilde": "BT-004"
    }
  ],
  "arbeidTyper": [
    {
      "kode": "ETTERLØNN_SLUTTPAKKE",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Etterlønn eller sluttpakke",
      "kilde": "ETTERLØNN_SLUTTPAKKE"
    },
    {
      "kode": "FRILANSER",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Frilanser, samlet aktivitet",
      "kilde": "FRILANSER"
    },
    {
      "kode": "LØNN_UNDER_UTDANNING",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Lønn under utdanning",
      "kilde": "LØNN_UNDER_UTDANNING"
    },
    {
      "kode": "MILITÆR_ELLER_SIVILTJENESTE",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Militær eller siviltjeneste",
      "kilde": "MILITÆR_ELLER_SIVILTJENESTE"
    },
    {
      "kode": "UTENLANDSK_ARBEIDSFORHOLD",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Arbeid i utlandet",
      "kilde": "UTENLANDSK_ARBEIDSFORHOLD"
    },
    {
      "kode": "VENTELØNN_VARTPENGER",
      "kodeverk": "ARBEID_TYPE",
      "navn": "Ventelønn eller vartpenger",
      "kilde": "VENTELØNN_VARTPENGER"
    }
  ],
  "revurderingVarslingÅrsaker": [
    {
      "kode": "AKTIVITET",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Mors aktivitetskrav er ikke oppfylt",
      "kilde": "AKTIVITET"
    },
    {
      "kode": "ANNET",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Annet",
      "kilde": "ANNET"
    },
    {
      "kode": "BARNIKKEREG",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Barn er ikke registrert i folkeregisteret",
      "kilde": "BARNIKKEREG"
    },
    {
      "kode": "IKKEOPPHOLD",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Ikke lovlig opphold",
      "kilde": "IKKEOPPHOLD"
    },
    {
      "kode": "IKKEOPPTJENT",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Beregningsgrunnlaget er under 1/2 G",
      "kilde": "IKKEOPPTJENT"
    },
    {
      "kode": "JOBB6MND",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Opptjeningsvilkår ikke oppfylt",
      "kilde": "JOBB6MND"
    },
    {
      "kode": "JOBBFULLTID",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Arbeid i stønadsperioden",
      "kilde": "JOBBFULLTID"
    },
    {
      "kode": "JOBBUTLAND",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Arbeid i utlandet",
      "kilde": "JOBBUTLAND"
    },
    {
      "kode": "UTVANDRET",
      "kodeverk": "REVURDERING_VARSLING_AARSAK",
      "navn": "Bruker er registrert utvandret",
      "kilde": "UTVANDRET"
    }
  ],
  "fagsystemer": [
    {
      "kode": "-",
      "kodeverk": "FAGSYSTEM",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "AAREGISTERET",
      "kodeverk": "FAGSYSTEM",
      "navn": "AAregisteret",
      "kilde": "AAREGISTERET"
    },
    {
      "kode": "ARENA",
      "kodeverk": "FAGSYSTEM",
      "navn": "Arena",
      "kilde": "ARENA"
    },
    {
      "kode": "ENHETSREGISTERET",
      "kodeverk": "FAGSYSTEM",
      "navn": "Enhetsregisteret",
      "kilde": "ENHETSREGISTERET"
    },
    {
      "kode": "FPSAK",
      "kodeverk": "FAGSYSTEM",
      "navn": "Vedtaksløsning Foreldrepenger",
      "kilde": "FPSAK"
    },
    {
      "kode": "GOSYS",
      "kodeverk": "FAGSYSTEM",
      "navn": "Gosys",
      "kilde": "GOSYS"
    },
    {
      "kode": "INFOTRYGD",
      "kodeverk": "FAGSYSTEM",
      "navn": "Infotrygd",
      "kilde": "INFOTRYGD"
    },
    {
      "kode": "INNTEKT",
      "kodeverk": "FAGSYSTEM",
      "navn": "INNTEKT",
      "kilde": "INNTEKT"
    },
    {
      "kode": "JOARK",
      "kodeverk": "FAGSYSTEM",
      "navn": "Joark",
      "kilde": "JOARK"
    },
    {
      "kode": "K9SAK",
      "kodeverk": "FAGSYSTEM",
      "navn": "Vedtaksløsning K9 - Pleiepenger",
      "kilde": "K9SAK"
    },
    {
      "kode": "MEDL",
      "kodeverk": "FAGSYSTEM",
      "navn": "MEDL",
      "kilde": "MEDL"
    },
    {
      "kode": "TPS",
      "kodeverk": "FAGSYSTEM",
      "navn": "TPS",
      "kilde": "TPS"
    },
    {
      "kode": "UNG_SAK",
      "kodeverk": "FAGSYSTEM",
      "navn": "Vedtaksløsning Ungdomsprogramytelse",
      "kilde": "UNG_SAK"
    },
    {
      "kode": "VLSP",
      "kodeverk": "FAGSYSTEM",
      "navn": "Vedtaksløsning Sykepenger",
      "kilde": "VLSP"
    }
  ],
  "skjermlenkeTyper": [
    {
      "kode": "-",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "BEREGNING",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Beregning",
      "kilde": "BEREGNING"
    },
    {
      "kode": "FAKTA_OM_SIMULERING",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Simulering",
      "kilde": "FAKTA_OM_SIMULERING"
    },
    {
      "kode": "OPPLYSNINGSPLIKT",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Opplysningsplikt",
      "kilde": "OPPLYSNINGSPLIKT"
    },
    {
      "kode": "SOEKNADSFRIST",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Søknadsfrist",
      "kilde": "SOEKNADSFRIST"
    },
    {
      "kode": "TILKJENT_YTELSE",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Tilkjent ytelse",
      "kilde": "TILKJENT_YTELSE"
    },
    {
      "kode": "VEDTAK",
      "kodeverk": "SKJERMLENKE_TYPE",
      "navn": "Vedtak",
      "kilde": "VEDTAK"
    }
  ],
  "historikkAktører": [
    {
      "kode": "-",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "ARBEIDSGIVER",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Arbeidsgiver",
      "kilde": "ARBEIDSGIVER"
    },
    {
      "kode": "BESL",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Beslutter",
      "kilde": "BESL"
    },
    {
      "kode": "SBH",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Saksbehandler",
      "kilde": "SBH"
    },
    {
      "kode": "SOKER",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Søker",
      "kilde": "SOKER"
    },
    {
      "kode": "VL",
      "kodeverk": "HISTORIKK_AKTOER",
      "navn": "Vedtaksløsningen",
      "kilde": "VL"
    }
  ],
  "behandlingStatuser": [
    {
      "kode": "AVSLU",
      "kodeverk": "BEHANDLING_STATUS",
      "navn": "Avsluttet",
      "kilde": "AVSLU"
    },
    {
      "kode": "FVED",
      "kodeverk": "BEHANDLING_STATUS",
      "navn": "Fatter vedtak",
      "kilde": "FVED"
    },
    {
      "kode": "IVED",
      "kodeverk": "BEHANDLING_STATUS",
      "navn": "Iverksetter vedtak",
      "kilde": "IVED"
    },
    {
      "kode": "OPPRE",
      "kodeverk": "BEHANDLING_STATUS",
      "navn": "Opprettet",
      "kilde": "OPPRE"
    },
    {
      "kode": "UTRED",
      "kodeverk": "BEHANDLING_STATUS",
      "navn": "Behandling utredes",
      "kilde": "UTRED"
    }
  ],
  "avslagsårsaker": [
    {
      "kode": "-",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "1007",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Søkt for sent",
      "kilde": "1007"
    },
    {
      "kode": "1019",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Manglende dokumentasjon",
      "kilde": "1019"
    },
    {
      "kode": "1089",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Søker er yngre enn minste tillate alder.",
      "kilde": "1089"
    },
    {
      "kode": "1090",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Søker er eldre enn høyeste tillate alder.",
      "kilde": "1090"
    },
    {
      "kode": "1091",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Søker har avgått med døden.",
      "kilde": "1091"
    },
    {
      "kode": "2001",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Opphørt ungdomsprogram",
      "kilde": "2001"
    },
    {
      "kode": "2002",
      "kodeverk": "AVSLAGSARSAK",
      "navn": "Endret start av ungdomsprogram",
      "kilde": "2002"
    }
  ],
  "vilkårTyper": [
    {
      "kode": "-",
      "kodeverk": "VILKAR_TYPE",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "UNG_VK_1",
      "kodeverk": "VILKAR_TYPE",
      "navn": "Aldersvilkåret",
      "kilde": "UNG_VK_1"
    },
    {
      "kode": "UNG_VK_2",
      "kodeverk": "VILKAR_TYPE",
      "navn": "Deltar i ungdomsprogrammet",
      "kilde": "UNG_VK_2"
    },
    {
      "kode": "UNG_VK_3",
      "kodeverk": "VILKAR_TYPE",
      "navn": "Søknadsfristvilkåret",
      "kilde": "UNG_VK_3"
    },
    {
      "kode": "UNG_VK_4",
      "kodeverk": "VILKAR_TYPE",
      "navn": "Søkers opplysningsplikt",
      "kilde": "UNG_VK_4"
    }
  ],
  "tilbakekrevingVidereBehandlinger": [
    {
      "kode": "-",
      "kodeverk": "TILBAKEKR_VIDERE_BEH",
      "navn": "Udefinert.",
      "kilde": "-"
    },
    {
      "kode": "TILBAKEKR_IGNORER",
      "kodeverk": "TILBAKEKR_VIDERE_BEH",
      "navn": "Feilutbetaling, avvent samordning",
      "kilde": "TILBAKEKR_IGNORER"
    },
    {
      "kode": "TILBAKEKR_INNTREKK",
      "kodeverk": "TILBAKEKR_VIDERE_BEH",
      "navn": "Feilutbetaling hvor inntrekk dekker hele beløpet",
      "kilde": "TILBAKEKR_INNTREKK"
    },
    {
      "kode": "TILBAKEKR_OPPDATER",
      "kodeverk": "TILBAKEKR_VIDERE_BEH",
      "navn": "Endringer vil oppdatere eksisterende feilutbetalte perioder og beløp.",
      "kilde": "TILBAKEKR_OPPDATER"
    },
    {
      "kode": "TILBAKEKR_OPPRETT",
      "kodeverk": "TILBAKEKR_VIDERE_BEH",
      "navn": "Feilutbetaling med tilbakekreving",
      "kilde": "TILBAKEKR_OPPRETT"
    }
  ],
  "vurderingsÅrsaker": [
    {
      "kode": "-",
      "kodeverk": "VURDER_AARSAK",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "ANNET",
      "kodeverk": "VURDER_AARSAK",
      "navn": "Annet",
      "kilde": "ANNET"
    },
    {
      "kode": "FEIL_FAKTA",
      "kodeverk": "VURDER_AARSAK",
      "navn": "Feil fakta",
      "kilde": "FEIL_FAKTA"
    },
    {
      "kode": "FEIL_LOV",
      "kodeverk": "VURDER_AARSAK",
      "navn": "Feil lovanvendelse",
      "kilde": "FEIL_LOV"
    },
    {
      "kode": "FEIL_REGEL",
      "kodeverk": "VURDER_AARSAK",
      "navn": "Feil regelforståelse",
      "kilde": "FEIL_REGEL"
    }
  ],
  "språkkoder": [
    {
      "kode": "-",
      "kodeverk": "SPRAAK_KODE",
      "navn": "-",
      "kilde": "-"
    },
    {
      "kode": "AA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AA",
      "kilde": "AA"
    },
    {
      "kode": "AB",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AB",
      "kilde": "AB"
    },
    {
      "kode": "AE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AE",
      "kilde": "AE"
    },
    {
      "kode": "AF",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AF",
      "kilde": "AF"
    },
    {
      "kode": "AK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AK",
      "kilde": "AK"
    },
    {
      "kode": "AM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AM",
      "kilde": "AM"
    },
    {
      "kode": "AN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AN",
      "kilde": "AN"
    },
    {
      "kode": "AR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AR",
      "kilde": "AR"
    },
    {
      "kode": "AS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AS",
      "kilde": "AS"
    },
    {
      "kode": "AV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AV",
      "kilde": "AV"
    },
    {
      "kode": "AY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AY",
      "kilde": "AY"
    },
    {
      "kode": "AZ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "AZ",
      "kilde": "AZ"
    },
    {
      "kode": "BA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BA",
      "kilde": "BA"
    },
    {
      "kode": "BE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BE",
      "kilde": "BE"
    },
    {
      "kode": "BG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BG",
      "kilde": "BG"
    },
    {
      "kode": "BH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BH",
      "kilde": "BH"
    },
    {
      "kode": "BI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BI",
      "kilde": "BI"
    },
    {
      "kode": "BM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BM",
      "kilde": "BM"
    },
    {
      "kode": "BN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BN",
      "kilde": "BN"
    },
    {
      "kode": "BO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BO",
      "kilde": "BO"
    },
    {
      "kode": "BR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BR",
      "kilde": "BR"
    },
    {
      "kode": "BS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "BS",
      "kilde": "BS"
    },
    {
      "kode": "CA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CA",
      "kilde": "CA"
    },
    {
      "kode": "CE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CE",
      "kilde": "CE"
    },
    {
      "kode": "CH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CH",
      "kilde": "CH"
    },
    {
      "kode": "CO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CO",
      "kilde": "CO"
    },
    {
      "kode": "CR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CR",
      "kilde": "CR"
    },
    {
      "kode": "CS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CS",
      "kilde": "CS"
    },
    {
      "kode": "CU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CU",
      "kilde": "CU"
    },
    {
      "kode": "CV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CV",
      "kilde": "CV"
    },
    {
      "kode": "CY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "CY",
      "kilde": "CY"
    },
    {
      "kode": "DA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "DA",
      "kilde": "DA"
    },
    {
      "kode": "DE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "DE",
      "kilde": "DE"
    },
    {
      "kode": "DV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "DV",
      "kilde": "DV"
    },
    {
      "kode": "DZ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "DZ",
      "kilde": "DZ"
    },
    {
      "kode": "EE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "EE",
      "kilde": "EE"
    },
    {
      "kode": "EL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "EL",
      "kilde": "EL"
    },
    {
      "kode": "EN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "EN",
      "kilde": "EN"
    },
    {
      "kode": "EO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "EO",
      "kilde": "EO"
    },
    {
      "kode": "ES",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ES",
      "kilde": "ES"
    },
    {
      "kode": "ET",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ET",
      "kilde": "ET"
    },
    {
      "kode": "EU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "EU",
      "kilde": "EU"
    },
    {
      "kode": "FA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FA",
      "kilde": "FA"
    },
    {
      "kode": "FF",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FF",
      "kilde": "FF"
    },
    {
      "kode": "FI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FI",
      "kilde": "FI"
    },
    {
      "kode": "FJ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FJ",
      "kilde": "FJ"
    },
    {
      "kode": "FO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FO",
      "kilde": "FO"
    },
    {
      "kode": "FR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FR",
      "kilde": "FR"
    },
    {
      "kode": "FY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "FY",
      "kilde": "FY"
    },
    {
      "kode": "GA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GA",
      "kilde": "GA"
    },
    {
      "kode": "GD",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GD",
      "kilde": "GD"
    },
    {
      "kode": "GL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GL",
      "kilde": "GL"
    },
    {
      "kode": "GN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GN",
      "kilde": "GN"
    },
    {
      "kode": "GU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GU",
      "kilde": "GU"
    },
    {
      "kode": "GV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "GV",
      "kilde": "GV"
    },
    {
      "kode": "HA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HA",
      "kilde": "HA"
    },
    {
      "kode": "HE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HE",
      "kilde": "HE"
    },
    {
      "kode": "HI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HI",
      "kilde": "HI"
    },
    {
      "kode": "HO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HO",
      "kilde": "HO"
    },
    {
      "kode": "HR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HR",
      "kilde": "HR"
    },
    {
      "kode": "HT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HT",
      "kilde": "HT"
    },
    {
      "kode": "HU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HU",
      "kilde": "HU"
    },
    {
      "kode": "HY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HY",
      "kilde": "HY"
    },
    {
      "kode": "HZ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "HZ",
      "kilde": "HZ"
    },
    {
      "kode": "IA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IA",
      "kilde": "IA"
    },
    {
      "kode": "ID",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ID",
      "kilde": "ID"
    },
    {
      "kode": "IE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IE",
      "kilde": "IE"
    },
    {
      "kode": "IG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IG",
      "kilde": "IG"
    },
    {
      "kode": "II",
      "kodeverk": "SPRAAK_KODE",
      "navn": "II",
      "kilde": "II"
    },
    {
      "kode": "IK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IK",
      "kilde": "IK"
    },
    {
      "kode": "IN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IN",
      "kilde": "IN"
    },
    {
      "kode": "IO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IO",
      "kilde": "IO"
    },
    {
      "kode": "IS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IS",
      "kilde": "IS"
    },
    {
      "kode": "IT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IT",
      "kilde": "IT"
    },
    {
      "kode": "IU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IU",
      "kilde": "IU"
    },
    {
      "kode": "IW",
      "kodeverk": "SPRAAK_KODE",
      "navn": "IW",
      "kilde": "IW"
    },
    {
      "kode": "JA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "JA",
      "kilde": "JA"
    },
    {
      "kode": "JI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "JI",
      "kilde": "JI"
    },
    {
      "kode": "JV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "JV",
      "kilde": "JV"
    },
    {
      "kode": "KA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KA",
      "kilde": "KA"
    },
    {
      "kode": "KG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KG",
      "kilde": "KG"
    },
    {
      "kode": "KI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KI",
      "kilde": "KI"
    },
    {
      "kode": "KJ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KJ",
      "kilde": "KJ"
    },
    {
      "kode": "KK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KK",
      "kilde": "KK"
    },
    {
      "kode": "KL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KL",
      "kilde": "KL"
    },
    {
      "kode": "KM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KM",
      "kilde": "KM"
    },
    {
      "kode": "KN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KN",
      "kilde": "KN"
    },
    {
      "kode": "KO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KO",
      "kilde": "KO"
    },
    {
      "kode": "KR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KR",
      "kilde": "KR"
    },
    {
      "kode": "KS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KS",
      "kilde": "KS"
    },
    {
      "kode": "KU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KU",
      "kilde": "KU"
    },
    {
      "kode": "KV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KV",
      "kilde": "KV"
    },
    {
      "kode": "KW",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KW",
      "kilde": "KW"
    },
    {
      "kode": "KY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "KY",
      "kilde": "KY"
    },
    {
      "kode": "LA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LA",
      "kilde": "LA"
    },
    {
      "kode": "LB",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LB",
      "kilde": "LB"
    },
    {
      "kode": "LG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LG",
      "kilde": "LG"
    },
    {
      "kode": "LI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LI",
      "kilde": "LI"
    },
    {
      "kode": "LN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LN",
      "kilde": "LN"
    },
    {
      "kode": "LO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LO",
      "kilde": "LO"
    },
    {
      "kode": "LT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LT",
      "kilde": "LT"
    },
    {
      "kode": "LU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LU",
      "kilde": "LU"
    },
    {
      "kode": "LV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "LV",
      "kilde": "LV"
    },
    {
      "kode": "MG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MG",
      "kilde": "MG"
    },
    {
      "kode": "MH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MH",
      "kilde": "MH"
    },
    {
      "kode": "MI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MI",
      "kilde": "MI"
    },
    {
      "kode": "MK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MK",
      "kilde": "MK"
    },
    {
      "kode": "ML",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ML",
      "kilde": "ML"
    },
    {
      "kode": "MN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MN",
      "kilde": "MN"
    },
    {
      "kode": "MO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MO",
      "kilde": "MO"
    },
    {
      "kode": "MR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MR",
      "kilde": "MR"
    },
    {
      "kode": "MS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MS",
      "kilde": "MS"
    },
    {
      "kode": "MT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MT",
      "kilde": "MT"
    },
    {
      "kode": "MY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "MY",
      "kilde": "MY"
    },
    {
      "kode": "NA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NA",
      "kilde": "NA"
    },
    {
      "kode": "NB",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NB",
      "kilde": "NB"
    },
    {
      "kode": "ND",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ND",
      "kilde": "ND"
    },
    {
      "kode": "NE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NE",
      "kilde": "NE"
    },
    {
      "kode": "NG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NG",
      "kilde": "NG"
    },
    {
      "kode": "NL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NL",
      "kilde": "NL"
    },
    {
      "kode": "NN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NN",
      "kilde": "NN"
    },
    {
      "kode": "NO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NO",
      "kilde": "NO"
    },
    {
      "kode": "NR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NR",
      "kilde": "NR"
    },
    {
      "kode": "NV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NV",
      "kilde": "NV"
    },
    {
      "kode": "NY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "NY",
      "kilde": "NY"
    },
    {
      "kode": "OC",
      "kodeverk": "SPRAAK_KODE",
      "navn": "OC",
      "kilde": "OC"
    },
    {
      "kode": "OJ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "OJ",
      "kilde": "OJ"
    },
    {
      "kode": "OM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "OM",
      "kilde": "OM"
    },
    {
      "kode": "OR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "OR",
      "kilde": "OR"
    },
    {
      "kode": "OS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "OS",
      "kilde": "OS"
    },
    {
      "kode": "PA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "PA",
      "kilde": "PA"
    },
    {
      "kode": "PI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "PI",
      "kilde": "PI"
    },
    {
      "kode": "PL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "PL",
      "kilde": "PL"
    },
    {
      "kode": "PS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "PS",
      "kilde": "PS"
    },
    {
      "kode": "PT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "PT",
      "kilde": "PT"
    },
    {
      "kode": "QU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "QU",
      "kilde": "QU"
    },
    {
      "kode": "RM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "RM",
      "kilde": "RM"
    },
    {
      "kode": "RN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "RN",
      "kilde": "RN"
    },
    {
      "kode": "RO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "RO",
      "kilde": "RO"
    },
    {
      "kode": "RU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "RU",
      "kilde": "RU"
    },
    {
      "kode": "RW",
      "kodeverk": "SPRAAK_KODE",
      "navn": "RW",
      "kilde": "RW"
    },
    {
      "kode": "SA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SA",
      "kilde": "SA"
    },
    {
      "kode": "SC",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SC",
      "kilde": "SC"
    },
    {
      "kode": "SD",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SD",
      "kilde": "SD"
    },
    {
      "kode": "SE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SE",
      "kilde": "SE"
    },
    {
      "kode": "SG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SG",
      "kilde": "SG"
    },
    {
      "kode": "SI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SI",
      "kilde": "SI"
    },
    {
      "kode": "SK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SK",
      "kilde": "SK"
    },
    {
      "kode": "SL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SL",
      "kilde": "SL"
    },
    {
      "kode": "SM",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SM",
      "kilde": "SM"
    },
    {
      "kode": "SN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SN",
      "kilde": "SN"
    },
    {
      "kode": "SO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SO",
      "kilde": "SO"
    },
    {
      "kode": "SQ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SQ",
      "kilde": "SQ"
    },
    {
      "kode": "SR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SR",
      "kilde": "SR"
    },
    {
      "kode": "SS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SS",
      "kilde": "SS"
    },
    {
      "kode": "ST",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ST",
      "kilde": "ST"
    },
    {
      "kode": "SU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SU",
      "kilde": "SU"
    },
    {
      "kode": "SV",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SV",
      "kilde": "SV"
    },
    {
      "kode": "SW",
      "kodeverk": "SPRAAK_KODE",
      "navn": "SW",
      "kilde": "SW"
    },
    {
      "kode": "TA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TA",
      "kilde": "TA"
    },
    {
      "kode": "TE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TE",
      "kilde": "TE"
    },
    {
      "kode": "TG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TG",
      "kilde": "TG"
    },
    {
      "kode": "TH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TH",
      "kilde": "TH"
    },
    {
      "kode": "TI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TI",
      "kilde": "TI"
    },
    {
      "kode": "TK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TK",
      "kilde": "TK"
    },
    {
      "kode": "TL",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TL",
      "kilde": "TL"
    },
    {
      "kode": "TN",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TN",
      "kilde": "TN"
    },
    {
      "kode": "TO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TO",
      "kilde": "TO"
    },
    {
      "kode": "TR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TR",
      "kilde": "TR"
    },
    {
      "kode": "TS",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TS",
      "kilde": "TS"
    },
    {
      "kode": "TT",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TT",
      "kilde": "TT"
    },
    {
      "kode": "TW",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TW",
      "kilde": "TW"
    },
    {
      "kode": "TY",
      "kodeverk": "SPRAAK_KODE",
      "navn": "TY",
      "kilde": "TY"
    },
    {
      "kode": "UG",
      "kodeverk": "SPRAAK_KODE",
      "navn": "UG",
      "kilde": "UG"
    },
    {
      "kode": "UK",
      "kodeverk": "SPRAAK_KODE",
      "navn": "UK",
      "kilde": "UK"
    },
    {
      "kode": "UR",
      "kodeverk": "SPRAAK_KODE",
      "navn": "UR",
      "kilde": "UR"
    },
    {
      "kode": "UZ",
      "kodeverk": "SPRAAK_KODE",
      "navn": "UZ",
      "kilde": "UZ"
    },
    {
      "kode": "VE",
      "kodeverk": "SPRAAK_KODE",
      "navn": "VE",
      "kilde": "VE"
    },
    {
      "kode": "VI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "VI",
      "kilde": "VI"
    },
    {
      "kode": "VO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "VO",
      "kilde": "VO"
    },
    {
      "kode": "WA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "WA",
      "kilde": "WA"
    },
    {
      "kode": "WO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "WO",
      "kilde": "WO"
    },
    {
      "kode": "XH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "XH",
      "kilde": "XH"
    },
    {
      "kode": "YI",
      "kodeverk": "SPRAAK_KODE",
      "navn": "YI",
      "kilde": "YI"
    },
    {
      "kode": "YO",
      "kodeverk": "SPRAAK_KODE",
      "navn": "YO",
      "kilde": "YO"
    },
    {
      "kode": "ZA",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ZA",
      "kilde": "ZA"
    },
    {
      "kode": "ZH",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ZH",
      "kilde": "ZH"
    },
    {
      "kode": "ZU",
      "kodeverk": "SPRAAK_KODE",
      "navn": "ZU",
      "kilde": "ZU"
    }
  ],
  "vedtakResultatTyper": [
    {
      "kode": "-",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "Ikke definert",
      "kilde": "-"
    },
    {
      "kode": "AVSLAG",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "Avslag",
      "kilde": "AVSLAG"
    },
    {
      "kode": "DELVIS_INNVILGET",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "delvis innvilget",
      "kilde": "DELVIS_INNVILGET"
    },
    {
      "kode": "INNVILGET",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "Innvilget",
      "kilde": "INNVILGET"
    },
    {
      "kode": "OPPHØR",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "Opphør",
      "kilde": "OPPHØR"
    },
    {
      "kode": "VEDTAK_I_ANKEBEHANDLING",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "vedtak i ankebehandling",
      "kilde": "VEDTAK_I_ANKEBEHANDLING"
    },
    {
      "kode": "VEDTAK_I_INNSYNBEHANDLING",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "vedtak i innsynbehandling",
      "kilde": "VEDTAK_I_INNSYNBEHANDLING"
    },
    {
      "kode": "VEDTAK_I_KLAGEBEHANDLING",
      "kodeverk": "VEDTAK_RESULTAT_TYPE",
      "navn": "vedtak i klagebehandling",
      "kilde": "VEDTAK_I_KLAGEBEHANDLING"
    }
  ],
  "årsakerTilVurdering": [
    {
      "kode": "ENDRET_STARTDATO_UNGDOMSPROGRAM",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Endret startdato for ungdomsprogram",
      "kilde": "ENDRET_STARTDATO_UNGDOMSPROGRAM"
    },
    {
      "kode": "FØRSTEGANGSVURDERING",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Ny periode",
      "kilde": "FØRSTEGANGSVURDERING"
    },
    {
      "kode": "G_REGULERING",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "G-regulering",
      "kilde": "G_REGULERING"
    },
    {
      "kode": "HENDELSE_DØD_BARN",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Dødsfall barn",
      "kilde": "HENDELSE_DØD_BARN"
    },
    {
      "kode": "HENDELSE_DØD_BRUKER",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Dødsfall deltaker",
      "kilde": "HENDELSE_DØD_BRUKER"
    },
    {
      "kode": "HENDELSE_FØDSEL_BARN",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Fødsel barn",
      "kilde": "HENDELSE_FØDSEL_BARN"
    },
    {
      "kode": "KONTROLL_AV_INNTEKT",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Kontroll og rapportering av inntekt",
      "kilde": "KONTROLL_AV_INNTEKT"
    },
    {
      "kode": "OPPHØR_UNGDOMSPROGRAM",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Opphør av ungdomsprogram",
      "kilde": "OPPHØR_UNGDOMSPROGRAM"
    },
    {
      "kode": "OVERGANG_HØY_SATS",
      "kodeverk": "ÅRSAK_TIL_VURDERING",
      "navn": "Overgang til høy sats",
      "kilde": "OVERGANG_HØY_SATS"
    }
  ],
  "avslagårsakerPrVilkårTypeKode": {
    "-": [],
    "UNG_VK_1": [
      {
        "kode": "1089",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Søker er yngre enn minste tillate alder.",
        "kilde": "1089"
      },
      {
        "kode": "1090",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Søker er eldre enn høyeste tillate alder.",
        "kilde": "1090"
      }
    ],
    "UNG_VK_2": [
      {
        "kode": "2001",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Opphørt ungdomsprogram",
        "kilde": "2001"
      },
      {
        "kode": "2002",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Endret start av ungdomsprogram",
        "kilde": "2002"
      }
    ],
    "UNG_VK_3": [
      {
        "kode": "1007",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Søkt for sent",
        "kilde": "1007"
      }
    ],
    "UNG_VK_4": [
      {
        "kode": "1019",
        "kodeverk": "AVSLAGSARSAK",
        "navn": "Manglende dokumentasjon",
        "kilde": "1019"
      }
    ]
  }
} satisfies AlleKodeverdierSomObjektResponse
