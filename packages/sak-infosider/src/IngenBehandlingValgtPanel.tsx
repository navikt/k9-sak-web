import { BodyShort } from '@navikt/ds-react';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { createIntl, createIntlCache, FormattedMessage, RawIntlProvider } from 'react-intl';
import messages from '../i18n/nb_NO.json';

import styles from './ingenBehandlingValgtPanel.module.css';

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
const IngenBehandlingValgtPanel = ({ numBehandlinger }: OwnProps) => (
  <RawIntlProvider value={intl}>
    <div className={styles.noSelectedBehandlingPanel} data-testid="IngenBehandlingValgtPanel">
      <AlertStripeInfo>
        <BodyShort size="small">
          <FormattedMessage id={getMessage(numBehandlinger)} />
        </BodyShort>
      </AlertStripeInfo>
    </div>
  </RawIntlProvider>
);

export default IngenBehandlingValgtPanel;
