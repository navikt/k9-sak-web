import { Dialog, HStack, LocalAlert, Spacer, VStack } from '@navikt/ds-react';
import type { ErrorViewProps } from './resolveErrorViewProps.js';
import { ErrorReportPopover } from "./ErrorReportPopover.js";
import { FixButton } from "./FixButton.js"
import { ErrorReportButton } from "./ErrorReportButton.js";
import { makeErrorReportLinkForJira } from "./makeErrorReportText.js";
import { ErrorPanel } from "./ErrorPanel.js";

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

  const reportLink = makeErrorReportLinkForJira([error]);
  return (
    <LocalAlert status="error">
      <LocalAlert.Header>
        <LocalAlert.Title>{title}</LocalAlert.Title>
        <LocalAlert.CloseButton onClick={onClose} />
      </LocalAlert.Header>
      <LocalAlert.Content>
        <VStack gap="space-8">
          <ErrorPanel errorInfo={errorInfo} fixAction={fixAction} />
          <HStack gap="space-4" align="center">
            <FixButton fixAction={fixAction} />
            <ErrorReportButton reportLink={reportLink} />
            <Spacer />
            <ErrorReportPopover errors={[error]} />
          </HStack>
        </VStack>
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
