import React from 'react';
import { PlusIcon } from '@navikt/ft-plattform-komponenter';
import styles from './addButton.module.css';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  id?: string;
  className?: string;
}

const AddButton = ({ className, label, onClick, id }: AddButtonProps) => (
  <button className={`${styles.addButton} ${className || ''}`} type="button" onClick={onClick} id={id || ''}>
    <PlusIcon />
    <span className={styles.addButton__text}>{label}</span>
  </button>
);

export default AddButton;
