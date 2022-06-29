import PropTypes from 'prop-types';

const beregningAvklaringsbehovPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
});

export default beregningAvklaringsbehovPropType;
