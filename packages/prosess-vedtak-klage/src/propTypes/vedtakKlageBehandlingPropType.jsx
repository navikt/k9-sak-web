// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const vedtakTilbakekrevingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape({
    type: kodeverkObjektPropType.isRequired,
  }),
  behandlingPaaVent: PropTypes.bool.isRequired,
});

export default vedtakTilbakekrevingBehandlingPropType;
