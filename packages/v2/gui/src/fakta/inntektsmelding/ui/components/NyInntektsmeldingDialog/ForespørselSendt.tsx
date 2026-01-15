import { Alert, BodyShort, Button, DatePicker, Dialog, HStack, useDatepicker, VStack } from '@navikt/ds-react';
import dayjs from 'dayjs';
import { useState } from 'react';
import { ISO_DATE_FORMAT } from '@navikt/ft-utils';

interface ForespørselSendtContentProps {
  onGåTilbake: () => void;
}

export const ForespørselSendtContent = ({ onGåTilbake }: ForespørselSendtContentProps) => {
  const [frist, setFrist] = useState('');

  const defaultSelected = frist ? dayjs(frist, ISO_DATE_FORMAT).toDate() : undefined;
  const defaultMonth = defaultSelected || new Date();

  const onDateChange = (date?: Date) => {
    if (!date) {
      setFrist('');
      return;
    }
    const isoDateString = dayjs(date).format(ISO_DATE_FORMAT);
    setFrist(isoDateString);
  };

  const { datepickerProps, inputProps } = useDatepicker({
    defaultMonth,
    onDateChange,
    defaultSelected,
    fromDate: new Date(),
    toDate: dayjs().add(2, 'years').toDate(),
  });

  const handleSettPåVent = () => {
    if (frist) {
      // TODO: Implementer sett på vent logikk
      console.log('Setter på vent med frist:', frist);
      onGåTilbake();
    }
  };

  return (
    <>
      <Dialog.Body>
        <VStack gap="space-24">
          <Alert variant="success" size="small">
            Ny oppgave om inntektsmelding er sendt til arbeidsgiver.
          </Alert>

          <div>
            <HStack gap="space-2" align="center">
              <BodyShort size="small">Behandlingen settes på vent med frist:</BodyShort>
              <DatePicker {...datepickerProps}>
                <DatePicker.Input {...inputProps} label="Frist" hideLabel size="small" />
              </DatePicker>
            </HStack>
          </div>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer>
        <div className="flex gap-2 justify-end">
          <Dialog.CloseTrigger>
            <Button variant="secondary" onClick={onGåTilbake}>
              Gå tilbake til saken
            </Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button variant="primary" onClick={handleSettPåVent} disabled={!frist}>
              Sett på vent
            </Button>
          </Dialog.CloseTrigger>
        </div>
      </Dialog.Footer>
    </>
  );
};
