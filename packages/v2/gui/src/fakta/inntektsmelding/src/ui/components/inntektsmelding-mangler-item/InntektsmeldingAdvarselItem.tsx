import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import type { JSX } from 'react';
import type { Status } from '../../../types/KompletthetData';
import ArbeidsgiverTekst from '../arbeidsgiver-tekst/ArbeidsgiverTekst';
import ListItem from '../list-item/ListItem';

interface InntektsmeldingAdvarselItemProps {
  status: Status;
}

interface ManglerContentProps {
  tekst: string;
}

const ManglerContent = ({ tekst }: ManglerContentProps) => (
  <div className="flex items-start">
    <ExclamationmarkTriangleFillIcon fontSize="1.5rem" style={{ color: 'var(--ax-text-warning-decoration)' }} />
    <span className="ml-2">{tekst}</span>
  </div>
);

type StatusKey = 'IKKE_PÅKREVD' | 'MANGLER' | 'MOTTATT_IKKE_ANSATT' | 'MOTTATT_UKJENT_ARBEIDSFORHOLDSID';

const tekster: Record<StatusKey, string> = {
  IKKE_PÅKREVD: 'Ikke påkrevd',
  MANGLER: 'Mangler',
  MOTTATT_IKKE_ANSATT: 'Mottatt, men ikke ansatt',
  MOTTATT_UKJENT_ARBEIDSFORHOLDSID: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
};

const InntektsmeldingAdvarselItem = ({ status }: InntektsmeldingAdvarselItemProps): JSX.Element => {
  const tekst = tekster[status.status as StatusKey] ?? status.status;
  const firstColumnRenderer = () => <ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />;
  const secondColumnRenderer = () => <ManglerContent tekst={tekst} />;
  return <ListItem firstColumnRenderer={firstColumnRenderer} secondColumnRenderer={secondColumnRenderer} />;
};

export default InntektsmeldingAdvarselItem;
