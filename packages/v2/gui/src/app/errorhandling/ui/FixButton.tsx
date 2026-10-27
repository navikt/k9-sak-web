import { Button } from '@navikt/ds-react';
import type { FC } from 'react';
import type { ErrorFixAction } from './ErrorFixAction.js';

export type FixButtonProps = Readonly<{
  fixAction: ErrorFixAction;
}>;

export const FixButton: FC<FixButtonProps> = ({ fixAction: { button } }) => {
  if (button == null) {
    return null;
  }
  const { label, icon, href, callback } = button;
  const variableProps = callback != null ? ({ onClick: callback } as const) : ({ href, as: 'a' } as const);
  return (
    <Button variant="primary" data-color="neutral" size="small" icon={icon} iconPosition="right" {...variableProps}>
      {label}
    </Button>
  );
};
