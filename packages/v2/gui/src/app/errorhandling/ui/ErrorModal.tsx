import { BodyLong, Dialog, LocalAlert, VStack } from '@navikt/ds-react';
import { resolveErrorUiData } from './resolveErrorUiData.js';
import { ErrorContentBox, ErrorHandlingWizard, retryAction } from './ErrorHandlingWizard.js';

export interface ErrorModalProps {
  readonly error: Error | undefined;
  onClose(): void;
  onTryAgain?: () => void;
}

export const ErrorModal = ({ error, onClose, onTryAgain }: ErrorModalProps) => {
  const retryTxt = onTryAgain ? 'prøve på nytt' : 'laste inn på nytt';
  const fixAction = onTryAgain ? retryAction(onTryAgain) : undefined;
  const { additionalInfo } = resolveErrorUiData(error);
  return (
    <Dialog open={error != null} onOpenChange={changeTo => (!changeTo ? onClose() : null)}>
      <Dialog.Popup closeOnOutsideClick={false} role="alertdialog" width="large">
        {error != null ? (
          <LocalAlert status="error">
            <LocalAlert.Header>
              <LocalAlert.Title>Uventet feil</LocalAlert.Title>
              <LocalAlert.CloseButton onClick={onClose} />
            </LocalAlert.Header>
            <LocalAlert.Content>
              <ErrorHandlingWizard errors={[error]} fixAction={fixAction} withoutDefaultInfo>
                <ErrorContentBox>
                  <div>{error.message}</div>
                  {/* additionalInfo er noko som kan komme frå legacy kode. Litt uvisst kva innhaldet kan vere. Implementert tilsvarande som utlisting i legacy ErrorMessageDetailsModal */}
                  {additionalInfo != null ? (
                    <VStack gap="space-4">
                      {Object.entries(additionalInfo).map(([key, val]) => {
                        return (
                          <BodyLong key={key} size="small">
                            <i>{key}</i>: {typeof val == 'string' ? val : String(val)}
                          </BodyLong>
                        );
                      })}
                    </VStack>
                  ) : null}
                </ErrorContentBox>
                <BodyLong>
                  Skjermbildet kan mangle/vise feil informasjon. For å sikre korrekt visning bør du {retryTxt}.{' '}
                </BodyLong>
                <BodyLong>
                  <b>NB:</b> Hvis du har utfylt skjemainformasjon som ikke er lagret, lukk denne dialog og ta vare på
                  skjemainformasjon først.
                </BodyLong>
                <BodyLong> Rapporter feil i porten hvis den vedvarer.</BodyLong>
              </ErrorHandlingWizard>
            </LocalAlert.Content>
          </LocalAlert>
        ) : null}
      </Dialog.Popup>
    </Dialog>
  );
};
