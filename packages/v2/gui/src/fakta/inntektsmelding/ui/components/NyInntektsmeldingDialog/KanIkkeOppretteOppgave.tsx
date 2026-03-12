import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { Alert, BodyShort, Button, Dialog, Label, VStack } from '@navikt/ds-react';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { visnDato } from '../../../../../utils/formatters';
import type { ForespørselStatus } from '@k9-sak-web/backend/k9sak/kodeverk/inntektsmelding/ForespørselStatus.js';
import { ForespørselStatus as ForespørselStatusConst } from '@k9-sak-web/backend/k9sak/kodeverk/inntektsmelding/ForespørselStatus.js';

interface KanIkkeOppretteNyOppgaveContentProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
  forespørselStatus: Exclude<ForespørselStatus, typeof ForespørselStatusConst.UTGÅTT>;
}

export const KanIkkeOppretteNyOppgave = ({
  førsteFraværsdag,
  arbeidsgiver,
  forespørselStatus,
}: KanIkkeOppretteNyOppgaveContentProps) => {
  const { arbeidsforhold } = useInntektsmeldingContext();
  const arbeidsgiverInfo = arbeidsforhold[arbeidsgiver.arbeidsgiver];
  const arbeidsgiverNavn = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? arbeidsgiver.arbeidsgiver;
  const formatertDato = visnDato(førsteFraværsdag);

  const statusTekst = () => {
    if (
      forespørselStatus === ForespørselStatusConst.UNDER_BEHANDLING ||
      forespørselStatus === ForespørselStatusConst.FERDIG
    ) {
      return 'Det finnes allerede en oppgave for dette skjæringstidspunktet. Hvis arbeidsgiver vil gjøre endringer, må de gå til oppgaven som er sendt.';
    }
    if (forespørselStatus === ForespørselStatusConst.STP_MER_ENN_4_UKER) {
      return 'Kan ikke opprette oppgave fordi det er mer enn 4 uker til skjæringstidspunktet.';
    }
    throw new Error('Utviklerfeil: Har ikke håndtert alle mulige typer forespørselStatus');
  };

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
            {statusTekst()}
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
