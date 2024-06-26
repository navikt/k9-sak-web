// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const medlemskapBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  behandlingPaaVent: PropTypes.bool,
});

export default medlemskapBehandlingPropType;
