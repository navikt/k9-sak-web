import { PlusCircleIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';
import { forwardRef, Ref, type JSX } from 'react';

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
    <Button
      className={className}
      type="button"
      onClick={onClick}
      id={id || ''}
      aria-label={ariaLabel}
      ref={ref}
      icon={noIcon ? undefined : <PlusCircleIcon fontSize="1.25rem" />}
      variant="tertiary"
      size="xsmall"
    >
      {label}
    </Button>
  ),
);

export default AddButton;
