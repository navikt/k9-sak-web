import PropTypes from 'prop-types';
import React from 'react';

import PeriodeController from './PeriodeController';
import PeriodeInformasjon from './PeriodeInformasjon';

export const TilbakekrevingTimelineData = ({
  periode,
  callbackForward,
  callbackBackward,
  readOnly,
  oppdaterSplittedePerioder,
  behandlingId,
  behandlingVersjon,
  beregnBelop,
}) => (
  <>
    <PeriodeController
      callbackForward={callbackForward}
      callbackBackward={callbackBackward}
      periode={periode}
      readOnly={readOnly}
      oppdaterSplittedePerioder={oppdaterSplittedePerioder}
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      beregnBelop={beregnBelop}
    />
    <PeriodeInformasjon
      feilutbetaling={periode.feilutbetaling}
      fom={periode.fom}
      tom={periode.tom}
      arsak={periode.årsak}
    />
  </>
);

TilbakekrevingTimelineData.propTypes = {
  periode: PropTypes.shape().isRequired,
  callbackForward: PropTypes.func.isRequired,
  callbackBackward: PropTypes.func.isRequired,
  oppdaterSplittedePerioder: PropTypes.func.isRequired,
  readOnly: PropTypes.bool.isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  beregnBelop: PropTypes.func.isRequired,
};

export default TilbakekrevingTimelineData;
