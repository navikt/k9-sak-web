// @TODO kodeverk_i_frontend
const historikkEndretFeltVerdiTypeCodes = {
  '-': {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingenAvslagÅrsak',
  },
  4002: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingeStonadsDagarIgjen',
  },
  4005: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomStønadsperioder',
  },
  4011: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farForTidligSoktPeriode',
  },
  4020: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.bruddPaSoknadsfrist',
  },
  4022: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.barnOverTreÅr',
  },
  4012: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farHarIkkeOmsorg',
  },
  4003: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morHarIkkeOmsorg',
  },
  4001: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.mødrekvoteFørTerminFodsel',
  },
  4013: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSokerFellesPeriodeFørTolvUker',
  },
  4018: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.soktUttakForOmsorgsovertakelse',
  },
  4010: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farSøkerFørTerminFodsel',
  },
  4060: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.samtidligUttakIkkeGyldigKombinasjon',
  },
  4014: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSokerFellesPeriodeFørUkeSyv',
  },
  4007: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.andrePartSykSkadetIkkeOppfylt',
  },
  4008: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.andrePartInnleggelseIkkeOppfylt',
  },
  4033: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ikkeLovbestemtFerie',
  },
  4032: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ferieSelvstendigNæringsdrivandeFrilanser',
  },
  4037: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ikkeHeltidsArbeid',
  },
  4038: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.søkersSkadeSykdomIkkeOppfylt',
  },
  4039: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.søkerInleggelseIkkeOppfylt',
  },
  4040: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.barnetsInleggelseIkkeOppfylt',
  },
  4031: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ferieInnenforDeFørsteSeksUkerne',
  },
  4034: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ingenStønadsdagarIgjen',
  },
  4035: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farAlenaomsorgMorFyllesIkkeAktivitetskravet',
  },
  4030: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.utsettelseFørTerminFødsel',
  },
  4041: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.utsettelseFeriePåBevegeligHelligdag',
  },
  4050: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetArbeidIkkeOppfylt',
  },
  4051: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetOffentligGodkjentUtdanning',
  },
  4052: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetOffentligGodkjentUtdanningIKombinasjonMedArbeid',
  },
  4053: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsSkadeSykdom',
  },
  4054: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsInleggelse',
  },
  4055: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.aktivitetskravetMorsDeltakelseIntro',
  },
  4056: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetMorsDeltakelseKvalifisering',
  },
  4057: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetMorsMottakAvUføretrygd',
  },
  4058: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetStebarnsadopsjon',
  },
  4059: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.unntakForAktivitetskravetFlerBarnsfødsel',
  },
  4006: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.påkrevdStønadsperiodeMangler',
  },
  4015: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.morSøkerFFFødselTidlig',
  },
  4017: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.farEllerMedmorSøkerFFFødsel',
  },
  4061: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseIkkeDokumentert',
  },
  4081: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagUtsettelseFerieTilbakeTid',
  },
  4082: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagUtsettelseArbeidTilbakeTid',
  },
  4062: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseArbIkkeDok',
  },
  4063: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseSykdomIkkeDok',
  },
  4064: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseInnleggelseIkkeDok',
  },
  4065: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.UtsettelseBarnetsInnleggelseIkkeDok',
  },
  4072: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.BarnetErDødt',
  },
  4071: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravIntroprogramIkkeDok',
  },
  4070: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravInleggelseIkkeDok',
  },
  4069: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravSykdomIkkeDok',
  },
  4068: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravArbeidUtdanningIkkeDok',
  },
  4067: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravUtdanningIkkeDok',
  },
  4066: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravArbeidIkkeDok',
  },
  4074: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagOverforingKvoteSykdomIkkeDok',
  },
  4073: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeRettTilKvoteFordiMorIkkeHarRettForeldrepenger',
  },
  4086: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AnnenPartOverlappendeUttaksperioder',
  },
  4085: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeSamtykkeMellomPartene',
  },
  4084: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AnnenPartOverlappendeUttakSamtidigUttak',
  },
  4080: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeGraderingForSenSoknad',
  },
  4019: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForTermin',
  },
  4504: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForUke7',
  },
  4519: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingForTermin',
  },
  4025: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingArbeidOver100',
  },
  4023: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.ArbeiderIUtaksperiodenMerEnn0',
  },
  4088: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravIntroprogramIkkeDok',
  },
  4089: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AktivitetskravKVPIkkeDok',
  },
  4090: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomSøknadsperioderEtterSisteUttak',
  },
  4091: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.hullMellomSøknadsperioderEtterSisteUtsettelse',
  },
  4092: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagOverforingIkkeAleneomsorg',
  },
  4093: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingSøkerErIkkeIArbeid',
  },
  4094: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingsavtaleManglerIkkeDok',
  },
  4095: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagMorTarIkkeAlleUker',
  },
  4502: {
    kode: 'UTTAK_PERIODE_GRADERING_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.AvslagGraderingsavtaleManglerIkkeDok',
  },
  4501: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.IkkeGraderingForSenSoknad',
  },
  4087: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.medlemskapvilkarOpphor',
  },
  4096: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.fodselsvilkarOpphor',
  },
  4097: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.adopsjonsvilkarOpphor',
  },
  4098: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.foreldreansvarvilkarOpphor',
  },
  4099: {
    kode: 'UTTAK_PERIODE_AVSLAG_ÅRSAK',
    verdiId: 'HistorikkEndretFelt.opptjeningsvilkarOpphor',
  },
  2001: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UttakInnvilget',
  },
  2010: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaFerie',
  },
  2011: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaArbeid',
  },
  2012: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaInnleggelse',
  },
  2013: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaBarnInnlagt',
  },
  2014: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GyldigUtsettelsePgaSykdom',
  },
  2020: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnePartIkkeRett',
  },
  2023: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAleneomsorg',
  },
  2037: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFellesperiodeTilFar',
  },
  2022: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnenPartInnlagt',
  },
  2021: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.OverforingOppfyltAnnePartHjelp',
  },
  2003: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetUttakKvote',
  },
  2002: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFellesEllerFP',
  },
  2004: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPKunFarHarRett',
  },
  2005: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPVedAleneomsorg',
  },
  2006: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPFF',
  },
  2007: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.InnvilgetFPKunMorHarRett',
  },
  2015: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetFerieKunFarHarRett',
  },
  2016: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetArbeidKunFarHarRett',
  },
  2017: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetSykdomSkadeKunFarHarRett',
  },
  2018: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetInnleggelseKunFarHarRett',
  },
  2019: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.UtsetBarnetsInnleggelseKunFarHarRett',
  },
  2030: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFellesEllerFP',
  },
  2031: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingKvote',
  },
  2032: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPAleneomsorg',
  },
  2033: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPKunFarRett',
  },
  2034: {
    kode: 'INNVILGET_AARSAK',
    verdiId: 'HistorikkEndretFeltVerdiType.GraderingFPMorFarRett',
  },
};

export default historikkEndretFeltVerdiTypeCodes;
