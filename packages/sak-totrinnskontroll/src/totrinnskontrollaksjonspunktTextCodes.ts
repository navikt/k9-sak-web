import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

const totrinnskontrollaksjonspunktTextCodes = {
  [aksjonspunktCodes.OVERSTYR_ADOPSJONSVILKAR]: 'ToTrinnsForm.Adopsjon.VilkarOverstyrt',

  [aksjonspunktCodes.OVERSTYR_OMSORGEN_FOR]: 'ToTrinnsForm.Fødsel.VilkarOverstyrt',

  [aksjonspunktCodes.AVKLAR_AKTIVITETER]: 'ToTrinnsForm.Beregning.AvklarAktiviteter',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSAKTIVITETER]: 'ToTrinnsForm.Beregning.OverstyrtBeregningsaktiviteter',
  [aksjonspunktCodes.OVERSTYRING_AV_BEREGNINGSGRUNNLAG]: 'ToTrinnsForm.Beregning.OverstyrtBeregningsgrunnlag',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_ARBEIDSTAKER_FRILANS]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BRUTTO_BEREGNINGSGRUNNLAG_SELVSTENDIG_NAERINGSDRIVENDE]:
    'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.OVERSTYR_BEREGNING]: 'ToTrinnsForm.Beregning.VilkarOverstyrt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_TIDSBEGRENSET_ARBEIDSFORHOLD]:
    'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FASTSETT_BEREGNINGSGRUNNLAG_SN_NY_I_ARBEIDSLIVET]: 'ToTrinnsForm.Beregning.InntektFastsatt',
  [aksjonspunktCodes.FORDEL_BEREGNINGSGRUNNLAG]: 'ToTrinnsForm.Beregning.FastsettFordeltBeregningsgrunnlag',
  [aksjonspunktCodes.VURDER_NYTT_INNTKTSFORHOLD]: 'ToTrinnsForm.Beregning.VurdertNyttInntektsforhold',

  [aksjonspunktCodes.OVERSTYR_SOKNADSFRISTVILKAR]: 'ToTrinnsForm.Soknadsfrist.VilkarOverstyrt',
  [aksjonspunktCodes.OVERSTYRING_AV_UTTAK_KODE]: 'ToTrinnsForm.OverstyrUttak.OverstyringAvUttak',

  [aksjonspunktCodes.AVKLAR_OM_BRUKER_HAR_GYLDIG_PERIODE]: 'ToTrinnsForm.Medlemskap.VurderGyldigMedlemskap',
  [aksjonspunktCodes.AVKLAR_LOVLIG_OPPHOLD]: 'ToTrinnsForm.Medlemskap.AvklarLovligOpphold',
  [aksjonspunktCodes.AVKLAR_OM_BRUKER_ER_BOSATT]: 'ToTrinnsForm.Medlemskap.VurderSokerBosatt',
  [aksjonspunktCodes.AVKLAR_OPPHOLDSRETT]: 'ToTrinnsForm.Medlemskap.AvklarOppholdsrett',
  [aksjonspunktCodes.AVKLAR_PERSONSTATUS]: 'ToTrinnsForm.Medlemskap.VurderPersonStatus',
  [aksjonspunktCodes.OVERSTYR_MEDLEMSKAPSVILKAR]: 'ToTrinnsForm.Medlemskap.VilkarOverstyrt',

  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_DØD]: 'ToTrinnsForm.Uttak.Dod',
  [aksjonspunktCodes.KONTROLLER_OPPLYSNINGER_OM_SØKNADSFRIST]: 'ToTrinnsForm.Uttak.Soknadsfrist',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_INNVILGET]: 'ToTrinnsForm.Uttak.TilstotendeYtelser.Innvilget',
  [aksjonspunktCodes.KONTROLLER_TILSTØTENDE_YTELSER_OPPHØRT]: 'ToTrinnsForm.Uttak.TilstotendeYtelser.Opphort',
  [aksjonspunktCodes.TILKNYTTET_STORTINGET]: 'ToTrinnsForm.Uttak.Stortinget',
  [aksjonspunktCodes.VURDER_DATO_NY_REGEL_UTTAK]: 'ToTrinnsForm.Uttak.DatoNyeReglerErSatt',

  [aksjonspunktCodes.VURDER_TILBAKETREKK]: 'ToTrinnsForm.TilkjentYtelse.Tilbaketrekk',

  [aksjonspunktCodes.VURDER_FARESIGNALER]: 'ToTrinnsForm.Faresignaler.Vurder',

  [aksjonspunktCodes.VURDER_OPPTJENINGSVILKARET]: 'ToTrinnsForm.Opptjening.VurderOpptjeningsvilkåret',

  [aksjonspunktCodes.FORESLA_VEDTAK]: 'ToTrinnsForm.Vedtak.Fritekstbrev',
};

export const totrinnsTilbakekrevingkontrollaksjonspunktTextCodes = {};

export default totrinnskontrollaksjonspunktTextCodes;
