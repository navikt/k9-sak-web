import { Dialog, LocalAlert } from '@navikt/ds-react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import type { ComponentProps, ReactNode } from 'react';
import { resolveMissingErrorViewProps } from './resolveErrorViewProps.js';

export type ErrorModalProps = Readonly<{
  title?: string;
  children?: ReactNode;
  error?: Error;
  fixAction?: ComponentProps<typeof ErrorHandlingWizard>['fixAction'];
  onClose(): void;
}>;

const ErrorDialogContent = (
  { error, children, onClose, ...rest }: ErrorModalProps & { error: Error } /* error er alltid satt her */,
) => {
  const { title, errorInfo, fixAction } = resolveMissingErrorViewProps({ errorInfo: children, ...rest }, error);
  // Vurder å legge inn noko slikt: const fixAction = {...fa, info: <>{fa.info}<BodyLong>Hvis du har fylt ut viktig, ulagret informasjon i skjermbildet kan du lukke denne dialog og ta vare på informasjonen først.</BodyLong></>}
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={onClose} />
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard reportErrors={[error]} fixAction={fixAction}>
          <ErrorHandlingWizard.ErrorBox>{errorInfo}</ErrorHandlingWizard.ErrorBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};

export const ErrorModal = ({ error, onClose, children, ...rest }: ErrorModalProps) => {
  return (
    <Dialog open={error != null} onOpenChange={changeTo => (!changeTo ? onClose() : null)}>
      <Dialog.Popup closeOnOutsideClick={false} role="alertdialog" width="large">
        {error != null ? (
          <ErrorDialogContent error={error} onClose={onClose} {...rest}>
            {children}
          </ErrorDialogContent>
        ) : null}
      </Dialog.Popup>
    </Dialog>
  );
};
