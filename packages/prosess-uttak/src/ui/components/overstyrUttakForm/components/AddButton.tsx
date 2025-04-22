import { PlusCircleIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import styles from './addButton.module.css';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const AddButton = ({ className, label, onClick, id, disabled = false }: AddButtonProps): JSX.Element => (
  <button
    disabled={disabled}
    className={`${styles.addButton} ${className || ''}`}
    type="button"
    onClick={onClick}
    id={id || ''}
  >
    <PlusCircleIcon fontSize="1.25rem" />
    <span className={styles.addButton__text}>{label}</span>
  </button>
);

export default AddButton;
