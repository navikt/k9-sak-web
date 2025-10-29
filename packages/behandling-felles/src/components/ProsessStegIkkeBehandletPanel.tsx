import { FadingPanel } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';

import styles from './prosessStegIkkeBehandletPanel.module.css';

const ProsessStegIkkeBehandletPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <BodyShort size="small">
        Dette steget er ikke behandlet
      </BodyShort>
    </FadingPanel>
  </div>
);

export default ProsessStegIkkeBehandletPanel;
