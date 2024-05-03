import { FadingPanel } from '@k9-sak-web/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './prosessStegIkkeBehandletPanel.module.css';

const ProsessStegIkkeBehandletPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <BodyShort size="small">
        <FormattedMessage id="ProsessStegIkkeBehandletPanel.IkkeBehandlet" />
      </BodyShort>
    </FadingPanel>
  </div>
);

export default ProsessStegIkkeBehandletPanel;
