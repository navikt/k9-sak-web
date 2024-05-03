// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const avsluttetBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  avsluttet: PropTypes.string,
});

export default avsluttetBehandlingPropType;
