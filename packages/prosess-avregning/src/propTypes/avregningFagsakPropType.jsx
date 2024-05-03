// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  sakstype: kodeverkObjektPropType.isRequired,
});

export default avregningFagsakPropType;
