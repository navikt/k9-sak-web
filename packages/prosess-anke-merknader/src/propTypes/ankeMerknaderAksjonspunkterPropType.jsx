import PropTypes from 'prop-types';

const ankeMerknaderAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
});

export default ankeMerknaderAksjonspunkterPropType;
