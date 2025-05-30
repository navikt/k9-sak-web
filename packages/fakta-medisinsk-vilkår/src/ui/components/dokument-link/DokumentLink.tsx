import { prettifyDateString } from '@fpsak-frontend/utils';
import { FileIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import LinkRel from '../../../constants/LinkRel';
import Dokument, { dokumentLabel } from '../../../types/Dokument';
import { findLinkByRel } from '../../../util/linkUtils';
import styles from './dokumentLink.module.css';

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
      {visDokumentIkon && <FileIcon fontSize="1.5rem" />}
      {dokumentLabel[type]} {prettifyDateString(datert)}
      {etikett && <div className={styles.dokumentLink__etikett}>{etikett}</div>}
    </Link>
  );
};

export default DokumentLink;
