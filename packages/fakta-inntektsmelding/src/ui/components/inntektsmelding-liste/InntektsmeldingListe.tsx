import React from 'react';
import { Status } from '../../../types/KompletthetData';
import InntektsmeldingMottattItem from '../inntektsmelding-mottatt-item/InntektsmeldingMottattItem';
import InntektsmeldingAdvarsel from '../inntektsmelding-mangler-item/InntektsmeldingAdvarselItem';
import styles from './inntektsmeldingListe.css';

interface PeriodListItemProps {
  status: Status[];
}

const RenderListItem = ({ status }: { status: Status }) => {
  const listItem = children => (
    <li className={styles.inntektsmeldingListe__item} key={status.journalpostId}>
      {children}
    </li>
  );
  if (status.status === 'MOTTATT') {
    return listItem(<InntektsmeldingMottattItem status={status} />);
  }

  return listItem(<InntektsmeldingAdvarsel status={status} />);
};

const InntektsmeldingListe = ({ status }: PeriodListItemProps): JSX.Element => (
  <ul className={styles.inntektsmeldingListe}>
    {status.map((v, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <RenderListItem key={index} status={v} />
    ))}
  </ul>
);

export default InntektsmeldingListe;
