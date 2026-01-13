import { CheckmarkCircleFillIcon, ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import type { JSX } from 'react';
import { useInntektsmeldingContext } from '../../context/InntektsmeldingContext';
import type { DokumentOpplysninger, Status } from '../../types';
import ArbeidsgiverTekst from './ArbeidsgiverTekst';
import ListItem from './ListItem';

// Heading
const InntektsmeldingListeHeading = (): JSX.Element => (
  <ListItem firstColumn={<b>Arbeidsgiver</b>} secondColumn={<b>Status inntektsmelding</b>} />
);

// Mottatt item
const MottattContent = ({ dokumentLink }: { dokumentLink: string }) => (
  <div className="flex items-start">
    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
    <div>
      <span className="ml-2">Mottatt</span>
      <Link className="ml-4" href={dokumentLink} target="_blank">
        Vis inntektsmelding
      </Link>
    </div>
  </div>
);

const finnDokumentLink = (
  dokumenter: DokumentOpplysninger[],
  journalpostId: string,
): DokumentOpplysninger | undefined => dokumenter.find(dokument => dokument.journalpostId === journalpostId);

const InntektsmeldingMottattItem = ({ status }: { status: Status }): JSX.Element => {
  const { dokumenter } = useInntektsmeldingContext();
  const dokumentLink = finnDokumentLink(dokumenter ?? [], status.journalpostId ?? '')?.href;
  return (
    <ListItem
      firstColumn={<ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />}
      secondColumn={<MottattContent dokumentLink={dokumentLink ?? '#'} />}
    />
  );
};

// Advarsel item
const ManglerContent = ({ tekst }: { tekst: string }) => (
  <div className="flex items-start">
    <ExclamationmarkTriangleFillIcon fontSize="1.5rem" style={{ color: 'var(--ax-text-warning-decoration)' }} />
    <span className="ml-2">{tekst}</span>
  </div>
);

type StatusKey = 'IKKE_PÅKREVD' | 'MANGLER' | 'MOTTATT_IKKE_ANSATT' | 'MOTTATT_UKJENT_ARBEIDSFORHOLDSID';

const statusTekster: Record<StatusKey, string> = {
  IKKE_PÅKREVD: 'Ikke påkrevd',
  MANGLER: 'Mangler',
  MOTTATT_IKKE_ANSATT: 'Mottatt, men ikke ansatt',
  MOTTATT_UKJENT_ARBEIDSFORHOLDSID: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
};

const InntektsmeldingAdvarselItem = ({ status }: { status: Status }): JSX.Element => {
  const tekst = statusTekster[status.status as StatusKey] ?? status.status;
  return (
    <ListItem
      firstColumn={<ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />}
      secondColumn={<ManglerContent tekst={tekst} />}
    />
  );
};

// List item renderer
const RenderListItem = ({ status }: { status: Status }): JSX.Element => {
  const content =
    status.status === 'MOTTATT' ? (
      <InntektsmeldingMottattItem status={status} />
    ) : (
      <InntektsmeldingAdvarselItem status={status} />
    );
  return (
    <li className="mt-3" key={status.journalpostId}>
      {content}
    </li>
  );
};

// Main component
interface InntektsmeldingListeProps {
  status: Status[];
}

const InntektsmeldingListe = ({ status }: InntektsmeldingListeProps): JSX.Element => (
  <>
    <InntektsmeldingListeHeading />
  <ul className="m-0 list-none p-0">
    {status.map((v, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <RenderListItem key={index} status={v} />
    ))}
  </ul>
  </>
);

export default InntektsmeldingListe;
