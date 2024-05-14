// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const saksopplysningPersonsopplysningerPropType = PropTypes.shape({
  personstatus: PropTypes.styring.isRequired,
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: PropTypes.styring.isRequired,
    overstyrtPersonstatus: PropTypes.styring.isRequired,
  }).isRequired,
});

export default saksopplysningPersonsopplysningerPropType;
