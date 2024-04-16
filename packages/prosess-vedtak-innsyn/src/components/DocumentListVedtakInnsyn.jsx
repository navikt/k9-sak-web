import { BodyShort, Detail, HGrid, Table } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './documentListVedtakInnsyn.module.css';

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
      <BodyShort size="small" className={styles.noDocuments}>
        <FormattedMessage id="DocumentListVedtakInnsyn.NoDocuments" />
      </BodyShort>
    );
  }

  return (
    <>
      <Detail className={styles.noDocuments}>
        <FormattedMessage id="DocumentListVedtakInnsyn.InnsynsDok" />
      </Detail>
      <HGrid gap="1" columns={{ xs: '6fr 6fr' }}>
        <div>
          <Table>
            <Table.Header>
              <Table.Row shadeOnHover={false}>
                {headerTextCodes.map(text => (
                  <Table.HeaderCell scope="col" key={text}>
                    {text}
                  </Table.HeaderCell>
                ))}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {documents.map(document => {
                const dokId = parseInt(document.dokumentId, 10);
                return (
                  <Table.Row key={dokId} id={dokId} shadeOnHover={false}>
                    <Table.DataCell className={styles.linkCol}>
                      <a
                        href={getLink(document, saksNr)}
                        className="lenke lenke--frittstaende"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {document.tittel}
                      </a>
                    </Table.DataCell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </HGrid>
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
