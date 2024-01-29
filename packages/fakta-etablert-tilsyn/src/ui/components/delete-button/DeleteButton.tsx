import * as React from 'react';
import { BucketIcon } from '@navikt/ft-plattform-komponenter';
import styles from './deleteButton.module.css';

const DeleteButton = ({ onClick }) => (
  <div className={styles.deleteButton__container}>
    <button className={styles.deleteButton__button} type="button" onClick={onClick} aria-label="Fjern periode">
      <BucketIcon />
    </button>
  </div>
);

export default DeleteButton;
