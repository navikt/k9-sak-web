import { EyeWithPupilIcon } from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Label } from '@navikt/ds-react';
import { useContext } from 'react';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { Status } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/Status.js';
import InntektsmeldingStatus from './InntektsmeldingStatus';
import { NyInntektsmeldingDialog } from './NyInntektsmeldingDialog/NyInntektsmeldingDialog';

const ArbeidsgiverTekst = ({ arbeidsgiver }: { arbeidsgiver: ArbeidsgiverArbeidsforholdId }) => {
  const { arbeidsforhold } = useInntektsmeldingContext();
  const id = arbeidsgiver.arbeidsgiver;
  const arbeidsgiverInfo = arbeidsforhold[id];
  const tekst = arbeidsgiverInfo?.navn ?? arbeidsgiverInfo?.fødselsdato ?? id;

  return (
    <span>
      {tekst} (Arbeidsforhold {arbeidsgiver.arbeidsforhold})
    </span>
  );
};

interface InntektsmeldingRadProps {
  status: Array<{
    status: Status;
    arbeidsgiver: ArbeidsgiverArbeidsforholdId;
    journalpostId?: string;
  }>;
  førsteFraværsdag: string;
}

const InntektsmeldingRad = ({ status, førsteFraværsdag }: InntektsmeldingRadProps) => {
  const { dokumenter } = useInntektsmeldingContext();
  const featureToggles = useContext(FeatureTogglesContext);

  const finnDokumentLink = (journalpostId: string) =>
    dokumenter?.find(d => d.journalpostId === journalpostId)?.href ?? '#';

  const visSendNyOppgave = featureToggles.SAKSBEHANDLERINITIERT_INNTEKTSMELDING;

  return (
    <div>
      {/* Header */}
      <HGrid gap="space-4" columns={{ xs: '2fr 2fr 3fr' }} className="mt-[1.375rem] mb-[0.8125rem]">
        <Label size="small" as="div">
          Arbeidsgiver
        </Label>
        <Label size="small" as="div">
          Status inntektsmelding
        </Label>
        <Label size="small" as="div">
          Handlinger
        </Label>
      </HGrid>

      {/* Rader */}
      <div className="space-y-3">
        {status.map((s, index) => {
          const erMottatt = s.status === Status.MOTTATT;

          return (
            <HGrid key={index} gap="space-4" columns={{ xs: '2fr 2fr 3fr' }} align="center">
              <BodyShort size="small">
                <ArbeidsgiverTekst arbeidsgiver={s.arbeidsgiver} />
              </BodyShort>
              <div className="flex items-center">
                <InntektsmeldingStatus status={s.status} />
              </div>
              <div className="flex gap-2">
                <Button
                  size="small"
                  variant="secondary"
                  icon={<EyeWithPupilIcon aria-hidden />}
                  href={finnDokumentLink(s.journalpostId ?? '')}
                  target="_blank"
                  disabled={!s.journalpostId || !erMottatt}
                  as="a"
                >
                  Åpne
                </Button>
                {visSendNyOppgave && (
                  <NyInntektsmeldingDialog
                    førsteFraværsdag={førsteFraværsdag}
                    arbeidsgiver={s.arbeidsgiver}
                    harEksisterendeOppgave={false} // TODO: Sjekk faktisk status fra backend når dette er implementert
                    tidligereOppgaveSendtDato={undefined} // TODO: Hent fra backend når dette er implementert
                  />
                )}
              </div>
            </HGrid>
          );
        })}
      </div>
    </div>
  );
};

export default InntektsmeldingRad;
