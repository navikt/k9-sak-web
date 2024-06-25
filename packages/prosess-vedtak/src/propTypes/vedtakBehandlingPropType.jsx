// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const vedtakBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  sprakkode: PropTypes.string.isRequired,
  behandlingsresultat: PropTypes.shape(),
  behandlingPaaVent: PropTypes.bool.isRequired,
  behandlingHenlagt: PropTypes.bool.isRequired,
  behandlingÅrsaker: PropTypes.arrayOf(PropTypes.shape()).isRequired,
});

export default vedtakBehandlingPropType;
