import { LocalAlert } from '@navikt/ds-react';
import { type ReactNode } from 'react';
import { ErrorContentBox, ErrorHandlingWizard } from './ErrorHandlingWizard.js';

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
          <ErrorContentBox>{children ?? `${error.message}.`}</ErrorContentBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
