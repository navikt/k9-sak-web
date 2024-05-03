import { PeriodLabel } from '@k9-sak-web/shared-components';
import { ISO_DATE_FORMAT, formatCurrencyWithKr } from '@k9-sak-web/utils';
import { BodyShort, Box, Table } from '@navikt/ds-react';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
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
  const intl = useIntl();
  if (!inntekter || inntekter.length === 0) {
    return (
      <Box background="surface-default" padding="4" borderWidth="1" borderColor="border-subtle" borderRadius="medium">
        <BodyShort size="small">
          <FormattedMessage id="InntektOgYtelserFaktaPanel.NoInformation" />
        </BodyShort>
      </Box>
    );
  }

  return (
    <Box background="surface-default" padding="4" borderWidth="1" borderColor="border-subtle" borderRadius="medium">
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
    </Box>
  );
};

export default InntektOgYtelserFaktaPanel;
