import PropTypes from 'prop-types';

const avregningAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
});

export default avregningAksjonspunkterPropType;
