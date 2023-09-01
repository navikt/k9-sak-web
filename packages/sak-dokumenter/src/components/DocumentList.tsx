import arrowLeftPurpleImageUrl from '@fpsak-frontend/assets/images/arrow_left_purple.svg';
import eksternLinkImageUrl from '@fpsak-frontend/assets/images/ekstern_link_pil_boks.svg';
import internDokumentImageUrl from '@fpsak-frontend/assets/images/intern_dokument.svg';
import mottaDokumentImageUrl from '@fpsak-frontend/assets/images/motta_dokument.svg';
import sendDokumentImageUrl from '@fpsak-frontend/assets/images/send_dokument.svg';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { DateTimeLabel, Image, Table, TableColumn, TableRow, Tooltip } from '@fpsak-frontend/shared-components';
import { Dokument, FagsakPerson } from '@k9-sak-web/types';
import Lenke from 'nav-frontend-lenker';
import { Select } from 'nav-frontend-skjema';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import React, { useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import styles from './documentList.css';

const headerTextCodes = [
  'DocumentList.Direction',
  'DocumentList.DocumentType',
  'DocumentList.Gjelder',
  'DocumentList.DateTime',
];

const alleBehandlinger = 'ALLE';

const vedtaksdokumenter = ['INNVILGELSE', 'AVSLAG', 'FRITKS', 'ENDRING', 'MANUELL'];

const isVedtaksdokument = (document: Dokument) =>
  vedtaksdokumenter.some(vedtaksdokument => vedtaksdokument === document.brevkode);

const isTextMoreThan25char = (text: string): boolean => text && text.length > 25;
const trimText = (text: string): string => `${text.substring(0, 24)}...`;

const getDirectionImage = (document: Dokument): string => {
  if (isVedtaksdokument(document)) {
    return arrowLeftPurpleImageUrl;
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return mottaDokumentImageUrl;
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return sendDokumentImageUrl;
  }
  return internDokumentImageUrl;
};
const getDirectionText = (document: Dokument): string => {
  if (document.kommunikasjonsretning === kommunikasjonsretning.INN) {
    return 'DocumentList.Motta';
  }
  if (document.kommunikasjonsretning === kommunikasjonsretning.UT) {
    return 'DocumentList.Send';
  }
  return 'DocumentList.Intern';
};

const getModiaPath = (fødselsnummer: string) => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return `https://app-q1.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  return null;
};

interface OwnProps {
  documents: Dokument[];
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
  saksnummer: number;
}

/**
 * DocumentList
 *
 * Presentasjonskomponent. Viser dokumenter i en liste. Tar også inn en callback-funksjon som blir
 * trigget når saksbehandler velger et dokument. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentList = ({
  intl,
  documents,
  behandlingId,
  fagsakPerson,
  saksnummer,
}: OwnProps & WrappedComponentProps) => {
  const [selectedFilter, setSelectedFilter] = useState(alleBehandlinger);
  const harMerEnnEnBehandlingKnyttetTilDokumenter = () => {
    const unikeBehandlinger = [];
    if (documents.some(document => document.behandlinger?.length > 0)) {
      documents.forEach(document =>
        document.behandlinger.forEach(behandling => {
          if (!unikeBehandlinger.includes(behandling)) {
            unikeBehandlinger.push(behandling);
          }
        }),
      );
    }
    return unikeBehandlinger.length > 1;
  };

  const getModiaLenke = () => (
    <Lenke target="_blank" className={styles.modiaLink} href={getModiaPath(fagsakPerson?.personnummer)}>
      <span>
        <FormattedMessage id="DocumentList.ModiaLink" />
      </span>
      <Image className={styles.externalIcon} src={eksternLinkImageUrl} />
    </Lenke>
  );

  if (documents.length === 0) {
    return (
      <>
        <div className={styles.controlsContainer}>{getModiaLenke()}</div>
        <Normaltekst className={styles.noDocuments}>
          <FormattedMessage id="DocumentList.NoDocuments" />
        </Normaltekst>
      </>
    );
  }

  const makeDocumentURL = (document: Dokument) =>
    `/k9/sak/api/dokument/hent-dokument?saksnummer=${saksnummer}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

  return (
    <>
      <div className={styles.controlsContainer}>
        {harMerEnnEnBehandlingKnyttetTilDokumenter() && (
          <Select bredde="m" onChange={event => setSelectedFilter(event.target.value)}>
            <option value={alleBehandlinger}>Alle behandlinger</option>
            <option value={behandlingId}>Denne behandlingen</option>
          </Select>
        )}
        {getModiaLenke()}
      </div>
      <Table headerTextCodes={headerTextCodes}>
        {documents
          .filter(document =>
            `${behandlingId}` === selectedFilter
              ? document.behandlinger.some(behandling => behandling === behandlingId)
              : true,
          )
          .map(document => {
            const directionImage = getDirectionImage(document);
            const directionTextCode = getDirectionText(document);
            return (
              <TableRow
                key={document.dokumentId}
                id={document.dokumentId}
                model={document}
                notFocusable
                className={isVedtaksdokument(document) ? styles.borderTop : ''}
              >
                <TableColumn>
                  <a
                    className={styles.documentAnchorPlain}
                    href={makeDocumentURL(document)}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                  >
                    <Image
                      className={styles.image}
                      src={directionImage}
                      alt={intl.formatMessage({ id: directionTextCode })}
                      tooltip={intl.formatMessage({ id: directionTextCode })}
                    />
                  </a>
                </TableColumn>
                <TableColumn>
                  <a
                    onClick={event => {
                      event.stopPropagation();
                    }}
                    href={makeDocumentURL(document)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentAnchor}
                  >
                    {isVedtaksdokument(document) ? (
                      <Element>{document.tittel}</Element>
                    ) : (
                      <Normaltekst>{document.tittel}</Normaltekst>
                    )}
                  </a>
                </TableColumn>
                <TableColumn>
                  <a
                    className={styles.documentAnchorPlain}
                    href={makeDocumentURL(document)}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                  >
                    {isTextMoreThan25char(document.gjelderFor) && (
                      <Tooltip content={<Normaltekst>{document.gjelderFor}</Normaltekst>} alignLeft>
                        {trimText(document.gjelderFor)}
                      </Tooltip>
                    )}
                    {!isTextMoreThan25char(document.gjelderFor) && document.gjelderFor}
                  </a>
                </TableColumn>
                <TableColumn>
                  <a
                    className={styles.documentAnchorPlain}
                    href={makeDocumentURL(document)}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                  >
                    {document.tidspunkt ? (
                      <DateTimeLabel dateTimeString={document.tidspunkt} />
                    ) : (
                      <Normaltekst>
                        <FormattedMessage id="DocumentList.IProduksjon" />
                      </Normaltekst>
                    )}
                  </a>
                </TableColumn>
              </TableRow>
            );
          })}
      </Table>
    </>
  );
};

export default injectIntl(DocumentList);
