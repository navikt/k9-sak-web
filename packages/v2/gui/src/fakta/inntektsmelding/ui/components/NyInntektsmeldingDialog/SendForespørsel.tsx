import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { BodyShort, Button, Dialog, Label, Textarea, VStack } from '@navikt/ds-react';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { useSendInntektsmeldingOppgave } from '../../../api/inntektsmeldingQueries';
import { visnDato } from '../../../../../utils/formatters';
import { ForespørselSendtContent } from './ForespørselSendt';

interface SendForespørselContentProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
  begrunnelse: string;
  onBegrunnelseChange: (value: string) => void;
}

export const SendForespørselContent = ({
  førsteFraværsdag,
  arbeidsgiver,
  begrunnelse,
  onBegrunnelseChange,
}: SendForespørselContentProps) => {
  const { arbeidsforhold, behandlingUuid } = useInntektsmeldingContext();
  const arbeidsgiverInfo = arbeidsforhold[arbeidsgiver.arbeidsgiver];
  const arbeidsgiverNavn = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? arbeidsgiver.arbeidsgiver;
  const formatertDato = visnDato(førsteFraværsdag);
  const sendOppgaveMutation = useSendInntektsmeldingOppgave();

  const handleSend = () => {
    sendOppgaveMutation.mutate({
      behandlingUuid,
      førsteFraværsdag,
      arbeidsgiver,
      begrunnelse: begrunnelse || undefined,
    });
  };

  const handleGåTilbake = () => {
    onBegrunnelseChange('');
    sendOppgaveMutation.reset();
  };

  if (sendOppgaveMutation.isSuccess) {
    return <ForespørselSendtContent onGåTilbake={handleGåTilbake} />;
  }

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

          <Textarea
            label="Begrunnelse"
            description="Begrunnelsen er kun synlig i historikken, og vil ikke sendes til arbeidsgiver."
            value={begrunnelse}
            onChange={e => onBegrunnelseChange(e.target.value)}
            size="small"
            minRows={4}
          />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer>
        <div className="flex gap-2 justify-end">
          <Dialog.CloseTrigger>
            <Button variant="secondary">Avbryt</Button>
          </Dialog.CloseTrigger>
          <Dialog.CloseTrigger>
            <Button
              variant="primary"
              onClick={handleSend}
              loading={sendOppgaveMutation.isPending}
              disabled={sendOppgaveMutation.isPending}
            >
              Send forespørsel
            </Button>
          </Dialog.CloseTrigger>
        </div>
      </Dialog.Footer>
    </>
  );
};
