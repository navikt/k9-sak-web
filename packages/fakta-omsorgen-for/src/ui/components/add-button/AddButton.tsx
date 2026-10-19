import { PlusCircleIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import styles from './addButton.module.css';

interface AddButtonProps {
  onClick: () => void;
  label: string;
  id?: string;
  className?: string;
}

const AddButton = ({ className, label, onClick, id }: AddButtonProps): JSX.Element => (
  <button className={`${styles.addButton} ${className || ''}`} type="button" onClick={onClick} id={id || ''}>
    <PlusCircleIcon fontSize="1.25rem" />
    <span className={styles.addButton__text}>{label}</span>
  </button>
);

export default AddButton;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type _VenterPåSletting =
  import('@k9-sak-web/gui/featuretoggles/FeatureToggles.js').FeatureToggles['BRUK_OMSORGEN_FOR_V2'];
