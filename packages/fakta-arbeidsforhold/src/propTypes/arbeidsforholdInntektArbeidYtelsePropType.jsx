import PropTypes from 'prop-types';

import { arbeidsforholdPropType } from '@fpsak-frontend/prop-types';

const arbeidsforholdInntektArbeidYtelsePropType = PropTypes.shape({
  arbeidsforhold: PropTypes.arrayOf(arbeidsforholdPropType),
  skalKunneLeggeTilNyeArbeidsforhold: PropTypes.bool.isRequired,
  skalKunneLageArbeidsforholdBasertPaInntektsmelding: PropTypes.bool.isRequired,
});

export default arbeidsforholdInntektArbeidYtelsePropType;
