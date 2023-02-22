import { prettifyDateString } from '@navikt/k9-date-utils';
import { Link } from '@navikt/ds-react';
import { DocumentIcon } from '@navikt/ft-plattform-komponenter';
import React from 'react';
import Dokument, { dokumentLabel } from '@k9-sak-web/types/src/sykdom/Dokument';
import styles from './dokumentLink.css';

interface DokumentLinkProps {
  dokument: Dokument & { benyttet: boolean };
  etikett?: React.ReactNode;
  visDokumentIkon?: boolean;
}

const DokumentLink = ({ dokument, etikett, visDokumentIkon }: DokumentLinkProps): JSX.Element => {
  const { type, datert, links } = dokument;
  const href = links.find(link => link.rel === 'sykdom-dokument-innhold')?.href;
  return (
    <Link className={styles.dokumentLink} href={href} target="_blank">
      {visDokumentIkon && <DocumentIcon className={styles.dokumentLink__dokumentikon} />}
      {dokumentLabel[type]} {prettifyDateString(datert)}
      {etikett && <div className={styles.dokumentLink__etikett}>{etikett}</div>}
    </Link>
  );
};

export default DokumentLink;
