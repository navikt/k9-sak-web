// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const medlemskapBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  behandlingPaaVent: PropTypes.boolean,
});

export default medlemskapBehandlingPropType;
