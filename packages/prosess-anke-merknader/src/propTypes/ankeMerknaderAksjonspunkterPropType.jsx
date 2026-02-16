// eslint-disable-next-line import/no-duplicates

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import PropTypes from 'prop-types';

const ankeMerknaderAksjonspunkterPropType = PropTypes.shape({
  definisjon: kodeverkObjektPropType.isRequired,
  begrunnelse: PropTypes.string,
});

export default ankeMerknaderAksjonspunkterPropType;
