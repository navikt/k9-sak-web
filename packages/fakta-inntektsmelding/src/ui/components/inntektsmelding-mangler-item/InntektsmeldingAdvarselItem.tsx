import { ExclamationmarkTriangleFillIcon } from '@navikt/aksel-icons';
import { type JSX } from 'react';
import { Status } from '../../../types/KompletthetData';
import ArbeidsgiverTekst from '../arbeidsgiver-tekst/ArbeidsgiverTekst';
import styles from '../inntektsmelding-mottatt-item/inntektsmeldingMottattItem.module.css';
import ListItem from '../list-item/ListItem';

interface InntektsmeldingMottattItemProps {
  status: Status;
}

interface ManglerContentProps {
  tekst: string;
}

const ManglerContent = ({ tekst }: ManglerContentProps) => (
  <div className={styles.mottattLabel}>
    <ExclamationmarkTriangleFillIcon fontSize="1.5rem" style={{ color: 'var(--ax-text-warning-decoration)' }} />
    <span className={styles.mottattLabel__text}>{tekst}</span>
  </div>
);

const tekster = {
  IKKE_PÅKREVD: 'Ikke påkrevd',
  MANGLER: 'Mangler',
  MOTTATT_IKKE_ANSATT: 'Mottatt, men ikke ansatt',
  MOTTATT_UKJENT_ARBEIDSFORHOLDSID: 'Mottatt, men inneholder ukjent arbeidsforhold-ID',
};

const InntektsmeldingAdvarselItem = ({ status }: InntektsmeldingMottattItemProps): JSX.Element => {
  const tekst = tekster[status.status];
  const firstColumnRenderer = () => <ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />;
  const secondColumnRenderer = () => <ManglerContent tekst={tekst} />;
  return <ListItem firstColumnRenderer={firstColumnRenderer} secondColumnRenderer={secondColumnRenderer} />;
};

export default InntektsmeldingAdvarselItem;
