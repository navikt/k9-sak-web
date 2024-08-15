import { Alert, BodyShort } from '@navikt/ds-react';
import React from 'react';

import styles from './ingenBehandlingValgtPanel.module.css';

const getMessage = (numBehandlinger: number): string =>
  numBehandlinger === 0 ? 'Ingen behandlinger er opprettet' : 'Velg behandling';

interface OwnProps {
  numBehandlinger: number;
}

/**
 * NoSelectedBehandling
 *
 * Presentasjonskomponent. Vises når ingen behandling er valgt på en fagsak
 */
const IngenBehandlingValgtPanel = ({ numBehandlinger }: OwnProps) => (
  <div className={styles.noSelectedBehandlingPanel} data-testid="IngenBehandlingValgtPanel">
    <Alert size="small" variant="info">
      <BodyShort size="small">{getMessage(numBehandlinger)}</BodyShort>
    </Alert>
  </div>
);

export default IngenBehandlingValgtPanel;
