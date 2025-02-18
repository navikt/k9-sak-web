import type { BeregningsgrunnlagArbeidsforhold } from './BeregningsgrunnlagArbeidsforhold';

export type FaktaOmBeregningAndel = Readonly<{
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  inntektskategori?: string;
  aktivitetStatus: string;
}>;

export type AndelForFaktaOmBeregning = Readonly<{
  arbeidsforhold?: BeregningsgrunnlagArbeidsforhold;
  andelsnr?: number;
  refusjonskrav?: number;
  inntektskategori?: string;
  aktivitetStatus: string;
  belopReadOnly?: number;
  fastsattBelop?: number;
  skalKunneEndreAktivitet?: boolean;
  lagtTilAvSaksbehandler: boolean;
}>;

export type RefusjonskravSomKommerForSentListe = Readonly<{
  arbeidsgiverIdent: string;
  erRefusjonskravGyldig?: boolean;
}>;

type VurderMilitaer = Readonly<{
  harMilitaer?: boolean;
}>;

export type VurderBesteberegning = Readonly<{
  skalHaBesteberegning?: boolean;
}>;

export type BeregningAktivitet = Readonly<{
  arbeidsgiverIdent?: string;
  eksternArbeidsforholdId?: string;
  fom: string;
  tom: string;
  arbeidsforholdId?: string;
  arbeidsforholdType: string;
  skalBrukes?: boolean;
}>;

export type AvklarBeregningAktiviteter = Readonly<{
  tom: string;
  aktiviteter?: BeregningAktivitet[];
}>;

export type AvklarBeregningAktiviteterMap = Readonly<{
  aktiviteterTomDatoMapping?: AvklarBeregningAktiviteter[];
  skjæringstidspunkt: string;
}>;

export interface KunYtelseAndel extends FaktaOmBeregningAndel {
  fastsattBelopPrMnd: number | null;
}

export interface KortvarigAndel extends AndelForFaktaOmBeregning {
  erTidsbegrensetArbeidsforhold?: boolean;
}

export interface ArbeidstakerUtenIMAndel extends AndelForFaktaOmBeregning {
  mottarYtelse?: boolean;
  inntektPrMnd?: number;
}

export type KunYtelse = Readonly<{
  andeler?: KunYtelseAndel[];
  fodendeKvinneMedDP: boolean;
  erBesteberegning?: boolean;
}>;

export type VurderMottarYtelse = Readonly<{
  erFrilans?: boolean;
  frilansMottarYtelse?: boolean;
  frilansInntektPrMnd?: number;
  arbeidstakerAndelerUtenIM?: ArbeidstakerUtenIMAndel[];
}>;

export interface ATFLSammeOrgAndel extends FaktaOmBeregningAndel {
  inntektPrMnd?: number;
}

export type SaksopplysningArbeidsforhold = Readonly<{
  andelsnr: number;
  arbeidsgiverIdent: string;
  arbeidsforholdId?: string;
}>;

export type LønnsendringSaksopplysning = Readonly<{
  sisteLønnsendringsdato: string;
  lønnsendringscenario: string;
  arbeidsforhold: SaksopplysningArbeidsforhold;
}>;

export type Saksopplysninger = Readonly<{
  lønnsendringSaksopplysning?: LønnsendringSaksopplysning[];
  kortvarigeArbeidsforhold: SaksopplysningArbeidsforhold[];
}>;

export type FaktaOmBeregning = Readonly<{
  saksopplysninger?: Saksopplysninger;
  beregningsgrunnlagArbeidsforhold?: (BeregningsgrunnlagArbeidsforhold & {
    erTidsbegrensetArbeidsforhold?: boolean;
  })[];
  avklarAktiviteter?: AvklarBeregningAktiviteterMap;
  frilansAndel?: FaktaOmBeregningAndel;
  vurderMilitaer?: VurderMilitaer;
  vurderBesteberegning?: VurderBesteberegning;
  refusjonskravSomKommerForSentListe?: RefusjonskravSomKommerForSentListe[];
  arbeidsforholdMedLønnsendringUtenIM?: FaktaOmBeregningAndel[];
  andelerForFaktaOmBeregning: AndelForFaktaOmBeregning[];
  kortvarigeArbeidsforhold?: KortvarigAndel[];
  kunYtelse?: KunYtelse;
  faktaOmBeregningTilfeller?: string[];
  vurderMottarYtelse?: VurderMottarYtelse;
  arbeidstakerOgFrilanserISammeOrganisasjonListe?: ATFLSammeOrgAndel[];
}>;
