import { FadingPanel } from '@fpsak-frontend/shared-components';
import { BodyShort } from '@navikt/ds-react';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './behandlingHenlagtPanel.module.css';

const BehandlingHenlagtPanel = () => (
  <div className={styles.container}>
    <FadingPanel>
      <BodyShort size="small">
        <FormattedMessage id="BehandlingHenlagtPanel.Henlagt" />
      </BodyShort>
    </FadingPanel>
  </div>
);

export default BehandlingHenlagtPanel;
