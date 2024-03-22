// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const vedtakTilbakekrevingBehandlingPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  versjon: PropTypes.number.isRequired,
  behandlingsresultat: PropTypes.shape({
    type: PropTypes.string.isRequired,
  }),
  behandlingPaaVent: PropTypes.bool.isRequired,
});

export default vedtakTilbakekrevingBehandlingPropType;
