// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const revurderingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingArsaker: PropTypes.arrayOf(
    PropTypes.shape({
      erAutomatiskRevurdering: PropTypes.bool.isRequired,
    }),
  ),
  type: kodeverkObjektPropType.isRequired,
  språkkode: kodeverkObjektPropType.isRequired,
});

export default revurderingBehandlingPropType;
