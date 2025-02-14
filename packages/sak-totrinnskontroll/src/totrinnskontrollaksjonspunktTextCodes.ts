import { aksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';

const totrinnskontrollaksjonspunktTextCodes = {
  [aksjonspunktCodes.OVERSTYRING_AV_OMSORGEN_FOR]: 'Vilkåret omsorgen for er overstyrt.',
  [aksjonspunktCodes.AVKLAR_AKTIVITETER]: 'Det er vurdert hvilke aktiviteter som skal benyttes i beregningsgrunnlaget.',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER]:
    'Det er overstyrt hvilke aktiviteter som skal benyttes i beregningsgrunnlaget.',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: 'Rapporterte inntekter er overstyrt.',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'Inntekt er skjønnsmessig fastsatt.',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE]: 'Inntekt er skjønnsmessig fastsatt.',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNING]: 'Beregningsvilkåret er overstyrt.',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]: 'Inntekt er skjønnsmessig fastsatt.',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_FOR_SN_NY_I_ARBEIDSLIVET]: 'Inntekt er skjønnsmessig fastsatt.',
  [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: 'Ny fordeling av beregningsgrunnlaget er fastsatt.',
  [aksjonspunktCodes.VURDER_NYTT_INNTEKTSFORHOLD]:
    'Søker har tilkommet aktivitet i perioden. Det er vurdert om inntekt fra den nye aktiviteten skal redusere utbetaling.',
  [aksjonspunktCodes.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET]: 'Søknadsfristvilkåret er overstyrt.',
  [aksjonspunktCodes.OVERSTYRING_AV_UTTAK]: 'Uttaksplanen har blitt overstyrt',
  [aksjonspunktCodes.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE]: 'Det er vurdert om søker har gyldig medlemskap i perioden.',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'Det er vurdert om søker har lovlig opphold.',
  [aksjonspunktCodes.AVKLAR_OM_ER_BOSATT]: 'Det er vurdert om søker er bosatt i Norge.',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'Det er vurdert om søker har oppholdsrett.',
  [aksjonspunktCodes.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET]: 'Medlemskapsvilkåret er overstyrt.',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'Opplysninger om søknadsfrist er kontrollert.',
  [aksjonspunktCodes.TILKNYTTET_STORTINGET]:
    'Søker er stortingsrepresentant/administrativt ansatt i Stortinget. Uttak er kontrollert.',
  [aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK]:
    'Søker har tilkommet aktivitet i perioden. Dato for når nye uttaksregler skal gjelde fra er satt.',
  [aksjonspunktCodes.VURDER_TILBAKETREKK]: 'Det er vurdert om det skal utføres tilbakekreving fra søker.',
  [aksjonspunktCodes.VURDER_OPPTJENINGSVILKÅRET]: 'Opptjeningsvilkåret har blitt manuelt vurdert.',
  [aksjonspunktCodes.FORESLÅ_VEDTAK]: 'Det er laget et fritekstbrev',
};

export default totrinnskontrollaksjonspunktTextCodes;
