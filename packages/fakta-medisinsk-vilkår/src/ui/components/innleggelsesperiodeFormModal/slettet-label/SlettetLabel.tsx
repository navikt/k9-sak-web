import styles from './slettetLabel.module.css';

import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import type { JSX } from 'react';

const SlettetLabel = (): JSX.Element => (
  <div className={styles.slettetLabel__container}>
    <ExclamationmarkTriangleFillIcon
      title="Slettet"
      fontSize="1.5rem"
      style={{ color: 'var(--ax-text-warning-decoration))' }}
    />
  </div>
);

export default SlettetLabel;
