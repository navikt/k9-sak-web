import internDokumentImageUrl from '@k9-sak-web/assets/images/intern_dokument.svg';
import mottaDokumentImageUrl from '@k9-sak-web/assets/images/motta_dokument.svg';
import sendDokumentImageUrl from '@k9-sak-web/assets/images/send_dokument.svg';
import { CheckboxField } from '@k9-sak-web/form';
import kommunikasjonsretning from '@k9-sak-web/kodeverk/src/kommunikasjonsretning';
import { DateTimeLabel, Image } from '@k9-sak-web/shared-components';
import { BodyShort, Detail, HGrid, Table } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './documentListInnsyn.module.css';

// TODO (TOR) Flytt url ut av komponent
const DOCUMENT_SERVER_URL = '/k9/sak/api/dokument/hent-dokument';
const getLink = (document, saksNr) =>
  `${DOCUMENT_SERVER_URL}?saksnummer=${saksNr}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

const getDirectionImage = (document, intl) => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return (
      <Image
        className={styles.image}
        src={mottaDokumentImageUrl}
        alt={intl.formatMessage({ id: 'DocumentListInnsyn.Motta' })}
        title={intl.formatMessage({ id: 'DocumentListInnsyn.Motta' })}
      />
    );
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return (
      <Image
        className={styles.image}
        src={sendDokumentImageUrl}
        alt={intl.formatMessage({ id: 'DocumentListInnsyn.Send' })}
        title={intl.formatMessage({ id: 'DocumentListInnsyn.Send' })}
      />
    );
  }
  return (
    <Image
      className={styles.image}
      src={internDokumentImageUrl}
      alt={intl.formatMessage({ id: 'DocumentListInnsyn.Intern' })}
      title={intl.formatMessage({ id: 'DocumentListInnsyn.Intern' })}
    />
  );
};

const noLabelHack = () => <span className={styles.hidden}>-</span>;

/**
 * DocumentListInnsyn
 *
 * Presentasjonskomponent. Viser dokumenter i en liste med Checkbox for å velge til innsyn. Tar også inn en callback-funksjon som blir
 * trigget når saksbehandler velger et dokument. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentListInnsyn = ({ intl, documents, saksNr, readOnly }) => {
  if (documents.length === 0) {
    return (
      <BodyShort size="small" className={styles.noDocuments}>
        <FormattedMessage id="DocumentListInnsyn.NoDocuments" />
      </BodyShort>
    );
  }
  const headerTextCodes = readOnly
    ? ['DocumentListInnsyn.DocumentType']
    : [
        'DocumentListInnsyn.CheckBox',
        'DocumentListInnsyn.Direction',
        'DocumentListInnsyn.DocumentType',
        'DocumentListInnsyn.DateTime',
      ];

  return (
    <>
      <Detail className={styles.noDocuments}>
        <FormattedMessage id="DocumentListInnsyn.VelgInnsynsDok" />
      </Detail>
      <HGrid gap="1" columns={{ xs: readOnly ? '6fr 6fr' : '10fr 2fr' }}>
        <Table>
          <Table.Header>
            <Table.Row>
              {headerTextCodes.map(text => (
                <Table.HeaderCell scope="col" key={text}>
                  <FormattedMessage id={text} />
                </Table.HeaderCell>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {documents.map(document => {
              const img = getDirectionImage(document, intl);
              const dokId = parseInt(document.dokumentId, 10);
              return (
                <Table.Row key={dokId} id={dokId}>
                  <Table.DataCell className={styles.checkboxCol}>
                    <CheckboxField label={noLabelHack()} name={`dokument_${dokId}`} disabled={readOnly} />
                  </Table.DataCell>
                  <Table.DataCell hidden={readOnly}>{img}</Table.DataCell>
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
                  <Table.DataCell hidden={readOnly}>
                    {document.tidspunkt ? (
                      <DateTimeLabel dateTimeString={document.tidspunkt} />
                    ) : (
                      <BodyShort size="small">
                        <FormattedMessage id="DocumentListInnsyn.IProduksjon" />
                      </BodyShort>
                    )}
                  </Table.DataCell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </HGrid>
    </>
  );
};

DocumentListInnsyn.propTypes = {
  intl: PropTypes.shape().isRequired,
  saksNr: PropTypes.number.isRequired,
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      journalpostId: PropTypes.string.isRequired,
      dokumentId: PropTypes.string.isRequired,
      tittel: PropTypes.string,
      tidspunkt: PropTypes.string,
      kommunikasjonsretning: PropTypes.string,
    }).isRequired,
  ).isRequired,
  readOnly: PropTypes.bool,
};

DocumentListInnsyn.defaultProps = {
  readOnly: false,
};

export default injectIntl(DocumentListInnsyn);
