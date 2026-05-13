import { Dialog, LocalAlert } from '@navikt/ds-react';
import { ErrorHandlingWizard } from './ErrorHandlingWizard.js';
import type { ErrorViewProps } from './resolveErrorViewProps.js';

export type ErrorModalProps = Readonly<{
  errorProps?: ErrorViewProps;
  onClose(): void;
}>;

const ErrorDialogContent = (
  {
    errorProps: { error, title, errorInfo, fixAction },
    onClose,
  }: Required<ErrorModalProps> /* errorProps er alltid sett her */,
) => {
  // Vurder å legge inn noko slikt: const fixAction = {...fa, info: <>{fa.info}<BodyLong>Hvis du har fylt ut viktig, ulagret informasjon i skjermbildet kan du lukke denne dialog og ta vare på informasjonen først.</BodyLong></>}
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={onClose} />
      </LocalAlert.Header>
      <LocalAlert.Content>
        <ErrorHandlingWizard errors={[error]} fixAction={fixAction}>
          <ErrorHandlingWizard.ErrorBox>{errorInfo}</ErrorHandlingWizard.ErrorBox>
        </ErrorHandlingWizard>
      </LocalAlert.Content>
    </LocalAlert>
  );
};

export const ErrorModal = ({ onClose, errorProps }: ErrorModalProps) => {
  return (
    <Dialog open={errorProps != null} onOpenChange={changeTo => (!changeTo ? onClose() : null)}>
      <Dialog.Popup closeOnOutsideClick={false} role="alertdialog" width="large">
        {errorProps != null ? <ErrorDialogContent errorProps={errorProps} onClose={onClose} /> : null}
      </Dialog.Popup>
    </Dialog>
  );
};
