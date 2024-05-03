// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const vedtakVilkarPropType = PropTypes.shape({
  lovReferanse: PropTypes.string,
  vilkarType: kodeverkObjektPropType.isRequired,
  perioder: PropTypes.arrayOf(
    PropTypes.shape({
      vilkarStatus: kodeverkObjektPropType.isRequired,
    }),
  ),
});

export default vedtakVilkarPropType;
