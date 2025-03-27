import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HistorikkInnslagDokumentLink } from '@k9-sak-web/gui/sak/historikk/tilbake/historikkinnslagTsTypeV2.js';

import { FileIcon } from '@navikt/aksel-icons';
import { Link } from '@navikt/ds-react';
import styles from '../historikkMalType.module.css';
import { DOCUMENT_SERVER_URL } from '@k9-sak-web/gui/sak/historikk/documentServerUrl.js';

interface OwnProps {
  dokumentLenke: HistorikkInnslagDokumentLink;
  saksnummer: string;
}

const HistorikkDokumentLenke = ({ dokumentLenke, saksnummer }: OwnProps) => {
  const { tag, journalpostId, dokumentId, utgått } = dokumentLenke;

  if (utgått) {
    return (
      <span className={styles.dokumentLenke}>
        <i className={styles.dokumentIkon} title={tag} />
        <FormattedMessage id="Historikk.Utgått" values={{ tag }} />
      </span>
    );
  }
  return (
    <Link
      className={styles.dokumentLenke}
      href={`${DOCUMENT_SERVER_URL}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
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
