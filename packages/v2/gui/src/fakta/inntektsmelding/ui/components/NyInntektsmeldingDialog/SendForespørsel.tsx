import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { BodyShort, Button, Dialog, HStack, Label, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { useEtterspørInntektsmelding } from '../../../api/inntektsmeldingQueries';
import { visnDato } from '../../../../../utils/formatters';
import { ForespørselSendtSettPåVent } from './ForespørselSendtSettPåVent';

interface SendForespørselContentProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
}

interface FormData {
  begrunnelse: string;
}

export const SendForespørselContent = ({ førsteFraværsdag, arbeidsgiver }: SendForespørselContentProps) => {
  const { arbeidsforhold, behandlingUuid } = useInntektsmeldingContext();
  const etterspørInntektsmeldingMutation = useEtterspørInntektsmelding();
  const arbeidsgiverInfo = arbeidsforhold[arbeidsgiver.arbeidsgiver];
  const arbeidsgiverNavn = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? arbeidsgiver.arbeidsgiver;
  const formatertDato = visnDato(førsteFraværsdag);
  const formMethods = useForm<FormData>({
    defaultValues: {
      begrunnelse: '',
    },
    mode: 'onBlur',
  });

  const handleSubmit = (data: FormData) => {
    etterspørInntektsmeldingMutation.mutate({
      behandlingUuid,
      skjæringstidspunkt: førsteFraværsdag,
      orgnr: arbeidsgiver.arbeidsgiver,
      // TODO: Add begrunnelse
    });
  };

  if (etterspørInntektsmeldingMutation.isSuccess) {
    return <ForespørselSendtSettPåVent />;
  }

  return (
    <RhfForm formMethods={formMethods} onSubmit={handleSubmit}>
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
          <RhfTextarea
            control={formMethods.control}
            name="begrunnelse"
            label="Begrunnelse"
            description="Begrunnelsen er kun synlig i historikken, og vil ikke sendes til arbeidsgiver."
            size="small"
            minRows={4}
            validate={[required, minLength(1)]}
          />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer>
        <HStack gap="space-16" justify="end">
          <Dialog.CloseTrigger>
            <Button variant="secondary" size="small">
              Avbryt
            </Button>
          </Dialog.CloseTrigger>
          <Button variant="primary" size="small" type="submit" loading={etterspørInntektsmeldingMutation.isPending}>
            Send forespørsel
          </Button>
        </HStack>
      </Dialog.Footer>
    </RhfForm>
  );
};
