import PropTypes from 'prop-types';

import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const beregningAvklaringsbehovPropType = PropTypes.exact({
  definisjon: kodeverkObjektPropType,
  status: kodeverkObjektPropType,
  begrunnelse: PropTypes.string,
});

export default beregningAvklaringsbehovPropType;
