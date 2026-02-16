// eslint-disable-next-line import/no-duplicates

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';
import PropTypes from 'prop-types';

const avregningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  språkkode: kodeverkObjektPropType.isRequired,
});

export default avregningBehandlingPropType;
