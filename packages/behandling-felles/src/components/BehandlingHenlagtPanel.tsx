import { Normaltekst } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { FadingPanel } from '@fpsak-frontend/shared-components';

import styles from './behandlingHenlagtPanel.css';

const BehandlingHenlagtPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <Normaltekst>
        <FormattedMessage id="BehandlingHenlagtPanel.Henlagt" />
      </Normaltekst>
    </FadingPanel>
  </div>
);

export default BehandlingHenlagtPanel;
