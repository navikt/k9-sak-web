import { FadingPanel } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import styles from './behandlingHenlagtPanel.module.css';

const BehandlingHenlagtPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <BodyShort size="small">Behandlingen er henlagt</BodyShort>
    </FadingPanel>
  </div>
);

export default BehandlingHenlagtPanel;
