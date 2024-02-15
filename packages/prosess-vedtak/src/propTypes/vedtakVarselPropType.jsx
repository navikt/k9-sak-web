// eslint-disable-next-line import/no-duplicates
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-duplicates
import { kodeverkObjektPropType } from '@fpsak-frontend/prop-types';

const vedtakVarselPropType = PropTypes.shape({
  avslagsarsak: PropTypes.shape(),
  avslagsarsakFritekst: PropTypes.string,
  id: PropTypes.number,
  overskrift: PropTypes.string,
  fritekstbrev: PropTypes.string,
  skjæringstidspunkt: PropTypes.shape({
    dato: PropTypes.string,
  }),
  redusertUtbetalingÅrsaker: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape({})])),
  vedtaksbrev: kodeverkObjektPropType,
  vedtaksdato: PropTypes.string,
});

export default vedtakVarselPropType;
