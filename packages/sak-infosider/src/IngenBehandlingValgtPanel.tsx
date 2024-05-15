import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage, RawIntlProvider, createIntl, createIntlCache } from 'react-intl';
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
      <Alert size="small" variant="info">
        <BodyShort size="small">
          <FormattedMessage id={getMessage(numBehandlinger)} />
        </BodyShort>
      </Alert>
    </div>
  </RawIntlProvider>
);

export default IngenBehandlingValgtPanel;
