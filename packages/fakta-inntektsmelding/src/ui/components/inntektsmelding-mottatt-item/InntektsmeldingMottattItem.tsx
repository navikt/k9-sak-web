import { Link } from '@navikt/ds-react';
import { GreenCheckIconFilled } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import ContainerContext from '../../../context/ContainerContext';
import { DokumentOpplysninger } from '../../../types/ContainerContract';
import { Status } from '../../../types/KompletthetData';
import ArbeidsgiverTekst from '../arbeidsgiver-tekst/ArbeidsgiverTekst';
import ListItem from '../list-item/ListItem';
import styles from './inntektsmeldingMottattItem.module.css';

interface MottattContentProps {
  dokumentLink: string;
}

const MottattContent = ({ dokumentLink }: MottattContentProps) => (
  <div className={styles.mottattLabel}>
    <GreenCheckIconFilled />
    <div>
      <span className={styles.mottattLabel__text}>Mottatt</span>
      <Link className={styles.mottattLabel__link} href={dokumentLink} target="_blank">
        Vis inntektsmelding
      </Link>
    </div>
  </div>
);

interface InntektsmeldingMottattItemProps {
  status: Status;
}

const finnDokumentLink = (dokumenter: DokumentOpplysninger[], journalpostId: string) =>
  dokumenter.find(dokument => dokument.journalpostId === journalpostId);

const InntektsmeldingMottattItem = ({ status }: InntektsmeldingMottattItemProps): JSX.Element => {
  const { dokumenter } = React.useContext(ContainerContext);
  const dokumentLink = finnDokumentLink(dokumenter || [], status.journalpostId)?.href;
  const firstColumnRenderer = () => <ArbeidsgiverTekst arbeidsgiver={status.arbeidsgiver} />;
  const secondColumnRenderer = () => <MottattContent dokumentLink={dokumentLink || '#'} />;
  return <ListItem firstColumnRenderer={firstColumnRenderer} secondColumnRenderer={secondColumnRenderer} />;
};

export default InntektsmeldingMottattItem;
