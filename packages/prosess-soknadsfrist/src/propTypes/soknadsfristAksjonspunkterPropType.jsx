import PropTypes, { kodeverkObjektPropType } from 'prop-types';


const soknadsfristAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default soknadsfristAksjonspunkterPropType;
