import { WarningIcon } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import { Status } from '../../../types/KompletthetData';
import ListItem from '../list-item/ListItem';
import styles from '../inntektsmelding-mottatt-item/inntektsmeldingMottattItem.css';
import ArbeidsgiverTekst from '../arbeidsgiver-tekst/ArbeidsgiverTekst';

interface InntektsmeldingMottattItemProps {
  status: Status;
}

interface ManglerContentProps {
  tekst: string;
}

const ManglerContent = ({ tekst }: ManglerContentProps) => (
  <div className={styles.mottattLabel}>
    <WarningIcon />
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
