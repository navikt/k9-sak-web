// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const revurderingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingArsaker: PropTypes.arrayOf(
    PropTypes.shape({
      erAutomatiskRevurdering: PropTypes.bool.isRequired,
    }),
  ),
  type: PropTypes.string.isRequired,
  sprakkode: PropTypes.string.isRequired,
});

export default revurderingBehandlingPropType;
