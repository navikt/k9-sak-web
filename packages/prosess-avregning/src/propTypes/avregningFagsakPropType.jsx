// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  sakstype: PropTypes.string, // kodeverk
});

export default avregningFagsakPropType;
