// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const feilutbetalingAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  kanLoses: PropTypes.bool.isRequired,
});

export default feilutbetalingAksjonspunkterPropType;
