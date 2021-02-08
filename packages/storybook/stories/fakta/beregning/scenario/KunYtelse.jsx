// eslint-disable-next-line max-len
export const beregningsgrunnlag = [{"skjaeringstidspunktBeregning":"2020-05-18","skjæringstidspunkt":"2020-05-18","aktivitetStatus":[{"kode":"AT","kodeverk":"AKTIVITET_STATUS"}],"beregningsgrunnlagPeriode":[{"beregningsgrunnlagPeriodeFom":"2020-05-18","beregningsgrunnlagPeriodeTom":"9999-12-31","beregnetPrAar":0,"bruttoPrAar":0,"bruttoInkludertBortfaltNaturalytelsePrAar":0,"periodeAarsaker":[],"beregningsgrunnlagPrStatusOgAndel":[{"dtoType":"GENERELL","beregningsgrunnlagFom":"2020-02-01","beregningsgrunnlagTom":"2020-04-30","aktivitetStatus":{"kode":"AT","kodeverk":"AKTIVITET_STATUS"},"beregningsperiodeFom":"2020-02-01","beregningsperiodeTom":"2020-04-30","andelsnr":1,"inntektskategori":{"kode":"ARBEIDSTAKER","kodeverk":"INNTEKTSKATEGORI"},"arbeidsforhold":{"arbeidsgiverId":"123456789","arbeidsgiverIdent":"123456789","arbeidsgiverIdVisning":"123456789","startdato":"2017-11-01","opphoersdato":"2020-05-31","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"},"belopFraInntektsmeldingPrMnd":81364.35},"fastsattAvSaksbehandler":false,"lagtTilAvSaksbehandler":false,"belopPrMndEtterAOrdningen":76001.8766666667,"belopPrAarEtterAOrdningen":912022.520000000000,"erTilkommetAndel":false,"skalFastsetteGrunnlag":false}]}],"sammenligningsgrunnlagPrStatus":[],"halvG":50675.5,"grunnbeløp":101351.00,"faktaOmBeregning":{"avklarAktiviteter":{"aktiviteterTomDatoMapping":[{"tom":"2020-05-18","aktiviteter":[{"arbeidsgiverId":"123456789","fom":"2017-11-01","tom":"2020-05-31","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}},{"fom":"2019-11-18","tom":"2020-09-27","arbeidsforholdType":{"kode":"FORELDREPENGER","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}}]}],"skjæringstidspunkt":"2020-05-18"},"andelerForFaktaOmBeregning":[{"belopReadOnly":81364.35,"inntektskategori":{"kode":"ARBEIDSTAKER","kodeverk":"INNTEKTSKATEGORI"},"aktivitetStatus":{"kode":"AT","kodeverk":"AKTIVITET_STATUS"},"refusjonskrav":81364.35,"visningsnavn":"Arbeidsgiveren AS (123456789)","arbeidsforhold":{"arbeidsgiverId":"123456789","arbeidsgiverIdent":"123456789","arbeidsgiverIdVisning":"123456789","startdato":"2017-11-01","opphoersdato":"2020-05-31","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"},"belopFraInntektsmeldingPrMnd":81364.35},"andelsnr":1,"skalKunneEndreAktivitet":false,"lagtTilAvSaksbehandler":false}]},"hjemmel":{"kode":"-","kodeverk":"BG_HJEMMEL"},"årsinntektVisningstall":0,"dekningsgrad":100,"ytelsesspesifiktGrunnlag":{"ytelsetype":"OMP","skalAvviksvurdere":true},"erOverstyrtInntekt":false,"vilkårsperiodeFom":"2020-05-18"},{"skjaeringstidspunktBeregning":"2020-06-04","skjæringstidspunkt":"2020-06-04","aktivitetStatus":[{"kode":"KUN_YTELSE","kodeverk":"AKTIVITET_STATUS"}],"beregningsgrunnlagPeriode":[{"beregningsgrunnlagPeriodeFom":"2020-06-04","beregningsgrunnlagPeriodeTom":"9999-12-31","beregnetPrAar":0,"bruttoPrAar":0,"bruttoInkludertBortfaltNaturalytelsePrAar":0,"periodeAarsaker":[],"beregningsgrunnlagPrStatusOgAndel":[{"dtoType":"GENERELL","aktivitetStatus":{"kode":"BA","kodeverk":"AKTIVITET_STATUS"},"andelsnr":1,"inntektskategori":{"kode":"-","kodeverk":"INNTEKTSKATEGORI"},"fastsattAvSaksbehandler":false,"lagtTilAvSaksbehandler":false,"erTilkommetAndel":false}]}],"sammenligningsgrunnlagPrStatus":[],"halvG":50675.5,"grunnbeløp":101351.00,"faktaOmBeregning":{"kunYtelse":{"andeler":[{"andelsnr":1,"inntektskategori":{"kode":"-","kodeverk":"INNTEKTSKATEGORI"},"aktivitetStatus":{"kode":"BA","kodeverk":"AKTIVITET_STATUS"},"kilde":{"kode":"PROSESS_START","kodeverk":"ANDEL_KILDE"},"lagtTilAvSaksbehandler":false,"fastsattAvSaksbehandler":false}],"fodendeKvinneMedDP":false},"faktaOmBeregningTilfeller":[{"kode":"FASTSETT_BG_KUN_YTELSE","kodeverk":"FAKTA_OM_BEREGNING_TILFELLE"}],"avklarAktiviteter":{"aktiviteterTomDatoMapping":[{"tom":"2020-06-04","aktiviteter":[{"fom":"2019-11-18","tom":"2020-09-27","arbeidsforholdType":{"kode":"FORELDREPENGER","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}}]},{"tom":"2020-06-01","aktiviteter":[{"arbeidsgiverId":"123456789","fom":"2017-11-01","tom":"2020-05-31","arbeidsforholdType":{"kode":"ARBEID","kodeverk":"OPPTJENING_AKTIVITET_TYPE"}}]}],"skjæringstidspunkt":"2020-06-04"},"andelerForFaktaOmBeregning":[{"inntektskategori":{"kode":"-","kodeverk":"INNTEKTSKATEGORI"},"aktivitetStatus":{"kode":"BA","kodeverk":"AKTIVITET_STATUS"},"visningsnavn":"Brukers andel","andelsnr":1,"skalKunneEndreAktivitet":false,"lagtTilAvSaksbehandler":false}],"vurderMilitaer":{}},"hjemmel":{"kode":"-","kodeverk":"BG_HJEMMEL"},"årsinntektVisningstall":0,"dekningsgrad":100,"ytelsesspesifiktGrunnlag":{"ytelsetype":"OMP","skalAvviksvurdere":true},"erOverstyrtInntekt":false,"vilkårsperiodeFom":"2020-06-04"}];

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
  