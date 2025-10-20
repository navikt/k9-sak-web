import PropTypes from 'prop-types';

const avregningFagsakPropType = PropTypes.shape({
  saksnummer: PropTypes.string.isRequired,
  sakstype: PropTypes.string.isRequired,
});

export default avregningFagsakPropType;
