// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakTilbakekrevingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape({
    type: kodeverkObjektPropType.isRequired,
  }),
  behandlingPåVent: PropTypes.bool.isRequired,
});

export default vedtakTilbakekrevingBehandlingPropType;
