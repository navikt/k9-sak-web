import { LocalAlert } from '@navikt/ds-react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import type { ErrorViewProps } from './resolveErrorViewProps.js';

export type ErrorAlertProps = ErrorViewProps;

export const ErrorAlert = ({ error, title, errorInfo, fixAction }: ErrorAlertProps) => {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errors={[error]} fixAction={fixAction}>
          <ErrorHandlingWizard.ErrorBox>{errorInfo}</ErrorHandlingWizard.ErrorBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
