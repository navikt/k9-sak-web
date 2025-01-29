// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  sakstype: kodeverkObjektPropType.isRequired,
});

export default avregningFagsakPropType;
