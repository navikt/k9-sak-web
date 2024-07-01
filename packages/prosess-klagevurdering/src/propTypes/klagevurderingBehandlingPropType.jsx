// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const klagevurderingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  sprakkode: PropTypes.string.isRequired,
});

export default klagevurderingBehandlingPropType;
