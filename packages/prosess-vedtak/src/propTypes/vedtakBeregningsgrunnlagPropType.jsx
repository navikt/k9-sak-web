// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const beregningsgrunnlagPropType = PropTypes.shape({
  aktivitetStatus: PropTypes.arrayOf(PropTypes.string),
  beregningsgrunnlagPeriode: PropTypes.arrayOf(
    PropTypes.shape({
      beregningsgrunnlagPrStatusOgAndel: PropTypes.arrayOf(
        PropTypes.shape({
          aktivitetStatus: PropTypes.string,
          arbeidsforholdType: PropTypes.string,
          beregnetPrAar: PropTypes.number,
          overstyrtPrAar: PropTypes.number,
          arbeidsforholdId: PropTypes.string,
          erNyIArbeidslivet: PropTypes.bool,
          erTidsbegrensetArbeidsforhold: PropTypes.bool,
          erNyoppstartet: PropTypes.bool,
          arbeidsgiverId: PropTypes.string,
          arbeidsgiverNavn: PropTypes.string,
          andelsnr: PropTypes.number,
          lonnsendringIBeregningsperioden: PropTypes.bool,
        }),
      ),
    }),
  ),
});

export default beregningsgrunnlagPropType;
