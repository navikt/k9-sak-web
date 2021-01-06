import React, { FunctionComponent } from 'react';
import { createIntl, createIntlCache, FormattedMessage, RawIntlProvider } from 'react-intl';
import { Normaltekst } from 'nav-frontend-typografi';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';

import messages from '../i18n/nb_NO.json';

import styles from './ingenBehandlingValgtPanel.less';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const getMessage = (numBehandlinger: number): string =>
  numBehandlinger === 0
    ? 'IngenBehandlingValgtPanel.ZeroBehandlinger'
    : 'IngenBehandlingValgtPanel.PleaseSelectBehandling';

interface OwnProps {
  numBehandlinger: number;
}

/**
 * NoSelectedBehandling
 *
 * Presentasjonskomponent. Vises når ingen behandling er valgt på en fagsak
 */
const IngenBehandlingValgtPanel: FunctionComponent<OwnProps> = ({ numBehandlinger }) => (
  <RawIntlProvider value={intl}>
    <div className={styles.noSelectedBehandlingPanel}>
      <AlertStripeInfo>
        <Normaltekst>
          <FormattedMessage id={getMessage(numBehandlinger)} />
        </Normaltekst>
      </AlertStripeInfo>
    </div>
  </RawIntlProvider>
);

export default IngenBehandlingValgtPanel;
