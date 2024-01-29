import { Link } from '@navikt/ds-react';
import * as React from 'react';
import { DocumentIcon } from '@navikt/ft-plattform-komponenter';
import styles from './dokumentKnapp.module.css';

interface DokumentKnappProps {
  href: string;
}

const DokumentKnapp = ({ href }: DokumentKnappProps): JSX.Element => (
  <Link href={href} target="_blank" className={styles.dokumentKnapp}>
    <DocumentIcon />
    Åpne dokument
  </Link>
);

export default DokumentKnapp;
