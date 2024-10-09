import PropTypes from 'prop-types';

const aksjonspunktPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired, // kodeverk
  status: PropTypes.string.isRequired, // kodeverk
  begrunnelse: PropTypes.string,
  vilkarType: PropTypes.string, // kodeverk
  toTrinnsBehandling: PropTypes.bool,
  toTrinnsBehandlingGodkjent: PropTypes.bool,
  vurderPaNyttArsaker: PropTypes.arrayOf(PropTypes.string), // kodeverk
  besluttersBegrunnelse: PropTypes.string,
  aksjonspunktType: PropTypes.string, // kodeverk
  kanLoses: PropTypes.bool.isRequired,
  erAktivt: PropTypes.bool.isRequired,
});

export default aksjonspunktPropType;
