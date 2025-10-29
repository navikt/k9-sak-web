import { PeriodLabel } from '@fpsak-frontend/shared-components';
import { formatCurrencyWithKr } from '@fpsak-frontend/utils';
import { ISO_DATE_FORMAT } from '@k9-sak-web/lib/dateUtils/formats.js';
import { BodyShort, Box, Table } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
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
      <Box.New padding="4" borderWidth="1" borderRadius="medium">
        <BodyShort size="small">
          Ingen inntekt i Norge de siste tre månedene
        </BodyShort>
      </Box.New>
    );
  }

  return (
    <Box.New padding="4" borderWidth="1" borderRadius="medium">
      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(textCode => (
              <Table.HeaderCell scope="col" key={textCode}>
                {intl.formatMessage({ id: textCode })}
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
    </Box.New>
  );
};

export default InntektOgYtelserFaktaPanel;
