// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';

// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@k9-sak-web/prop-types';

const foreldelsePerioderPropType = PropTypes.shape({
  perioder: PropTypes.arrayOf(
    PropTypes.shape({
      fom: PropTypes.string.isRequired,
      tom: PropTypes.string.isRequired,
      belop: PropTypes.number.isRequired,
      foreldelseVurderingType: kodeverkObjektPropType.isRequired,
    }),
  ).isRequired,
});

export default foreldelsePerioderPropType;
