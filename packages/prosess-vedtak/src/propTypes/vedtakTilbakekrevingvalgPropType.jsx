import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakTilbakekrevingvalgPropType = PropTypes.shape({
  videreBehandling: PropTypes.string.isRequired,
});

export default vedtakTilbakekrevingvalgPropType;
