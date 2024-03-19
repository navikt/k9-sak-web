import { PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';
import { ISO_DATE_FORMAT, formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { BodyShort } from '@navikt/ds-react';
import moment from 'moment';
import Panel from 'nav-frontend-paneler';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Inntekt } from '../InntektType';

const headerTextCodes = [
  'InntektOgYtelserFaktaPanel.Employer',
  'InntektOgYtelserFaktaPanel.Period',
  'InntektOgYtelserFaktaPanel.Amount',
];

const sortInntekter = (inntekt1: Inntekt, inntekt2: Inntekt) =>
  moment(inntekt2.fom, ISO_DATE_FORMAT).diff(moment(inntekt1.fom, ISO_DATE_FORMAT));

interface InntektOgYtelserFaktaPanelProps {
  inntekter?: Inntekt[];
}

const InntektOgYtelserFaktaPanel: React.FC<InntektOgYtelserFaktaPanelProps> = ({ inntekter }) => {
  if (!inntekter || inntekter.length === 0) {
    return (
      <Panel border>
        <BodyShort size="small">
          <FormattedMessage id="InntektOgYtelserFaktaPanel.NoInformation" />
        </BodyShort>
      </Panel>
    );
  }

  return (
    <Panel border>
      <Table headerTextCodes={headerTextCodes}>
        {inntekter.sort(sortInntekter).map(inntekt => {
          const key = inntekt.navn + inntekt.utbetaler + inntekt.fom + inntekt.tom + inntekt.belop;
          return (
            <TableRow key={key} id={key}>
              <TableColumn>{inntekt.utbetaler}</TableColumn>
              <TableColumn>
                <PeriodLabel showTodayString dateStringFom={inntekt.fom} dateStringTom={inntekt.tom} />
              </TableColumn>
              <TableColumn>{formatCurrencyWithKr(inntekt.belop)}</TableColumn>
            </TableRow>
          );
        })}
      </Table>
    </Panel>
  );
};

export default InntektOgYtelserFaktaPanel;
