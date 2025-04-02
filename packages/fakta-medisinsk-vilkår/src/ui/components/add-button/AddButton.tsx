import { PlusCircleIcon } from '@navikt/aksel-icons';
import { forwardRef, Ref, type JSX } from 'react';
import styles from './addButton.module.css';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  id?: string;
  className?: string;
  noIcon?: boolean;
  ariaLabel?: string;
}

const AddButton = forwardRef(
  ({ className, label, onClick, id, noIcon, ariaLabel }: AddButtonProps, ref?: Ref<HTMLButtonElement>): JSX.Element => (
    <button
      className={`${styles.addButton} ${className || ''}`}
      type="button"
      onClick={onClick}
      id={id || ''}
      aria-label={ariaLabel}
      ref={ref}
    >
      {!noIcon && <PlusCircleIcon fontSize="1.25rem" />}
      <span className={styles.addButton__text}>{label}</span>
    </button>
  ),
);

export default AddButton;
