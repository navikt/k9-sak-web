import { Dialog, LocalAlert } from '@navikt/ds-react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import type { ComponentProps, ReactNode } from 'react';
import { resolveMissingErrorViewProps } from './resolveErrorViewProps.js';
import type { ErrorAndId } from '../AlertInfo.js';

export type ErrorModalProps = Readonly<{
  title?: string;
  children?: ReactNode;
  errorAndId?: ErrorAndId;
  fixAction?: ComponentProps<typeof ErrorHandlingWizard>['fixAction'];
  onClose(): void;
}>;

const ErrorDialogContent = (
  {
    errorAndId,
    children,
    onClose,
    ...rest
  }: ErrorModalProps & Required<Pick<ErrorModalProps, 'errorAndId'>> /* errorAndId er alltid satt her */,
) => {
  const { title, errorInfo, fixAction } = resolveMissingErrorViewProps(
    { errorInfo: children, ...rest },
    errorAndId.error,
  );
  // Vurder å legge inn noko slikt: const fixAction = {...fa, info: <>{fa.info}<BodyLong>Hvis du har fylt ut viktig, ulagret informasjon i skjermbildet kan du lukke denne dialog og ta vare på informasjonen først.</BodyLong></>}
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={onClose} />
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errorAndIds={[errorAndId]} fixAction={fixAction}>
          <ErrorHandlingWizard.ErrorBox>{errorInfo}</ErrorHandlingWizard.ErrorBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};

export const ErrorModal = ({ errorAndId, onClose, children, ...rest }: ErrorModalProps) => {
  return (
    <Dialog open={errorAndId != null} onOpenChange={changeTo => (!changeTo ? onClose() : null)}>
      <Dialog.Popup closeOnOutsideClick={false} role="alertdialog" width="large">
        {errorAndId != null ? (
          <ErrorDialogContent errorAndId={errorAndId} onClose={onClose} {...rest}>
            {children}
          </ErrorDialogContent>
        ) : null}
      </Dialog.Popup>
    </Dialog>
  );
};
