import PropTypes from 'prop-types';

const vedtakAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  kanLoses: PropTypes.bool.isRequired,
  erAktivt: PropTypes.bool.isRequired,
});

export default vedtakAksjonspunkterPropType;
