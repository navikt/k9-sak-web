import { prettifyDateString } from '@navikt/k9-fe-date-utils';
import { DocumentIcon } from '@navikt/ft-plattform-komponenter';
import { Link } from '@navikt/ds-react';
import React from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './dokumentLink.css';

interface DokumentLinkProps {
  dokument: Dokument;
  etikett?: React.ReactNode;
  visDokumentIkon?: boolean;
}

const DokumentLink = ({ dokument, etikett, visDokumentIkon }: DokumentLinkProps): JSX.Element => {
  const { type, datert, links } = dokument;
  const dokumentLink = findLinkByRel(LinkRel.DOKUMENT_INNHOLD, links);
  return (
    <Link className={styles.dokumentLink} href={dokumentLink.href} target="_blank">
      {visDokumentIkon && <DocumentIcon className={styles.dokumentLink__dokumentikon} />}
      {dokumentLabel[type]} {prettifyDateString(datert)}
      {etikett && <div className={styles.dokumentLink__etikett}>{etikett}</div>}
    </Link>
  );
};

export default DokumentLink;
