import React from 'react';
import { FormattedMessage } from 'react-intl';

import { HistorikkInnslagDokumentLink } from '@k9-sak-web/types';

import styles from '../historikkMalType.module.css';

const DOCUMENT_SERVER_URL = '/k9/sak/api/dokument/hent-dokument';

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
    <a
      className={styles.dokumentLenke}
      href={`${DOCUMENT_SERVER_URL}?saksnummer=${saksnummer}&journalpostId=${journalpostId}&dokumentId=${dokumentId}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <i className={styles.dokumentIkon} title={tag} />
      {tag}
    </a>
  );
};

export default HistorikkDokumentLenke;
