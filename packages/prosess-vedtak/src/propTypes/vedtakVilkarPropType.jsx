// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

const vedtakVilkarPropType = PropTypes.shape({
  lovReferanse: PropTypes.string,
  vilkarType: PropTypes.string.isRequired,
  perioder: PropTypes.arrayOf(
    PropTypes.shape({
      vilkarStatus: PropTypes.string.isRequired,
    }),
  ),
});

export default vedtakVilkarPropType;
