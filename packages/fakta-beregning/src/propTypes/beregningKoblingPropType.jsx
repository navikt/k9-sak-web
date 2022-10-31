import PropTypes from 'prop-types';

const beregningKoblingPropType = PropTypes.shape({
  skjæringstidspunkt: PropTypes.string.isRequired,
  referanse: PropTypes.string.isRequired,
  erForlengelse: PropTypes.bool.isRequired,
});

export default beregningKoblingPropType;
