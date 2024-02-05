import PropTypes, { kodeverkObjektPropType } from 'prop-types';


const vergeVergePropType = PropTypes.shape({
  navn: PropTypes.string,
  gyldigFom: PropTypes.string,
  gyldigTom: PropTypes.string,
  fnr: PropTypes.string,
  vergeType: kodeverkObjektPropType,
  begrunnelse: PropTypes.string,
});

export default vergeVergePropType;
