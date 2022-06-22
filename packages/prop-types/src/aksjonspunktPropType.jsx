import PropTypes from 'prop-types';

const aksjonspunktPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  vilkarType: PropTypes.string.isRequired,
  toTrinnsBehandling: PropTypes.bool,
  toTrinnsBehandlingGodkjent: PropTypes.bool,
  vurderPaNyttArsaker: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
  })),
  besluttersBegrunnelse: PropTypes.string,
  aksjonspunktType: PropTypes.string.isRequired,
  kanLoses: PropTypes.bool.isRequired,
  erAktivt: PropTypes.bool.isRequired,
});

export default aksjonspunktPropType;
