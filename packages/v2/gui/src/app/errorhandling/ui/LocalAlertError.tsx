import { LocalAlert } from '@navikt/ds-react';
import { type ComponentProps, type ReactNode } from 'react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import { resolveMissingErrorViewProps } from './resolveErrorViewProps.js';
import type { ErrorAndId } from '../AlertInfo.js';

export type LocalAlertErrorProps = Readonly<{
  title?: string;
  children?: ReactNode;
  errorAndId: ErrorAndId;
  fixAction?: ComponentProps<typeof ErrorHandlingWizard>['fixAction'];
}>;

export const LocalAlertError = ({ errorAndId, children, ...rest }: LocalAlertErrorProps) => {
  const { title, errorInfo, fixAction } = resolveMissingErrorViewProps(
    { errorInfo: children, ...rest },
    errorAndId.error,
  );
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errorAndIds={[errorAndId]} fixAction={fixAction}>
          <ErrorHandlingWizard.ErrorBox>{errorInfo}</ErrorHandlingWizard.ErrorBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};
