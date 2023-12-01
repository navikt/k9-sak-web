import { ContentWithTooltip } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import styles from './nyLabel.css';

const NyLabel = (): JSX.Element => (
  <div className={styles.nyLabel__container}>
    <ContentWithTooltip tooltipText="Ny periode lagt til nå">
      <div className={styles.nyLabel__icon}>Ny</div>
    </ContentWithTooltip>
  </div>
);

export default NyLabel;
