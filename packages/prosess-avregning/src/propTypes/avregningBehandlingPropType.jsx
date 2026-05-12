// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const avregningBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
});

export default avregningBehandlingPropType;
