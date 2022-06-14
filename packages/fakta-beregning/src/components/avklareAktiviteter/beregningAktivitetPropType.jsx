import PropTypes from 'prop-types';

export const beregningAktivitetPropType = PropTypes.shape({
  arbeidsgiverId: PropTypes.string,
  fom: PropTypes.string,
  tom: PropTypes.string,
  arbeidsforholdId: PropTypes.string,
  aktørIdString: PropTypes.string,
  arbeidsforholdType: PropTypes.string,
  skalBrukes: PropTypes.bool,
});

export default beregningAktivitetPropType;
