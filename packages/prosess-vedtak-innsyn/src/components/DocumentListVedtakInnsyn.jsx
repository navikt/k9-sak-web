import { Column, Row } from 'nav-frontend-grid';
import { Normaltekst, Undertekst } from 'nav-frontend-typografi';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Table, TableColumn, TableRow } from '@fpsak-frontend/shared-components';

import styles from './documentListVedtakInnsyn.css';

// TODO (TOR) Flytt url ut av komponent
const DOCUMENT_SERVER_URL = '/k9/sak/api/dokument/hent-dokument';
const getLink = (document, saksNr) =>
  `${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

const headerTextCodes = ['DocumentListVedtakInnsyn.Dokument'];

/**
 * DocumentListVedtakInnsyn
 *
 * Presentasjonskomponent. Viser dokumenter  som er valgt til innsyn i en liste . Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentListVedtakInnsyn = ({ documents, saksNr }) => {
  if (documents.length === 0) {
    return (
      <Normaltekst className={styles.noDocuments}>
        <FormattedMessage id="DocumentListVedtakInnsyn.NoDocuments" />
      </Normaltekst>
    );
  }

  return (
    <>
      <Undertekst className={styles.noDocuments}>
        <FormattedMessage id="DocumentListVedtakInnsyn.InnsynsDok" />
      </Undertekst>
      <Row>
        <Column xs="6">
          <Table noHover headerTextCodes={headerTextCodes}>
            {documents.map(document => {
              const dokId = parseInt(document.dokumentId, 10);
              return (
                <TableRow key={dokId} id={dokId}>
                  <TableColumn className={styles.linkCol}>
                    <a
                      href={getLink(document, saksNr)}
                      className="lenke lenke--frittstaende"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {document.tittel}
                    </a>
                  </TableColumn>
                </TableRow>
              );
            })}
          </Table>
        </Column>
      </Row>
    </>
  );
};

DocumentListVedtakInnsyn.propTypes = {
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string.isRequired,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};

export default DocumentListVedtakInnsyn;
