import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { BodyShort, Button, Dialog, HStack, Label, VStack } from '@navikt/ds-react';
import { RhfForm, RhfTextarea } from '@navikt/ft-form-hooks';
import { minLength, required } from '@navikt/ft-form-validators';
import { useForm } from 'react-hook-form';
import { useInntektsmeldingContext } from '../../../context/InntektsmeldingContext';
import { useEtterspørInntektsmelding } from '../../../api/inntektsmeldingQueries';
import { visnDato } from '../../../../../utils/formatters';
import { ForespørselSendtSettPåVent } from './ForespørselSendtSettPåVent';
import dayjs from 'dayjs';

interface SendForespørselContentProps {
  førsteFraværsdag: string;
  arbeidsgiver: ArbeidsgiverArbeidsforholdId;
}

interface FormData {
  begrunnelse: string;
}

// Vi skal flytte første fraværsdag til mandag hvis den faller på søndag eller lørdag
const hvisHelgedagFlyttFørsteFraværsdagTilMandag = (førsteFraværsdag: string) => {
  // Søndag -> Mandag
  if (dayjs(førsteFraværsdag).day() === 0) {
    return dayjs(førsteFraværsdag).add(1, 'day').format('YYYY-MM-DD');
  }
  // Lørdag -> Mandag
  if (dayjs(førsteFraværsdag).day() === 6) {
    return dayjs(førsteFraværsdag).add(2, 'day').format('YYYY-MM-DD');
  }
  return førsteFraværsdag;
};
export const SendForespørselContent = ({ førsteFraværsdag, arbeidsgiver }: SendForespørselContentProps) => {
  const { arbeidsforhold, behandling } = useInntektsmeldingContext();
  const etterspørInntektsmeldingMutation = useEtterspørInntektsmelding();
  const arbeidsgiverInfo = arbeidsforhold[arbeidsgiver.arbeidsgiver];
  const arbeidsgiverNavn = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? arbeidsgiver.arbeidsgiver;
  const skjæringstidspunkt = hvisHelgedagFlyttFørsteFraværsdagTilMandag(førsteFraværsdag);
  const formatertDato = visnDato(skjæringstidspunkt);
  const formMethods = useForm<FormData>({
    defaultValues: {
      begrunnelse: '',
    },
    mode: 'onBlur',
  });

  // TODO: Add begrunnelse
  const handleSubmit = () => {
    etterspørInntektsmeldingMutation.mutate({
      behandlingUuid: behandling.uuid,
      skjæringstidspunkt,
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
