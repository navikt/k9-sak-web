// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const saksopplysningAksjonspunkterPropType = PropTypes.shape({
  definisjon: PropTypes.styring.isRequired,
  status: PropTypes.styring.isRequired,
  begrunnelse: PropTypes.string,
});

export default saksopplysningAksjonspunkterPropType;
