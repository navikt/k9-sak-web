export const beregningsgrunnlag = [{"skjaeringstidspunktBeregning":"2020-04-01","skjæringstidspunkt":"2020-04-01","aktivitetStatus":[{"kode":"AT","kodeverk":"AKTIVITET_STATUS"}],"beregningsgrunnlagPeriode":[{"beregningsgrunnlagPeriodeFom":"2020-04-01","beregningsgrunnlagPeriodeTom":"9999-12-31","beregnetPrAar":0,"bruttoPrAar":0,"bruttoInkludertBortfaltNaturalytelsePrAar":0,"periodeAarsaker":[],"beregningsgrunnlagPrStatusOgAndel":[{"dtoType":"GENERELL","beregningsgrunnlagFom":"2020-01-01","beregningsgrunnlagTom":"2020-03-31","aktivitetStatus":{"kode":"AT","kodeverk":"AKTIVITET_STATUS"},"beregningsperiodeFom":"2020-01-01","beregningsperiodeTom":"2020-03-31","andelsnr":1,"inntektskategori":{"kode":"ARBEIDSTAKER","kodeverk":"INNTEKTSKATEGORI"},"arbeidsforhold":{"startdato":"2020-02-03","opphoersdato":"2020-12-01","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}},"fastsattAvSaksbehandler":false,"lagtTilAvSaksbehandler":false,"belopPrMndEtterAOrdningen":45000.0000000000,"belopPrAarEtterAOrdningen":540000.00000000000,"erTilkommetAndel":false,"skalFastsetteGrunnlag":false}]}],"sammenligningsgrunnlagPrStatus":[],"halvG":49929.0,"grunnbeløp":99858.00,"faktaOmBeregning":{"faktaOmBeregningTilfeller":[{"kode":"VURDER_MOTTAR_YTELSE","kodeverk":"FAKTA_OM_BEREGNING_TILFELLE"}],"vurderMottarYtelse":{"erFrilans":false,"arbeidstakerAndelerUtenIM":[{"andelsnr":1,"arbeidsforhold":{"startdato":"2020-02-03","opphoersdato":"2020-12-01","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}},"inntektskategori":{"kode":"ARBEIDSTAKER","kodeverk":"INNTEKTSKATEGORI"},"lagtTilAvSaksbehandler":false,"fastsattAvSaksbehandler":false,"andelIArbeid":[],"inntektPrMnd":45000.0000000000}]},"avklarAktiviteter":{"aktiviteterTomDatoMapping":[{"tom":"2020-04-01","aktiviteter":[{"arbeidsgiverId":"972674818","fom":"2020-02-03","tom":"2020-12-01","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}}]}],"skjæringstidspunkt":"2020-04-01"},"andelerForFaktaOmBeregning":[{"belopReadOnly":45000.0000000000,"inntektskategori":{"kode":"ARBEIDSTAKER","kodeverk":"INNTEKTSKATEGORI"},"aktivitetStatus":{"kode":"AT","kodeverk":"AKTIVITET_STATUS"},"visningsnavn":" ()","arbeidsforhold":{"startdato":"2020-02-03","opphoersdato":"2020-12-01","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}},"andelsnr":1,"skalKunneEndreAktivitet":false,"lagtTilAvSaksbehandler":false}],"vurderMilitaer":{}},"hjemmel":{"kode":"-","kodeverk":"BG_HJEMMEL"},"årsinntektVisningstall":0,"dekningsgrad":100,"ytelsesspesifiktGrunnlag":{"ytelsetype":"OMP","skalAvviksvurdere":true},"erOverstyrtInntekt":false,"vilkårsperiodeFom":"2020-04-01"}];


  const vilkår = beregningsgrunnlag.map((bg, index) => ({
    "avslagKode":null,
    "merknadParametere":{},
    "vilkarStatus":{"kode":"IKKE_VURDERT","kodeverk":"VILKAR_UTFALL_TYPE"},
    "periode":{"fom":bg.skjaeringstidspunktBeregning,"tom": beregningsgrunnlag.length === index ?
    null : beregningsgrunnlag[index].skjaeringstidspunktBeregning},
    "begrunnelse":null,
}));

export const behandling = {
    id: 1,
    versjon: 1,
    behandlingsresultat: {
      vilkårResultat: {
        BEREGNINGSGRUNNLAGVILKÅR: vilkår,
      }
    }
  };
  

export const aksjonspunkt = [
  {
    definisjon: { kode: '5058', kodeverk: 'AKSJONSPUNKT_DEF' },
    status: { kode: 'OPPR', kodeverk: 'AKSJONSPUNKT_STATUS' },
    begrunnelse: null,
    vilkarType: null,
    toTrinnsBehandling: true,
    toTrinnsBehandlingGodkjent: null,
    vurderPaNyttArsaker: null,
    besluttersBegrunnelse: null,
    aksjonspunktType: { kode: 'MANU', kodeverk: 'AKSJONSPUNKT_TYPE' },
    kanLoses: true,
    erAktivt: true,
    fristTid: null,
    endretTidspunkt: null,
    endretAv: null,
  }];
  