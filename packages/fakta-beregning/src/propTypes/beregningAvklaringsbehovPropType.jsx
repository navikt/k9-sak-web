import PropTypes from 'prop-types';

const beregningAvklaringsbehovPropType = PropTypes.exact({
  definisjon: PropTypes.string,
  status: PropTypes.string,
  kanLoses: PropTypes.bool,
  begrunnelse: PropTypes.string,
});

export default beregningAvklaringsbehovPropType;
