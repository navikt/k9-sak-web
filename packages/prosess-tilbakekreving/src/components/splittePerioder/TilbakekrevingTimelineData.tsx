import React from 'react';

import DataForPeriode from '../../types/dataForPeriodeTsType';
import PeriodeController from './PeriodeController';
import PeriodeInformasjon from './PeriodeInformasjon';

type OwnProps = {
  periode: DataForPeriode;
  callbackForward: (...args: any[]) => any;
  callbackBackward: (...args: any[]) => any;
  oppdaterSplittedePerioder: (...args: any[]) => any;
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  beregnBelop: (data: any) => Promise<any>;
};

export const TilbakekrevingTimelineData = ({
  periode,
  callbackForward,
  callbackBackward,
  readOnly,
  oppdaterSplittedePerioder,
  behandlingId,
  behandlingVersjon,
  beregnBelop,
}: OwnProps) => (
  <div>
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
  </div>
);

export default TilbakekrevingTimelineData;
