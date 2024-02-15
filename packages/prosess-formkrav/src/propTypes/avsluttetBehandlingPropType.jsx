// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const avsluttetBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  avsluttet: PropTypes.string,
});

export default avsluttetBehandlingPropType;
