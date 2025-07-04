// @TODO kodeverk_i_frontend
const historikkEndretFeltTypeCodes = {
  ADOPSJONSVILKARET: {
    kode: 'ADOPSJONSVILKARET',
    feltId: 'HistorikkEndretFelt.Adopsjonsvilkaret',
  },
  ADOPTERER_ALENE: {
    kode: 'ADOPTERER_ALENE',
    feltId: 'HistorikkEndretFelt.AdoptererAlene',
  },
  AKTIVITET: {
    kode: 'AKTIVITET',
    feltId: 'HistorikkEndretFelt.Aktivitet',
  },
  AKTIVITET_PERIODE: {
    kode: 'AKTIVITET_PERIODE',
    feltId: 'HistorikkEndretFelt.AktivitetPeriode',
  },
  ALDERSVILKAR_BARN: {
    kode: 'ALDERSVILKAR_BARN',
    feltId: 'HistorikkEndretFelt.AldersvilkarBarn',
  },
  ALENE_OM_OMSORG: {
    kode: 'ALENE_OM_OMSORG',
    feltId: 'HistorikkEndretFelt.AleneOmOmsorgen',
  },
  ANTALL_BARN: {
    kode: 'ANTALL_BARN',
    feltId: 'HistorikkEndretFelt.AntallBarn',
  },
  AVKLARSAKSOPPLYSNINGER: {
    kode: 'AVKLARSAKSOPPLYSNINGER',
    feltId: 'HistorikkEndretFelt.Personstatus',
  },
  BEHANDLENDE_ENHET: {
    kode: 'BEHANDLENDE_ENHET',
    feltId: 'HistorikkEndretFelt.BehandlendeEnhet',
  },
  BEHANDLING: {
    kode: 'BEHANDLING',
    feltId: 'HistorikkEndretFelt.Behandling',
  },
  BRUK_ANTALL_I_SOKNAD: {
    kode: 'BRUK_ANTALL_I_SOKNAD',
    feltId: 'Historikk.Fodsel.BrukAntallISoknad',
  },
  BRUK_ANTALL_I_TPS: {
    kode: 'BRUK_ANTALL_I_TPS',
    feltId: 'Historikk.Fodsel.BrukAntallITPS',
  },
  BRUK_ANTALL_I_VEDTAKET: {
    kode: 'BRUK_ANTALL_I_VEDTAKET',
    feltId: 'Historikk.Fodsel.BrukAntallIYtelsesvedtaket',
  },
  BRUTTO_NAERINGSINNTEKT: {
    kode: 'BRUTTO_NAERINGSINNTEKT',
    feltId: 'HistorikkEndretFelt.FastsettSelvstendigNaeringForm.BruttoBerGr',
  },
  BRUTTO_INNTEKT_NYTT_INNTEKTSFORHOLD: {
    kode: 'BRUTTO_INNTEKT_NYTT_INNTEKTSFORHOLD',
    feltId: 'HistorikkEndretFelt.BruttoInntektNyttInntektsforhold',
  },
  DAGPENGER_INNTEKT: {
    kode: 'DAGPENGER_INNTEKT',
    feltId: 'HistorikkEndretFeltVerdiType.DagpengerInntekt',
  },
  DOKUMENTASJON_FORELIGGER: {
    kode: 'DOKUMENTASJON_FORELIGGER',
    feltId: 'Historikk.Fodsel.DokumentasjonForeligger',
  },
  DELVIS_REFUSJON_FØR_STARTDATO: {
    kode: 'DELVIS_REFUSJON_FØR_STARTDATO',
    feltId: 'HistorikkEndretFelt.DelvisRefusjonFørStart',
  },
  EKTEFELLES_BARN: {
    kode: 'EKTEFELLES_BARN',
    feltId: 'HistorikkEndretFelt.ApplicationInformation',
  },
  ENDRING_NAERING: {
    kode: 'ENDRING_NAERING',
    feltId: 'HistorikkEndretFelt.FastsettSelvstendigNaeringForm.EndringNæring',
  },
  ER_SOKER_BOSATT_I_NORGE: {
    kode: 'ER_SOKER_BOSATT_I_NORGE',
    feltId: 'HistorikkEndretFelt.ErSokerBosattINorge',
  },
  FODSELSVILKARET: {
    kode: 'FODSELSVILKARET',
    feltId: 'HistorikkEndretFelt.Fodselsvilkaret',
  },
  FODSELSDATO: {
    kode: 'FODSELSDATO',
    feltId: 'Historikk.Fodsel.Fodselsdato',
  },
  FORELDREANSVARSVILKARET: {
    kode: 'FORELDREANSVARSVILKARET',
    feltId: 'HistorikkEndretFelt.Foreldreansvarsvilkaret',
  },
  FORDELING_FOR_ANDEL: {
    kode: 'FORDELING_FOR_ANDEL',
    feltId: 'HistorikkEndretFelt.FordelingForAndel',
  },
  FORDELING_FOR_NY_ANDEL: {
    kode: 'FORDELING_FOR_NY_ANDEL',
    feltId: 'HistorikkEndretFelt.FordelingForNyAndel',
  },
  FRILANS_INNTEKT: {
    kode: 'FRILANS_INNTEKT',
    feltId: 'HistorikkEndretFelt.AarsinntektPanel.Frilansinntekt',
  },
  FRILANSVIRKSOMHET: {
    kode: 'FRILANSVIRKSOMHET',
    feltId: 'HistorikkEndretFelt.Frilansvirksomhet',
  },
  GYLDIG_MEDLEM_FOLKETRYGDEN: {
    kode: 'GYLDIG_MEDLEM_FOLKETRYGDEN',
    feltId: 'HistorikkEndretFelt.GyldigMedlemFolketrygden',
  },
  INNTEKT: {
    kode: 'INNTEKT',
    feltId: 'HistorikkEndretFelt.Inntekt',
  },
  INNTEKT_FRA_ARBEIDSFORHOLD: {
    kode: 'INNTEKT_FRA_ARBEIDSFORHOLD',
    feltId: 'HistorikkEndretFelt.InntektFraArbeidsforhold',
  },
  INNTEKTSKATEGORI: {
    kode: 'INNTEKTSKATEGORI',
    feltId: 'HistorikkEndretFelt.Inntektskategori',
  },
  INNTEKTSKATEGORI_FOR_ANDEL: {
    kode: 'INNTEKTSKATEGORI_FOR_ANDEL',
    feltId: 'HistorikkEndretFelt.InnktektskategoriForAndel',
  },
  LØNNSENDRING_I_PERIODEN: {
    kode: 'LØNNSENDRING_I_PERIODEN',
    feltId: 'HistorikkEndretFelt.LønnsendringIPerioden',
  },
  MANN_ADOPTERER: {
    kode: 'MANN_ADOPTERER',
    feltId: 'HistorikkEndretFelt.MannAdoptererAleneFaktaForm.ApplicationInformation',
  },
  MIDLERTIDIG_ALENE: {
    kode: 'MIDLERTIDIG_ALENE',
    feltId: 'HistorikkEndretFelt.UtvidetRett',
  },
  MOTTAR_YTELSE_ARBEID: {
    kode: 'MOTTAR_YTELSE_ARBEID',
    feltId: 'HistorikkEndretFelt.MottarYtelseForArbeid',
  },
  MOTTAR_YTELSE_FRILANS: {
    kode: 'MOTTAR_YTELSE_FRILANS',
    feltId: 'HistorikkEndretFelt.MottarYtelseForFrilans',
  },
  NY_AKTIVITET: {
    kode: 'NY_AKTIVITET',
    feltId: 'HistorikkEndretFelt.NyAktivitetFor',
  },
  NY_FORDELING: {
    kode: 'NY_FORDELING',
    feltId: 'HistorikkEndretFelt.NyFordelingFor',
  },
  NY_STARTDATO_REFUSJON: {
    kode: 'NY_STARTDATO_REFUSJON',
    feltId: 'HistorikkEndretFelt.NyStartdatoRefusjon',
  },
  NYTT_REFUSJONSKRAV: {
    kode: 'NYTT_REFUSJONSKRAV',
    feltId: 'HistorikkEndretFelt.NyttRefusjonskrav',
  },
  OPPHOER_REFUSJON: {
    kode: 'OPPHOER_REFUSJON',
    feltId: 'HistorikkEndretFelt.OpphoerRefusjon',
  },
  OMSORGSVILKAR: {
    kode: 'OMSORGSVILKAR',
    feltId: 'HistorikkEndretFelt.ApplicationInformation',
  },
  OMSORG_FOR: {
    kode: 'OMSORG_FOR',
    feltId: 'HistorikkEndretFelt.OmsorgenFor',
  },
  OPPHOLDSRETT_EOS: {
    kode: 'OPPHOLDSRETT_EOS',
    feltId: 'HistorikkEndretFelt.Oppholdsrett',
  },
  OPPHOLDSRETT_IKKE_EOS: {
    kode: 'OPPHOLDSRETT_IKKE_EOS',
    feltId: 'HistorikkEndretFelt.LovligOpphold',
  },
  OPPTJENINGSVILKARET: {
    kode: 'OPPTJENINGSVILKARET',
    feltId: 'HistorikkEndretFelt.Opptjeningsvilkaret',
  },
  ORGANISASJONSNUMMER: {
    kode: 'ORGANISASJONSNUMMER',
    feltId: 'HistorikkEndretFelt.Organisasjonsnummer',
  },
  OVERSTYRT_BEREGNING: {
    kode: 'OVERSTYRT_BEREGNING',
    feltId: 'Historikk.Template.7.OverstyrtBeregning',
  },
  FJERNET_OVERSTYRING: {
    kode: 'FJERNET_OVERSTYRING',
    feltId: 'Historikk.Template.7.AvbruttOverstyring',
  },
  OVERSTYRT_VURDERING: {
    kode: 'OVERSTYRT_VURDERING',
    feltId: 'Historikk.Template.7.OverstyrtVilkar',
  },
  SELVSTENDIG_NAERINGSDRIVENDE: {
    kode: 'SELVSTENDIG_NAERINGSDRIVENDE',
    feltId: 'HistorikkEndretFelt.SelvstendigNæringsdrivende',
  },
  SOKERSOPPLYSNINGSPLIKT: {
    kode: 'SOKERSOPPLYSNINGSPLIKT',
    feltId: 'Historikk.SokersOpplysningsplikt',
  },
  SOKNADSFRIST: {
    kode: 'SOKNADSFRIST',
    feltId: 'HistorikkEndretFelt.ErSoknadsfristVilkaretOppfyltForm.ApplicationInformation',
  },
  STARTDATO_FRA_SOKNAD: {
    kode: 'STARTDATO_FRA_SOKNAD',
    feltId: 'HistorikkEndretFelt.StartdatoFraSoknad',
  },
  TERMINDATO: {
    kode: 'TERMINDATO',
    feltId: 'HistorikkEndretFelt.Termindato',
  },
  UTSTEDTDATO: {
    kode: 'UTSTEDTDATO',
    feltId: 'HistorikkEndretFelt.UtstedtDato',
  },
  UTTAK_OVERSTYRT_PERIODE: {
    kode: 'UTTAK_OVERSTYRT_PERIODE',
    feltId: 'HistorikkEndretFelt.uttakOverstyrtPeriode',
  },
  UTTAK_OVERSTYRT_SØKERS_UTTAKSGRAD: {
    kode: 'UTTAK_OVERSTYRT_SØKERS_UTTAKSGRAD',
    feltId: 'HistorikkEndretFelt.uttakOverstyrtSokersUttaksgrad',
  },
  UTTAK_OVERSTYRT_UTBETALINGSGRAD: {
    kode: 'UTTAK_OVERSTYRT_UTBETALINGSGRAD',
    feltId: 'HistorikkEndretFelt.uttakOverstyrtUtbetalingsgrad',
  },
  UTVIDETRETT: {
    kode: 'UTVIDETRETT',
    feltId: 'HistorikkEndretFelt.UtvidetRett',
  },
  VILKAR_SOM_ANVENDES: {
    kode: 'VILKAR_SOM_ANVENDES',
    feltId: 'Historikk.Anvendes',
  },
  VURDER_NYTT_INNTEKTSFORHOLD: {
    kode: 'VURDER_NYTT_INNTEKTSFORHOLD',
    feltId: 'HistorikkEndretFelt.VurderNyttInntektsforhold',
  },
  OMSORG: {
    kode: 'OMSORG',
    feltId: 'HistorikkEndretFelt.Omsorg',
  },
  ALENEOMSORG: {
    kode: 'ALENEOMSORG',
    feltId: 'HistorikkEndretFelt.Aleneomsorg',
  },
  IKKE_OMSORG_PERIODEN: {
    kode: 'IKKE_OMSORG_PERIODEN',
    feltId: 'HistorikkEndretFelt.IkkeOmsorgPerioden',
  },
  MOTTATT_DATO: {
    kode: 'MOTTATT_DATO',
    feltId: 'HistorikkEndretFelt.NyMottattDato',
  },
  FASTSETT_RESULTAT_PERIODEN: {
    kode: 'FASTSETT_RESULTAT_PERIODEN',
    feltId: 'HistorikkEndretFelt.FastsettResultat',
  },
  AVKLART_PERIODE: {
    kode: 'AVKLART_PERIODE',
    feltId: 'HistorikkEndretFelt.AvklartPeriode',
  },
  ANDEL_ARBEID: {
    kode: 'ANDEL_ARBEID',
    feltId: 'HistorikkEndretFelt.AndelArbeid',
  },
  ENDRING_TIDSBEGRENSET_ARBEIDSFORHOLD: {
    kode: 'ENDRING_TIDSBEGRENSET_ARBEIDSFORHOLD',
    feltId: 'HistorikkEndretFelt.TidsbegrensetArbeidsforhold',
  },
  RETT_TIL_FORELDREPENGER: {
    kode: 'RETT_TIL_FORELDREPENGER',
    feltId: 'HistorikkEndretFelt.RettTilForeldrepenger',
  },
  UTTAK_TREKKDAGER: {
    kode: 'UTTAK_TREKKDAGER',
    feltId: 'HistorikkEndretFelt.UttakTrekkdager',
  },
  UTTAK_SAMTIDIG_UTTAK: {
    kode: 'UTTAK_SAMTIDIG_UTTAK ',
    feltId: 'HistorikkEndretFelt.SamtidigUttak',
  },
  UTTAK_TREKKDAGER_FLERBARN_KVOTE: {
    kode: 'UTTAK_TREKKDAGER_FLERBARN_KVOTE',
    feltId: 'HistorikkEndretFelt.Flerbarnsdager',
  },
  UTTAK_PERIODE_RESULTAT_TYPE: {
    kode: 'UTTAK_PERIODE_RESULTAT_TYPE',
    feltId: 'HistorikkEndretFelt.UttakPeriodeType',
  },
  UTTAK_PERIODE_RESULTAT_ÅRSAK: {
    kode: 'UTTAK_PERIODE_RESULTAT_ÅRSAK',
    feltId: 'HistorikkEndretFelt.resultatÅrsak',
  },
  UTTAK_GRADERING_ARBEIDSFORHOLD: {
    kode: 'UTTAK_GRADERING_ARBEIDSFORHOLD',
    feltId: 'HistorikkEndretFelt.GraderingArbeidsforhold',
  },
  UTTAK_GRADERING_AVSLAG_ÅRSAK: {
    kode: 'UTTAK_GRADERING_AVSLAG_ÅRSAK',
    feltId: 'HistorikkEndretFelt.GraderingAvslagÅrsak',
  },
  UTTAK_SPLITT_TIDSPERIODE: {
    kode: 'UTTAK_SPLITT_TIDSPERIODE',
    feltId: 'HistorikkEndretFelt.SplittPerioden',
  },
  UTTAK_PROSENT_UTBETALING: {
    kode: 'UTTAK_PROSENT_UTBETALING',
    feltId: 'HistorikkEndretFelt.UttakProsentUtbetaling',
  },
  UTTAK_STØNADSKONTOTYPE: {
    kode: 'UTTAK_STØNADSKONTOTYPE',
    feltId: 'HistorikkEndretFelt.Stonadskonto',
  },
  SYKDOM: {
    kode: 'SYKDOM',
    feltId: 'HistorikkEndretFelt.Sykdom',
  },
  ARBEIDSFORHOLD: {
    kode: 'ARBEIDSFORHOLD',
    feltId: 'HistorikkEndretFelt.Arbeidsforhold',
  },
  NAVN: {
    kode: 'NAVN',
    feltId: 'HistorikkEndretFelt.Navn',
  },
  FNR: {
    kode: 'FNR',
    feltId: 'HistorikkEndretFelt.FodselsNummer',
  },
  PERIODE_FOM: {
    kode: 'PERIODE_FOM',
    feltId: 'HistorikkEndretFelt.PeriodeFOM',
  },
  PERIODE_TOM: {
    kode: 'PERIODE_TOM',
    feltId: 'HistorikkEndretFelt.PeriodeTOM',
  },
  MANDAT: {
    kode: 'MANDAT',
    feltId: 'HistorikkEndretFelt.Mandat',
  },
  KONTAKTPERSON: {
    kode: 'KONTAKTPERSON',
    feltId: 'HistorikkEndretFelt.KontaktPerson',
  },
  BRUKER_TVUNGEN: {
    kode: 'BRUKER_TVUNGEN',
    feltId: 'HistorikkEndretFelt.BrukerErUnderTvungenForvaltning',
  },
  TYPE_VERGE: {
    kode: 'TYPE_VERGE',
    feltId: 'HistorikkEndretFelt.TypeVerge',
  },
  KLAGE_RESULTAT_NFP: {
    kode: 'KLAGE_RESULTAT_NFP',
    feltId: 'HistorikkEndretFelt.KlageResultatNFP',
  },
  KLAGE_RESULTAT_KA: {
    kode: 'KLAGE_RESULTAT_KA',
    feltId: 'HistorikkEndretFelt.KlageResultatKA',
  },
  KLAGE_OMGJØR_ÅRSAK: {
    kode: 'KLAGE_OMGJØR_ÅRSAK',
    feltId: 'HistorikkEndretFelt.KlageOmgjoerAarsak',
  },
  ER_KLAGER_PART: {
    kode: 'ER_KLAGER_PART',
    feltId: 'HistorikkEndretFelt.ErKlagerPart',
  },
  ER_KLAGE_KONKRET: {
    kode: 'ER_KLAGER_PART',
    feltId: 'HistorikkEndretFelt.ErKlageKonkret',
  },
  ER_KLAGEFRIST_OVERHOLDT: {
    kode: 'ER_KLAGER_PART',
    feltId: 'HistorikkEndretFelt.ErKlagefristOverholdt',
  },
  ER_KLAGEN_SIGNERT: {
    kode: 'ER_KLAGER_PART',
    feltId: 'HistorikkEndretFelt.ErKlageSignert',
  },
  PA_KLAGD_BEHANDLINGID: {
    kode: 'ER_KLAGER_PART',
    feltId: 'HistorikkEndretFelt.PaKlagdBehandlingId',
  },
  ANKE_OMGJØR_ÅRSAK: {
    kode: 'ANKE_OMGJØR_ÅRSAK',
    feltId: 'HistorikkEndretFelt.AnkeOmgjoerAarsak',
  },
  ANKE_AVVIST_ÅRSAK: {
    kode: 'ANKE_AVVIST_ÅRSAK',
    feltId: 'HistorikkEndretFelt.AnkeAvvistAarsak',
  },
  ANKE_AVSLUTTET: {
    kode: 'ANKE_AVSLUTTET',
    feltId: 'HistorikkEndretFelt.AnkeAvsluttet',
  },
  PA_ANKET_BEHANDLINGID: {
    kode: 'PA_ANKET_BEHANDLINGID',
    feltId: 'HistorikkEndretFelt.PaKlagdBehandlingId',
  },
  VURDER_ETTERLØNN_SLUTTPAKKE: {
    kode: 'VURDER_ETTERLØNN_SLUTTPAKKE',
    feltId: 'HistorikkEndretFelt.VurderEtterlønnSluttpakke',
  },
  FASTSETT_ETTERLØNN_SLUTTPAKKE: {
    kode: 'FASTSETT_ETTERLØNN_SLUTTPAKKE',
    feltId: 'HistorikkEndretFelt.FastsettEtterlønnSluttpakke',
  },
  VURDER_GRADERING_PÅ_ANDEL_UTEN_BG: {
    kode: 'VURDER_GRADERING_PÅ_ANDEL_UTEN_BG',
    feltId: 'HistorikkEndretFelt.VurderGraderingPåAndelUtenBG',
  },
  FAKTA_OM_FEILUTBETALING_AARSAK: {
    kode: 'HENDELSE_AARSAK',
    verdiId: '',
  },
  FAKTA_OM_FEILUTBETALING_UNDERAARSAK: {
    kode: 'HENDELSE_UNDER_AARSAK',
    verdiId: '',
  },
  TILBAKETREKK: {
    kode: 'TILBAKETREKK',
    feltId: 'HistorikkEndretFelt.Tilbaketrekk',
  },
  UTLAND: {
    kode: 'UTLAND',
    feltId: 'HistorikkEndretFelt.Utland',
  },
  HEL_TILRETTELEGGING_FOM: {
    kode: 'HEL_TILRETTELEGGING_FOM',
    feltId: 'HistorikkEndretFelt.HelTilretteleggingFom',
  },
  DELVIS_TILRETTELEGGING_FOM: {
    kode: 'DELVIS_TILRETTELEGGING_FOM',
    feltId: 'HistorikkEndretFelt.DelvisTilretteleggingFom',
  },
  STILLINGSPROSENT: {
    kode: 'STILLINGSPROSENT',
    feltId: 'HistorikkEndretFelt.Stillingsprosent',
  },
  SLUTTE_ARBEID_FOM: {
    kode: 'SLUTTE_ARBEID_FOM',
    feltId: 'HistorikkEndretFelt.SlutteArbeidFom',
  },
  TILRETTELEGGING_BEHOV_FOM: {
    kode: 'TILRETTELEGGING_BEHOV_FOM',
    feltId: 'HistorikkEndretFelt.TilrettelseBehovFom',
  },
  SVANGERSKAPSPENGERVILKÅRET: {
    kode: 'SVANGERSKAPSPENGERVILKÅRET',
    feltId: 'HistorikkEndretFelt.Svangerskapsvilkåret',
  },
  FARESIGNALER: {
    kode: 'FARESIGNALER',
    feltId: 'HistorikkEndretFelt.Faresignaler',
  },
  MILITÆR_ELLER_SIVIL: {
    kode: 'MILITÆR_ELLER_SIVIL',
    feltId: 'HistorikkEndretFelt.MilitærEllerSiviltjeneste',
  },
  NY_REFUSJONSFRIST: {
    kode: 'NY_REFUSJONSFRIST',
    feltId: 'HistorikkEndretFelt.NyRefusjonsfrist',
  },
  VALG: {
    kode: 'VALG',
    feltId: 'HistorikkEndretFelt.Valg',
  },
  TILKJENT_YTELSE: {
    kode: 'TILKJENT_YTELSE',
    feltId: 'HistorikkEndretFelt.TilkjentYtelse',
  },
  KOMPLETTHET: {
    kode: 'KOMPLETTHET',
    feltId: 'HistorikkEndretFelt.Kompletthet',
  },
  UTTAK_FASTSATT_SØKERS_UTTAKSGRAD: {
    kode: 'UTTAK_FASTSATT_SØKERS_UTTAKSGRAD',
    feltId: 'HistorikkEndretFelt.uttakOverstyrtSokersUttaksgrad',
  },
  VIRKNINGSDATO_UTTAK_NYE_REGLER: {
    kode: 'VIRKNINGSDATO_UTTAK_NYE_REGLER',
    feltId: 'HistorikkEndretFelt.VirkningsdatoNyeRegler',
  },
  INSTITUSJON_GODKJENT: {
    kode: 'INSTITUSJON_GODKJENT',
    feltId: 'HistorikkEndretFelt.Institusjon',
  },
  ER_LANGVARIG_SYK: {
    kode: 'ER_LANGVARIG_SYK',
    feltId: 'HistorikkEndretFelt.LangvarigSyk',
  },
  VURDERT_OPPLÆRING_RESULTAT: {
    kode: 'VURDERT_OPPLÆRING_RESULTAT',
    feltId: 'HistorikkEndretFelt.OpplæringResultat',
  },
  GODKJENT_REISETID: {
    kode: 'GODKJENT_REISETID',
    feltId: 'HistorikkEndretFelt.GODKJENT_REISETID',
  },
};

export default historikkEndretFeltTypeCodes;
