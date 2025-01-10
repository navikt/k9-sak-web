import * as React from 'react';
import { BucketIcon } from '@navikt/ft-plattform-komponenter';
import styles from './deleteButton.module.css';

import type { JSX } from 'react';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps): JSX.Element => (
  <div className={styles.deleteButton__container}>
    <button className={styles.deleteButton__button} type="button" aria-label="Fjern periode" onClick={onClick}>
      <BucketIcon />
    </button>
  </div>
);

export default DeleteButton;
