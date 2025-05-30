import styles from './deleteButton.module.css';

import { TrashIcon } from '@navikt/aksel-icons';
import type { JSX } from 'react';

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton = ({ onClick }: DeleteButtonProps): JSX.Element => (
  <div className={styles.deleteButton__container}>
    <button className={styles.deleteButton__button} type="button" onClick={onClick} aria-label="Fjern periode">
      <TrashIcon fontSize="1.5rem" />
    </button>
  </div>
);

export default DeleteButton;
