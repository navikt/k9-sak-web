import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/combined/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';

const totrinnskontrollaksjonspunktTextCodes: Partial<Record<AksjonspunktDefinisjon, string>> = {
  [AksjonspunktDefinisjon.OVERSTYRING_AV_OMSORGEN_FOR]: 'Vilkåret omsorgen for er overstyrt.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_MEDISINSKESVILKÅRET_UNDER_18]: 'Vilkåret sykdom er overstyrt.',
  [AksjonspunktDefinisjon.AVKLAR_AKTIVITETER]:
    'Det er vurdert hvilke aktiviteter som skal benyttes i beregningsgrunnlaget.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNINGSAKTIVITETER]:
    'Det er overstyrt hvilke aktiviteter som skal benyttes i beregningsgrunnlaget.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: 'Rapporterte inntekter er overstyrt.',
  [AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'Inntekt er skjønnsmessig fastsatt.',
  [AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_SELVSTENDIG_NÆRINGSDRIVENDE]:
    'Inntekt er skjønnsmessig fastsatt.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_BEREGNING]: 'Beregningsvilkåret er overstyrt.',
  [AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'Inntekt er skjønnsmessig fastsatt.',
  [AksjonspunktDefinisjon.FASTSETT_BEREGNINGSGRUNNLAG_FOR_SN_NY_I_ARBEIDSLIVET]: 'Inntekt er skjønnsmessig fastsatt.',
  [AksjonspunktDefinisjon.FORDEL_BEREGNINGSGRUNNLAG]: 'Ny fordeling av beregningsgrunnlaget er fastsatt.',
  [AksjonspunktDefinisjon.VURDER_NYTT_INNTEKTSFORHOLD]:
    'Søker har tilkommet aktivitet i perioden. Det er vurdert om inntekt fra den nye aktiviteten skal redusere utbetaling.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_SØKNADSFRISTVILKÅRET]: 'Søknadsfristvilkåret er overstyrt.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_UTTAK]: 'Uttaksplanen har blitt overstyrt',
  [AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAPSPERIODE]:
    'Det er vurdert om søker har gyldig medlemskap i perioden.',
  [AksjonspunktDefinisjon.AVKLAR_LOVLIG_OPPHOLD]: 'Det er vurdert om søker har lovlig opphold.',
  [AksjonspunktDefinisjon.AVKLAR_OM_ER_BOSATT]: 'Det er vurdert om søker er bosatt i Norge.',
  [AksjonspunktDefinisjon.AVKLAR_OPPHOLDSRETT]: 'Det er vurdert om søker har oppholdsrett.',
  [AksjonspunktDefinisjon.OVERSTYRING_AV_MEDLEMSKAPSVILKÅRET]: 'Medlemskapsvilkåret er overstyrt.',
  [AksjonspunktDefinisjon.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'Opplysninger om søknadsfrist er kontrollert.',
  [AksjonspunktDefinisjon.TILKNYTTET_STORTINGET]:
    'Søker er stortingsrepresentant/administrativt ansatt i Stortinget. Uttak er kontrollert.',
  [AksjonspunktDefinisjon.VURDER_DATO_NY_REGEL_UTTAK]:
    'Søker har tilkommet aktivitet i perioden. Dato for når nye uttaksregler skal gjelde fra er satt.',
  [AksjonspunktDefinisjon.VURDER_TILBAKETREKK]: 'Det er vurdert om det skal utføres tilbakekreving fra søker.',
  [AksjonspunktDefinisjon.VURDER_OPPTJENINGSVILKÅRET]: 'Opptjeningsvilkåret har blitt manuelt vurdert.',
  [AksjonspunktDefinisjon.FORESLÅ_VEDTAK]: 'Det er laget et fritekstbrev',
  [AksjonspunktDefinisjon.VURDER_OVERLAPPENDE_SØSKENSAKER]:
    'Uttaksgrad har blitt vurdert på grunn av overlapp med brukers egne saker',
};

export default totrinnskontrollaksjonspunktTextCodes;
