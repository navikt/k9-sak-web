import PropTypes from 'prop-types';

const feilutbetalingAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  kanLoses: PropTypes.bool.isRequired,
});

export default feilutbetalingAksjonspunkterPropType;
