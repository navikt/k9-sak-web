import { ContentWithTooltip } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import styles from './nyLabel.module.css';

import type { JSX } from 'react';

const NyLabel = (): JSX.Element => (
  <div className={styles.nyLabel__container}>
    <ContentWithTooltip tooltipText="Ny periode lagt til nå">
      <div className={styles.nyLabel__icon}>Ny</div>
    </ContentWithTooltip>
  </div>
);

export default NyLabel;
