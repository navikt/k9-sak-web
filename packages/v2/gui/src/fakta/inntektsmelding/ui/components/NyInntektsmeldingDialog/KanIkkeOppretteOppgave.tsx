import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { Alert, BodyShort, Button, Dialog, Label, VStack } from '@navikt/ds-react';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { visnDato } from '../../../../../utils/formatters';

interface KanIkkeOppretteNyOppgaveContentProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
}

export const KanIkkeOppretteNyOppgave = ({ førsteFraværsdag, arbeidsgiver }: KanIkkeOppretteNyOppgaveContentProps) => {
  const { arbeidsforhold } = useInntektsmeldingContext();
  const arbeidsgiverInfo = arbeidsforhold[arbeidsgiver.arbeidsgiver];
  const arbeidsgiverNavn = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? arbeidsgiver.arbeidsgiver;
  const formatertDato = visnDato(førsteFraværsdag);

  return (
    <>
      <Dialog.Body>
        <VStack gap="space-24">
          <div>
            <Label size="small" as="div" className="mb-1">
              For første fraværsdag
            </Label>
            <BodyShort size="small">{formatertDato}</BodyShort>
          </div>

          <div>
            <Label size="small" as="div" className="mb-1">
              Til arbeidsgiver
            </Label>
            <BodyShort size="small">{arbeidsgiverNavn}</BodyShort>
          </div>

          <Alert variant="warning" size="small">
            Det finnes allerede en oppgave for dette skjæringstidspunktet. Hvis arbeidsgiver vil gjøre endringer, må de
            gå til oppgaven som er sendt.
          </Alert>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer>
        <div className="flex gap-2 justify-end">
          <Dialog.CloseTrigger>
            <Button variant="secondary" size="small">
              Avbryt
            </Button>
          </Dialog.CloseTrigger>
        </div>
      </Dialog.Footer>
    </>
  );
};
