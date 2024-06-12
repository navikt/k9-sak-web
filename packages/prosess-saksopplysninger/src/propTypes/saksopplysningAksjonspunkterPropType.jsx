// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const saksopplysningAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  begrunnelse: PropTypes.string,
});

export default saksopplysningAksjonspunkterPropType;
