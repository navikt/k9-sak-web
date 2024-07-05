// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const medlemskapAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
  kanLoses: PropTypes.bool.isRequired,
});

export default medlemskapAksjonspunkterPropType;
