import { PeriodLabel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { FastsattOpptjeningAktivitet } from '@k9-sak-web/types';
import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import OpptjeningTimeLineLight from './OpptjeningTimeLineLight';

/**
 * OpptjeningVilkarView
 *
 * Presentasjonskomponent. Viser resultatet av opptjeningsvilkåret.
 */

interface OpptjeningVilkarViewImplProps {
  months: number;
  days: number;
  fastsattOpptjeningActivities: FastsattOpptjeningAktivitet[];
  opptjeningFomDate: string;
  opptjeningTomDate: string;
}

export const OpptjeningVilkarViewImpl = ({
  months,
  days,
  fastsattOpptjeningActivities = [],
  opptjeningFomDate,
  opptjeningTomDate,
}: OpptjeningVilkarViewImplProps) => (
  <>
    <FormattedMessage id="OpptjeningVilkarView.MonthsAndDays" values={{ months, days }} />
    <Normaltekst>
      <PeriodLabel dateStringFom={opptjeningFomDate} dateStringTom={opptjeningTomDate} />
    </Normaltekst>
    <VerticalSpacer fourPx />
    {fastsattOpptjeningActivities.length > 0 && (
      <OpptjeningTimeLineLight
        key={opptjeningFomDate.concat(opptjeningTomDate)}
        opptjeningPeriods={fastsattOpptjeningActivities}
        opptjeningFomDate={opptjeningFomDate}
        opptjeningTomDate={opptjeningTomDate}
      />
    )}
  </>
);

export default OpptjeningVilkarViewImpl;
