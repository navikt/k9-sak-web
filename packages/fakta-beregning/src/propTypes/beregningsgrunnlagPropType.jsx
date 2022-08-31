import PropTypes from 'prop-types';
import beregningAvklaringsbehovPropType from './beregningAvklaringsbehovPropType';

const beregningsgrunnlagArbeidsforholdProptype = PropTypes.exact({
  arbeidsgiverIdent: PropTypes.string,
  startdato: PropTypes.string,
  opphoersdato: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  arbeidsforholdType: PropTypes.string,
});

const faktaOmBeregningAndelPropType = PropTypes.exact({
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  andelsnr: PropTypes.number,
  inntektskategori: PropTypes.string,
  aktivitetStatus: PropTypes.string,
});

const andelForFaktaOmBeregningPropType = PropTypes.exact({
  arbeidsforhold: beregningsgrunnlagArbeidsforholdProptype,
  andelsnr: PropTypes.number,
  inntektskategori: PropTypes.string,
  aktivitetStatus: PropTypes.string,
  belopReadOnly: PropTypes.number,
  fastsattBelop: PropTypes.number,
  skalKunneEndreAktivitet: PropTypes.bool.isRequired,
  lagtTilAvSaksbehandler: PropTypes.bool.isRequired,
});

const refusjonskravSomKommerForSentListePropType = PropTypes.exact({
  arbeidsgiverIdent: PropTypes.string,
  erRefusjonskravGyldig: PropTypes.bool,
});

const vurderMilitaerPropType = PropTypes.exact({
  harMilitaer: PropTypes.bool,
});

export const avklarAktiviteterPropType = PropTypes.exact({
  aktiviteterTomDatoMapping: PropTypes.arrayOf(
    PropTypes.exact({
      tom: PropTypes.string.isRequired,
      aktiviteter: PropTypes.arrayOf(
        PropTypes.exact({
          arbeidsgiverIdent: PropTypes.string,
          eksternArbeidsforholdId: PropTypes.string,
          fom: PropTypes.string.isRequired,
          tom: PropTypes.string,
          arbeidsforholdId: PropTypes.string,
          arbeidsforholdType: PropTypes.string.isRequired,
          aktørIdString: PropTypes.string,
        }),
      ),
    }),
  ),
});

export const faktaOmBeregningPropType = PropTypes.exact({
  beregningsgrunnlagArbeidsforhold: PropTypes.arrayOf(
    PropTypes.exact({
      ...beregningsgrunnlagArbeidsforholdProptype,
      erTidsbegrensetArbeidsforhold: PropTypes.bool,
    }),
  ),
  avklarAktiviteter: avklarAktiviteterPropType,
  frilansAndel: faktaOmBeregningAndelPropType,
  vurderMilitaer: vurderMilitaerPropType,
  refusjonskravSomKommerForSentListe: PropTypes.arrayOf(refusjonskravSomKommerForSentListePropType),
  arbeidsforholdMedLønnsendringUtenIM: PropTypes.arrayOf(faktaOmBeregningAndelPropType),
  andelerForFaktaOmBeregning: PropTypes.arrayOf(andelForFaktaOmBeregningPropType).isRequired,
});

const beregningsgrunnlagPropType = PropTypes.exact({
  avklaringsbehov: PropTypes.arrayOf(beregningAvklaringsbehovPropType).isRequired,
  vilkårsperiodeFom: PropTypes.string.isRequired,
  aktivitetStatus: PropTypes.arrayOf(
    PropTypes.exact({
      aktivitetStatus: PropTypes.string,
    }),
  ),
  beregningsgrunnlagPeriode: PropTypes.arrayOf(
    PropTypes.exact({
      beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(
        PropTypes.exact({
          aktivitetStatus: PropTypes.string,
          arbeidsforholdType: PropTypes.string,
          beregnetPrAar: PropTypes.number,
          arbeidsforholdId: PropTypes.string,
          erNyIArbeidslivet: PropTypes.bool,
          erTidsbegrensetArbeidsforhold: PropTypes.bool,
          erNyoppstartet: PropTypes.bool,
          arbeidsgiverIdent: PropTypes.string,
          andelsnr: PropTypes.number,
          lonnsendringIBeregningsperioden: PropTypes.bool,
        }),
      ),
    }),
  ),
  faktaOmBeregning: faktaOmBeregningPropType.isRequired,
});

export default beregningsgrunnlagPropType;
