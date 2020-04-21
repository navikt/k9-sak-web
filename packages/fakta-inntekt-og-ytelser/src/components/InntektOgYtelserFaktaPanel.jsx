import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import moment from 'moment';
import { Normaltekst } from 'nav-frontend-typografi';
import Panel from 'nav-frontend-paneler';

import { formatCurrencyWithKr, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { PeriodLabel, Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';

const headerTextCodes = [
  'InntektOgYtelserFaktaPanel.Employer',
  'InntektOgYtelserFaktaPanel.Period',
  'InntektOgYtelserFaktaPanel.Amount',
];

const sortInntekter = (inntekt1, inntekt2) => {
  return moment(inntekt2.fom, ISO_DATE_FORMAT).diff(moment(inntekt1.fom, ISO_DATE_FORMAT));
};

const InntektOgYtelserFaktaPanel = ({ inntekter }) => {
  if (!inntekter || inntekter.length === 0) {
    return (
      <Panel border>
        <Normaltekst>
          <FormattedMessage id="InntektOgYtelserFaktaPanel.NoInformation" />
        </Normaltekst>
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

InntektOgYtelserFaktaPanel.propTypes = {
  inntekter: PropTypes.arrayOf(PropTypes.shape()),
};

InntektOgYtelserFaktaPanel.defaultProps = {
  inntekter: [],
};

export default InntektOgYtelserFaktaPanel;
