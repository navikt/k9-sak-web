import { LocalAlert } from '@navikt/ds-react';
import { type ComponentProps, type ReactNode } from 'react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { resolveMissingErrorViewProps } from './resolveErrorViewProps.js';

export type LocalAlertErrorProps = Readonly<{
  title?: string;
  children?: ReactNode;
  error: Error;
  fixAction?: ComponentProps<typeof ErrorHandlingWizard>['fixAction'];
}>;

export const LocalAlertError = ({ error, children, ...rest }: LocalAlertErrorProps) => {
  const { title, errorInfo, fixAction } = resolveMissingErrorViewProps({ errorInfo: children, ...rest }, error);
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
