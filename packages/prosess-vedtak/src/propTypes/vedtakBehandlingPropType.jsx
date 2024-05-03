// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const vedtakBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: kodeverkObjektPropType.isRequired,
  status: kodeverkObjektPropType.isRequired,
  sprakkode: kodeverkObjektPropType.isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingHenlagt: PropTypes.bool.isRequired,
  behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default vedtakBehandlingPropType;
