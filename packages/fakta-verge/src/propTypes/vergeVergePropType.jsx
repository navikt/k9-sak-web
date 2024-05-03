// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const vergeVergePropType = PropTypes.shape({
  navn: PropTypes.string,
  gyldigFom: PropTypes.string,
  gyldigTom: PropTypes.string,
  fnr: PropTypes.string,
  vergeType: kodeverkObjektPropType,
  begrunnelse: PropTypes.string,
});

export default vergeVergePropType;
