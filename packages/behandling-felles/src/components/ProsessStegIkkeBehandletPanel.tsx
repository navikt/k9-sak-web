import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import styles from './prosessStegIkkeBehandletPanel.module.css';

const ProsessStegIkkeBehandletPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <Normaltekst>
        <FormattedMessage id="ProsessStegIkkeBehandletPanel.IkkeBehandlet" />
      </Normaltekst>
    </FadingPanel>
  </div>
);

export default ProsessStegIkkeBehandletPanel;
