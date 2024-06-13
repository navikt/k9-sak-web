import arrowLeftPurpleImageUrl from '@fpsak-frontend/assets/images/arrow_left_purple.svg';
import eksternLinkImageUrl from '@fpsak-frontend/assets/images/ekstern_link_pil_boks.svg';
import internDokumentImageUrl from '@fpsak-frontend/assets/images/intern_dokument.svg';
import mottaDokumentImageUrl from '@fpsak-frontend/assets/images/motta_dokument.svg';
import sendDokumentImageUrl from '@fpsak-frontend/assets/images/send_dokument.svg';
import fagsakYtelseType from '@fpsak-frontend/kodeverk/src/fagsakYtelseType';
import kommunikasjonsretning from '@fpsak-frontend/kodeverk/src/kommunikasjonsretning';
import { DateTimeLabel, Image, Tooltip } from '@fpsak-frontend/shared-components';
import { Dokument, FagsakPerson } from '@k9-sak-web/types';
import { StarFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Label, Link, Select, Table } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';
import { Kompletthet } from '../types/Kompletthetsperioder';
import styles from './documentList.module.css';

const headerTextCodes = [
  'DocumentList.Direction',
  'DocumentList.DocumentType',
  'DocumentList.Gjelder',
  'DocumentList.DateTime',
];

const alleBehandlinger = 'ALLE';

const vedtaksdokumenter = ['INNVILGELSE', 'AVSLAG', 'FRITKS', 'ENDRING', 'MANUELL'];

const inntektsmeldingBrevkode = '4936';

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
  behandlingUuid: string;
  sakstype: string;
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
  behandlingUuid,
  sakstype,
}: OwnProps & WrappedComponentProps) => {
  const [selectedFilter, setSelectedFilter] = useState(alleBehandlinger);

  const erStøttetFagsakYtelseType = [
    fagsakYtelseType.PLEIEPENGER,
    fagsakYtelseType.OMSORGSPENGER,
    fagsakYtelseType.PLEIEPENGER_SLUTTFASE,
  ].includes(sakstype);

  const getInntektsmeldingerIBruk = (signal?: AbortSignal) =>
    axios
      .get<Kompletthet>(`/k9/sak/api/behandling/kompletthet/beregning/vurderinger`, {
        signal,
        params: {
          behandlingUuid,
        },
      })
      .then(({ data }) => {
        const inntektsmeldingerIBruk = data?.vurderinger?.flatMap(kompletthetvurdering =>
          kompletthetvurdering.vurderinger.filter(vurdering => vurdering.vurdering === 'I_BRUK'),
        );
        return inntektsmeldingerIBruk;
      });

  const { data: inntektsmeldingerIBruk } = useQuery(
    ['kompletthet'],
    ({ signal }) => getInntektsmeldingerIBruk(signal),
    {
      enabled: erStøttetFagsakYtelseType && !!behandlingUuid,
    },
  );

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
    <Link target="_blank" className={styles.modiaLink} href={getModiaPath(fagsakPerson?.personnummer)}>
      <span>
        <FormattedMessage id="DocumentList.ModiaLink" />
      </span>
      <Image className={styles.externalIcon} src={eksternLinkImageUrl} />
    </Link>
  );

  if (documents.length === 0) {
    return (
      <>
        <div className={styles.controlsContainer}>{getModiaLenke()}</div>
        <BodyShort size="small" className={styles.noDocuments} data-testid="no-documents">
          <FormattedMessage id="DocumentList.NoDocuments" />
        </BodyShort>
      </>
    );
  }

  const makeDocumentURL = (document: Dokument) =>
    `/k9/sak/api/dokument/hent-dokument?saksnummer=${saksnummer}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

  const erInntektsmeldingOgBruktIDenneBehandlingen = (document: Dokument) =>
    document.brevkode === inntektsmeldingBrevkode &&
    inntektsmeldingerIBruk &&
    inntektsmeldingerIBruk.length > 0 &&
    inntektsmeldingerIBruk.some(inntektsmelding => inntektsmelding.journalpostId === document.journalpostId);

  return (
    <>
      <div className={styles.controlsContainer}>
        {harMerEnnEnBehandlingKnyttetTilDokumenter() && (
          <Select
            size="small"
            onChange={event => setSelectedFilter(event.target.value)}
            label="Hvilke behandlinger skal vises?"
            hideLabel
          >
            <option value={alleBehandlinger}>Alle behandlinger</option>
            <option value={behandlingId}>Denne behandlingen</option>
          </Select>
        )}
        {getModiaLenke()}
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            {headerTextCodes.map(textCode => (
              <Table.HeaderCell key={textCode} scope="col">
                <FormattedMessage id={textCode} />
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
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
                <Table.Row
                  key={document.dokumentId}
                  id={document.dokumentId}
                  className={isVedtaksdokument(document) ? styles.borderTop : ''}
                >
                  <Table.DataCell>
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
                  </Table.DataCell>
                  <Table.DataCell>
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
                        <Label size="small" as="span">
                          {document.tittel}
                        </Label>
                      ) : (
                        <BodyShort size="small" as="span">
                          {document.tittel}
                        </BodyShort>
                      )}
                      {erInntektsmeldingOgBruktIDenneBehandlingen(document) && (
                        <StarFillIcon
                          className={styles.starIcon}
                          title={intl.formatMessage({ id: 'DocumentList.IBruk' })}
                        />
                      )}
                    </a>
                  </Table.DataCell>
                  <Table.DataCell>
                    <a
                      className={styles.documentAnchorPlain}
                      href={makeDocumentURL(document)}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={-1}
                    >
                      {isTextMoreThan25char(document.gjelderFor) && (
                        <Tooltip content={<BodyShort size="small">{document.gjelderFor}</BodyShort>} alignLeft>
                          {trimText(document.gjelderFor)}
                        </Tooltip>
                      )}
                      {!isTextMoreThan25char(document.gjelderFor) && document.gjelderFor}
                    </a>
                  </Table.DataCell>
                  <Table.DataCell>
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
                        <BodyShort size="small" data-testid="missing-timestamp">
                          <FormattedMessage id="DocumentList.IProduksjon" />
                        </BodyShort>
                      )}
                    </a>
                  </Table.DataCell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </>
  );
};

export default injectIntl(DocumentList);
