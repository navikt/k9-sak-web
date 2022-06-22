import PropTypes from 'prop-types';

const ankeResultatAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
});

export default ankeResultatAksjonspunkterPropType;
