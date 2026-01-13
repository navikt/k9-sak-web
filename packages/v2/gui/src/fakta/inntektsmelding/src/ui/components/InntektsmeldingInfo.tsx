import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import type { JSX } from 'react';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { ArbeidsgiverArbeidsforholdId, Status } from '../../types';

const statusTekster: Record<string, string> = {
  IKKE_PÅKREVD: 'Ikke påkrevd',
  MANGLER: 'Mangler',
  MOTTATT_IKKE_ANSATT: 'Mottatt, men ikke ansatt',
  MOTTATT_UKJENT_ARBEIDSFORHOLDSID: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
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

interface InntektsmeldingListeProps {
  status: Status[];
}

const InntektsmeldingInfo = ({ status }: InntektsmeldingListeProps): JSX.Element => {
  const { dokumenter } = useInntektsmeldingContext();

  const finnDokumentLink = (journalpostId: string) =>
    dokumenter?.find(d => d.journalpostId === journalpostId)?.href ?? '#';

  return (
    <>
      {/* Heading */}
      <div className="flex">
        <div className="basis-[35%]">
          <b>Arbeidsgiver</b>
        </div>
        <div>
          <b>Status inntektsmelding</b>
        </div>
      </div>

      {/* Liste over arbeidsgivere */}
      <ul className="m-0 list-none p-0">
        {status.map((s, index) => {
          const erMottatt = s.status === 'MOTTATT';

          return (
            // eslint-disable-next-line react/no-array-index-key
            <li className="mt-3" key={index}>
              <div className="flex">
                {/* Arbeidsgiver */}
                <div className="basis-[35%]">
                  <ArbeidsgiverTekst arbeidsgiver={s.arbeidsgiver} />
                </div>

                {/* Status */}
                <div className="flex items-start">
                  {erMottatt ? (
                    <>
                      <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
                      <span className="ml-2">Mottatt</span>
                      <Link className="ml-4" href={finnDokumentLink(s.journalpostId ?? '')} target="_blank">
                        Vis inntektsmelding
                      </Link>
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
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default InntektsmeldingInfo;
