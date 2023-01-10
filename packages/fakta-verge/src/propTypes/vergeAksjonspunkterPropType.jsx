import PropTypes from 'prop-types';

const vergeAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  kanLoses: PropTypes.bool.isRequired,
});

export default vergeAksjonspunkterPropType;
