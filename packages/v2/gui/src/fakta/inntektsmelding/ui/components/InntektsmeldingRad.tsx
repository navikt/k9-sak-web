import {
  CheckmarkCircleFillIcon,
  ExclamationmarkTriangleFillIcon,
  EyeWithPupilIcon,
  PaperplaneIcon,
} from '@navikt/aksel-icons';
import { BodyShort, Button, HGrid, Label } from '@navikt/ds-react';
import { useContext } from 'react';
import FeatureTogglesContext from '@k9-sak-web/gui/featuretoggles/FeatureTogglesContext.js';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { ArbeidsgiverArbeidsforholdId } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/ArbeidsgiverArbeidsforholdId.js';
import { Status } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/Status.js';

const statusTekster: Record<Status, string> = {
  [Status.IKKE_PÅKREVD]: 'Ikke påkrevd',
  [Status.MANGLER]: 'Mangler',
  [Status.MOTTATT_IKKE_ANSATT]: 'Mottatt, men ikke ansatt',
  [Status.MOTTATT_UKJENT_ARBEIDSFORHOLDSID]: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
  [Status.FORTSETT_UTEN]: 'Fortsett uten',
  [Status.MOTTATT]: 'Mottatt',
};

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
}

const InntektsmeldingRad = ({ status }: InntektsmeldingRadProps) => {
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
                {erMottatt ? (
                  <>
                    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
                    <span className="ml-2">Mottatt</span>
                  </>
                ) : (
                  <>
                    <ExclamationmarkTriangleFillIcon
                      fontSize="1.5rem"
                      style={{ color: 'var(--ax-text-warning-decoration)' }}
                    />
                    <span className="ml-2">{statusTekster[s.status] ?? s.status}</span>
                  </>
                )}
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
                  <Button size="small" variant="secondary" icon={<PaperplaneIcon aria-hidden />} disabled>
                    Send ny oppgave
                  </Button>
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
