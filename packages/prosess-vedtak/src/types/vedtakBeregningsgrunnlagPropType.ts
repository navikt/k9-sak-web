import { Kodeverk } from '@k9-sak-web/types';

interface BeregningsgrunnlagPropType {
  aktivitetStatus: {
    aktivitetStatus: Kodeverk;
  }[];
  beregningsgrunnlagPeriode: {
    beregningsgrunnlagPrStatusOgAndel: {
      aktivitetStatus: Kodeverk;
      arbeidsforholdType: Kodeverk;
      beregnetPrAar?: number;
      overstyrtPrAar?: number;
      arbeidsforholdId?: string;
      erNyIArbeidslivet?: boolean;
      erTidsbegrensetArbeidsforhold?: boolean;
      erNyoppstartet?: boolean;
      arbeidsgiverId?: string;
      arbeidsgiverNavn?: string;
      andelsnr?: number;
      lonnsendringIBeregningsperioden?: boolean;
    }[];
  }[];

  ytelsesspesifiktGrunnlag: {
    avslagsårsakPrPeriode: { fom: string; tom: string }[];
    ytelsetype: string;
    skalAvviksvurdere: boolean;
  };
}

export default BeregningsgrunnlagPropType;
