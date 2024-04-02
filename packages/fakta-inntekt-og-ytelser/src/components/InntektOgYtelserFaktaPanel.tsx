import { PeriodLabel } from '@fpsak-frontend/shared-components';
import { ISO_DATE_FORMAT, formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { BodyShort, Table } from '@navikt/ds-react';
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
      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(textCode => (
              <Table.HeaderCell scope="col" key={textCode}>
                {textCode}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {inntekter.sort(sortInntekter).map(inntekt => {
            const key = inntekt.navn + inntekt.utbetaler + inntekt.fom + inntekt.tom + inntekt.belop;
            return (
              <Table.Row key={key} id={key}>
                <Table.DataCell>{inntekt.utbetaler}</Table.DataCell>
                <Table.DataCell>
                  <PeriodLabel showTodayString dateStringFom={inntekt.fom} dateStringTom={inntekt.tom} />
                </Table.DataCell>
                <Table.DataCell>{formatCurrencyWithKr(inntekt.belop)}</Table.DataCell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Panel>
  );
};

export default InntektOgYtelserFaktaPanel;
