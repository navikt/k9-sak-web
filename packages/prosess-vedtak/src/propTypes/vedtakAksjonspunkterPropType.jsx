import PropTypes from 'prop-types';

const vedtakAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.shape({
    kode: PropTypes.string.isRequired,
    kodeverk: PropTypes.string.isRequired,
    skalAvbrytesVedTilbakeføring: PropTypes.bool,
  }),
  begrunnelse: PropTypes.string,
  kanLoses: PropTypes.bool.isRequired,
  erAktivt: PropTypes.bool.isRequired,
});

export default vedtakAksjonspunkterPropType;
