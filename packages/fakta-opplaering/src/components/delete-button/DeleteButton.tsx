import { BucketIcon } from '@navikt/ft-plattform-komponenter';
import * as React from 'react';
import styles from './deleteButton.module.css';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps): JSX.Element => (
  <div className={styles.deleteButton__container}>
    <button className={styles.deleteButton__button} type="button" onClick={onClick} aria-label="Fjern periode">
      <BucketIcon />
    </button>
  </div>
);

export default DeleteButton;
