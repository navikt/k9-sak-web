// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const ankeMerknaderAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default ankeMerknaderAksjonspunkterPropType;
