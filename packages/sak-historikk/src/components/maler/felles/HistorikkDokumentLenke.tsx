
import type { DokumentLink } from '@k9-sak-web/backend/combined/behandling/historikk/DokumentLink.js';

import { DOCUMENT_SERVER_URL_K9, DOCUMENT_SERVER_URL_UNG } from '@k9-sak-web/gui/sak/historikk/documentServerUrl.js';
import { isUngWeb } from '@k9-sak-web/gui/utils/urlUtils.js';
import { FileIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import styles from '../historikkMalType.module.css';

interface OwnProps {
  dokumentLenke: DokumentLink;
  saksnummer: string;
}

const HistorikkDokumentLenke = ({ dokumentLenke, saksnummer }: OwnProps) => {
  const { tag, journalpostId, dokumentId, utgått } = dokumentLenke;
  const isUng = isUngWeb();
  if (utgått) {
    return (
      <span className={styles.dokumentLenke}>
        <i className={styles.dokumentIkon} title={tag} />
        `{tag} (utgått)`
      </span>
    );
  }
  return (
    <Link
      className={styles.dokumentLenke}
      href={`${isUng ? DOCUMENT_SERVER_URL_UNG : DOCUMENT_SERVER_URL_K9}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
      target="_blank"
      rel="noopener noreferrer"
      inlineText
    >
      <FileIcon title="Dokument" fontSize="1.5rem" />
      {tag}
    </Link>
  );
};

export default HistorikkDokumentLenke;
