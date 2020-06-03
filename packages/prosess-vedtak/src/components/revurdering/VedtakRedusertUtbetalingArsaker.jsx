import React from 'react';
import {CheckboxField} from "@fpsak-frontend/form";
import aksjonspunktCodes from "@fpsak-frontend/kodeverk/src/aksjonspunktCodes";
import PropTypes from "prop-types";
import styles from './vedtakRedusertUtbetalingArsaker.less';
import redusertUtbetalingArsak from '../../kodeverk/redusertUtbetalingArsak';

const VedtakRedusertUtbetalingArsaker = ({readOnly, aksjonspunkter}) => {
  return <div className={styles.wrapper}>
    {Object.values(redusertUtbetalingArsak).map(name => (
      <CheckboxField
        name={name}
        key={name}
        label={{id: `VedtakForm.RedusertUtbetalingArsak.${name}`}}
        disabled={readOnly}
        checked={aksjonspunkter
          .find(ap => ap.definisjon?.kode === aksjonspunktCodes.FORESLA_VEDTAK_MANUELT)
          ?.redusertUtbetalingÅrsaker
          ?.some(key => key === name)}
      />
    ))}
  </div>
};

VedtakRedusertUtbetalingArsaker.propTypes = {
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired
};

export default VedtakRedusertUtbetalingArsaker;
