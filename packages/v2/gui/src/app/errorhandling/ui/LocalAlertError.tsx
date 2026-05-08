import { LocalAlert } from '@navikt/ds-react';
import { type ComponentProps, type ReactNode } from 'react';
import { ErrorContentBox, ErrorHandlingWizard } from './ErrorHandlingWizard.js';

export type LocalAlertErrorProps = Readonly<{
  title: string;
  children?: ReactNode;
  error: Error;
  fixAction?: ComponentProps<typeof ErrorHandlingWizard>['fixAction'];
}>;

export const LocalAlertError = ({ title, children, error, fixAction }: LocalAlertErrorProps) => {
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errors={[error]} fixAction={fixAction}>
          <ErrorContentBox>{children ?? `${error.message}.`}</ErrorContentBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
