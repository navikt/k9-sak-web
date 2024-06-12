// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const unntakBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  sprakkode: PropTypes.string.isRequired,
});

export default unntakBehandlingPropType;
