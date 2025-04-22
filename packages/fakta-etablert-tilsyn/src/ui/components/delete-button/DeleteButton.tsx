import { TrashIcon } from '@navikt/aksel-icons';
import styles from './deleteButton.module.css';

const DeleteButton = ({ onClick }) => (
  <div className={styles.container}>
    <button className={styles.button} type="button" onClick={onClick} aria-label="Fjern periode">
      <TrashIcon fontSize="1.5rem" />
    </button>
  </div>
);

export default DeleteButton;
