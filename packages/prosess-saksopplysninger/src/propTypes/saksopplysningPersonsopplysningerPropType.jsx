// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const saksopplysningPersonsopplysningerPropType = PropTypes.shape({
  personstatus: PropTypes.string.isRequired,
  avklartPersonstatus: PropTypes.shape({
    orginalPersonstatus: PropTypes.string.isRequired,
    overstyrtPersonstatus: PropTypes.string.isRequired,
  }).isRequired,
});

export default saksopplysningPersonsopplysningerPropType;
