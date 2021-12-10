import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { FastsattOpptjeningAktivitet } from '@k9-sak-web/types';
import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';

import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

interface OwnProps {
  months: number;
  days: number;
  fastsattOpptjeningActivities?: FastsattOpptjeningAktivitet[];
  opptjeningFomDate: string;
  opptjeningTomDate: string;
}

/**
 * OpptjeningVilkarView
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */
export const OpptjeningVilkarViewImpl = ({
  months,
  days,
  fastsattOpptjeningActivities = [],
  opptjeningFomDate,
  opptjeningTomDate,
}: OwnProps) => (
  <>
    <FormattedMessage id="OpptjeningVilkarView.MonthsAndDays" values={{ months, days }} />
    <Normaltekst>
      <PeriodLabel dateStringFom={opptjeningFomDate} dateStringTom={opptjeningTomDate} />
    </Normaltekst>
    <VerticalSpacer fourPx />
    {fastsattOpptjeningActivities.length > 0 && (
      <OpptjeningTimeLineLight
        opptjeningPeriods={fastsattOpptjeningActivities}
        opptjeningFomDate={opptjeningFomDate}
        opptjeningTomDate={opptjeningTomDate}
      />
    )}
  </>
);

export default OpptjeningVilkarViewImpl;
