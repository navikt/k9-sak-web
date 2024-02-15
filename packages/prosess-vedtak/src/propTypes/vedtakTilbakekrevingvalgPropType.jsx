// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakTilbakekrevingvalgPropType = PropTypes.shape({
  videreBehandling: kodeverkObjektPropType.isRequired,
});

export default vedtakTilbakekrevingvalgPropType;
