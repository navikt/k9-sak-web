import { LocalAlert } from '@navikt/ds-react';
import { type ReactNode } from 'react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';

export type LocalAlertErrorProps = Readonly<{
  title: string;
  children?: ReactNode;
  error: Error;
  onTryAgain?: () => void;
}>;

export const LocalAlertError = ({ title, children, error, onTryAgain }: LocalAlertErrorProps) => {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errors={[error]} onTryAgain={onTryAgain}>
          {children ?? `${error.message}.`}
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
