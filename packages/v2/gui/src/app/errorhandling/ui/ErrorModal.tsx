import { BodyLong, Button, CopyButton, Dialog, LocalAlert, ReadMore, Tooltip, VStack } from '@navikt/ds-react';
import { ErrorReference } from './ErrorReference.js';
import { ArrowCirclepathIcon, XMarkIcon } from '@navikt/aksel-icons';
import css from './textsizedButton.module.css';
import { resolveErrorUiData } from './resolveErrorUiData.js';

export interface ErrorModalProps {
  readonly error: Error | undefined;
  onClose(): void;
  onReload(): void;
}

export const ErrorModal = ({ error, onClose, onReload }: ErrorModalProps) => {
  const { errorRef, additionalInfo } = resolveErrorUiData(error);
  return (
    <Dialog open={error != null} onOpenChange={changeTo => (!changeTo ? onClose() : null)}>
      <Dialog.Popup closeOnOutsideClick={false} role="alertdialog" width="large">
        {error != null ? (
          <LocalAlert status="error">
            <LocalAlert.Header>
              <LocalAlert.Title>Uventet feil ({error.name})</LocalAlert.Title>
              <LocalAlert.CloseButton onClick={onClose} />
            </LocalAlert.Header>
            <LocalAlert.Content>
              <VStack gap="space-16">
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
                <ReadMore size="small" header="Dette kan bety at skjermbildet ikke viser korrekt tilstand.">
                  <p>
                    For å sikre at skjermbildet viser korrekt tilstand for sak bør du laste inn på nytt.
                    <Tooltip content="Last på nytt">
                      <Button
                        variant="tertiary-neutral"
                        className={css.textsizedButton}
                        size="xsmall"
                        icon={<ArrowCirclepathIcon />}
                        onClick={onReload}
                      ></Button>
                    </Tooltip>
                  </p>
                  <p>
                    <b>NB:</b> hvis du har fyllt inn data i skjema på siden inn vil dette sannsynligvis forsvinne hvis
                    du trykker <i>Last på nytt</i>. Lukk feilmelding uten å laste på nytt hvis du har behov for å
                    kopiere ut skjemadata.
                  </p>
                </ReadMore>
                {errorRef != null ? (
                  <small>
                    Inkluder <ErrorReference ref={errorRef} /> hvis du rapporterer inn denne feilen.
                  </small>
                ) : null}
              </VStack>
            </LocalAlert.Content>
            <Dialog.Footer>
              <Button variant="tertiary-neutral" size="xsmall" icon={<XMarkIcon />} onClick={onClose}>
                Lukk feilmelding
              </Button>
              <CopyButton
                data-color="neutral"
                size="xsmall"
                copyText={`Feilreferanse: ${errorRef}`}
                text="Kopier feilreferanse"
              />
              <Tooltip content="Laster alt på nytt. Ikke lagret informasjon vil forsvinne.">
                <Button
                  variant="tertiary"
                  data-color="warning"
                  size="xsmall"
                  icon={<ArrowCirclepathIcon />}
                  onClick={onReload}
                >
                  Last på nytt
                </Button>
              </Tooltip>
            </Dialog.Footer>
          </LocalAlert>
        ) : null}
      </Dialog.Popup>
    </Dialog>
  );
};
