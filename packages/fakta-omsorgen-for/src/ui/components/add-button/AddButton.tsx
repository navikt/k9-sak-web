import React from 'react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import styles from './addButton.css';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  id?: string;
  className?: string;
}

const AddButton = ({ className, label, onClick, id }: AddButtonProps): JSX.Element => (
  <button className={`${styles.addButton} ${className || ''}`} type="button" onClick={onClick} id={id || ''}>
    <PlusIcon />
    <span className={styles.addButton__text}>{label}</span>
  </button>
);

export default AddButton;
