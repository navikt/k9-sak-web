import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';

import { getKodeverknavnFn } from '@fpsak-frontend/utils';
import { DateLabel, FlexContainer, FlexColumn, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';

import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

import { EtikettInfo } from 'nav-frontend-etiketter';

import styles from './skjeringspunktOgStatusPanel.less';
import beregningStyles from '../beregningsgrunnlagPanel/beregningsgrunnlag.less';
import AvsnittSkiller from '../redesign/AvsnittSkiller';

const createStatusEtiketter = (listeMedStatuser, getKodeverknavn) => {
  const statusList = [];
  const unikeStatuser = listeMedStatuser.filter(
    (status, index, self) => index === self.findIndex(t => t.kode === status.kode),
  );
  unikeStatuser.forEach(status => {
    const statusName = getKodeverknavn(status);
    statusList.push({ visningsNavn: statusName, kode: status.kode, className: `statusFarge${status.kode}` });
  });
  statusList.sort((a, b) => (a.visningsNavn > b.visningsNavn ? 1 : -1));
  return (
    <>
      {statusList.map(status => (
        <EtikettInfo key={status.visningsNavn} className={styles[status.className]} title={status.visningsNavn}>
          {status.visningsNavn}
        </EtikettInfo>
      ))}
    </>
  );
};

/**
 * SkjeringspunktOgStatusPanel
 *
 * Viser skjæringstidspunkt for beregningen og en liste med aktivitetsstatuser.
 */

export const SkjeringspunktOgStatusPanelImpl = ({ skjeringstidspunktDato, aktivitetStatusList, getKodeverknavn }) => (
  <>
    <AvsnittSkiller luftUnder leftPanel />
    <div className={beregningStyles.panelLeft}>
      {createStatusEtiketter(aktivitetStatusList, getKodeverknavn)}
      <VerticalSpacer sixteenPx />
      <FlexContainer>
        <FlexRow>
          <FlexColumn>
            <Normaltekst>
              <FormattedMessage id="Beregningsgrunnlag.Skjeringstidspunkt.SkjeringForBeregning" />
            </Normaltekst>
          </FlexColumn>
          <FlexColumn>
            <Normaltekst className={beregningStyles.semiBoldText}>
              <DateLabel dateString={skjeringstidspunktDato} />
            </Normaltekst>
          </FlexColumn>
        </FlexRow>
      </FlexContainer>
    </div>
  </>
);

SkjeringspunktOgStatusPanelImpl.propTypes = {
  skjeringstidspunktDato: PropTypes.string.isRequired,
  aktivitetStatusList: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getKodeverknavn: PropTypes.func.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  const getKodeverknavn = getKodeverknavnFn(ownProps.alleKodeverk, kodeverkTyper);
  return {
    getKodeverknavn,
  };
};

const SkjeringspunktOgStatusPanel = connect(mapStateToProps)(SkjeringspunktOgStatusPanelImpl);

export default SkjeringspunktOgStatusPanel;
