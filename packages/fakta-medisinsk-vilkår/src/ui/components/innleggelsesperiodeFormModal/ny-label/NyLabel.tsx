import styles from './nyLabel.module.css';

import { Tooltip } from '@navikt/ds-react';
import type { JSX } from 'react';

const NyLabel = (): JSX.Element => (
  <div className={styles.nyLabel__container}>
    <Tooltip content="Ny periode lagt til nå">
      <div className={styles.nyLabel__icon}>Ny</div>
    </Tooltip>
  </div>
);

export default NyLabel;
