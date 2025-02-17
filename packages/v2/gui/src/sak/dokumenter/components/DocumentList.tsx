import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { Kommunikasjonsretning } from '@k9-sak-web/backend/k9sak/kodeverk/Kommunikasjonsretning.js';
import { StarFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Label, Link, Select, Table, Tooltip } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import DateTimeLabel from '../../../shared/dateTimeLabel/DateTimeLabel';
import type { Document } from '../types/Document';
import type { FagsakPerson } from '../types/FagsakPerson';
import { type Kompletthet } from '../types/Kompletthetsperioder';
import styles from './documentList.module.css';
import arrowLeftPurpleImageUrl from './icons/arrow_left_purple.svg';
import eksternLinkImageUrl from './icons/ekstern_link_pil_boks.svg';
import internDokumentImageUrl from './icons/intern_dokument.svg';
import mottaDokumentImageUrl from './icons/motta_dokument.svg';
import sendDokumentImageUrl from './icons/send_dokument.svg';

const headerTexts = ['Inn/ut', 'Dokument', 'Gjelder', 'Sendt/mottatt'];

const alleBehandlinger = 'ALLE';

const vedtaksdokumenter = ['INNVILGELSE', 'AVSLAG', 'FRITKS', 'ENDRING', 'MANUELL'];

const inntektsmeldingBrevkode = '4936';

const isVedtaksdokument = (document: Document) =>
  vedtaksdokumenter.some(vedtaksdokument => vedtaksdokument === document.brevkode);

const isTextMoreThan25char = (text?: string): boolean => !!text && text.length > 25;
const trimText = (text: string): string => `${text?.substring(0, 24)}...`;

const getDirectionImage = (document: Document): string => {
  if (isVedtaksdokument(document)) {
    return arrowLeftPurpleImageUrl;
  }
  if (document.kommunikasjonsretning === Kommunikasjonsretning.INN) {
    return mottaDokumentImageUrl;
  }
  if (document.kommunikasjonsretning === Kommunikasjonsretning.UT) {
    return sendDokumentImageUrl;
  }
  return internDokumentImageUrl;
};
const getDirectionText = (document: Document): string => {
  if (document.kommunikasjonsretning === Kommunikasjonsretning.INN) {
    return 'Inn';
  }
  if (document.kommunikasjonsretning === Kommunikasjonsretning.UT) {
    return 'Ut';
  }
  return 'Intern';
};

const getModiaPath = (fødselsnummer?: string) => {
  const { host } = window.location;
  if (host === 'app-q1.adeo.no' || host === 'k9.dev.intern.nav.no') {
    return `https://app-q1.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no') {
    return `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  return '#';
};

interface OwnProps {
  documents: Document[];
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
  saksnummer: number;
  behandlingUuid: string;
  sakstype: FagsakYtelsesType;
}

/**
 * DocumentList
 *
 * Presentasjonskomponent. Viser dokumenter i en liste. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentList = ({ documents, behandlingId, fagsakPerson, saksnummer, behandlingUuid, sakstype }: OwnProps) => {
  const [selectedFilter, setSelectedFilter] = useState(alleBehandlinger);

  const erStøttetFagsakYtelseType = [
    fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    fagsakYtelsesType.OMSORGSPENGER,
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
  ].some(t => t === sakstype);

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

  const { data: inntektsmeldingerIBruk } = useQuery({
    queryKey: ['kompletthet'],
    queryFn: ({ signal }) => getInntektsmeldingerIBruk(signal),
    enabled: erStøttetFagsakYtelseType && !!behandlingUuid,
  });

  const ModiaLenke = () => (
    <Link target="_blank" className={styles.modiaLink} href={getModiaPath(fagsakPerson?.personnummer)}>
      <span>Se dialog med søker i Modia</span>
      <img alt="Ekstern lenke" className="ml-2 mb-1" src={eksternLinkImageUrl} />
    </Link>
  );

  if (documents.length === 0) {
    return (
      <>
        <div className={styles.controlsContainer}>
          <ModiaLenke />
        </div>
        <BodyShort size="small" className={styles.noDocuments} data-testid="no-documents">
          Det finnes ingen dokumenter på saken
        </BodyShort>
      </>
    );
  }

  const makeDocumentURL = (document: Document) =>
    `/k9/sak/api/dokument/hent-dokument?saksnummer=${saksnummer}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

  const erInntektsmeldingOgBruktIDenneBehandlingen = (document: Document) =>
    document.brevkode === inntektsmeldingBrevkode &&
    inntektsmeldingerIBruk &&
    inntektsmeldingerIBruk.length > 0 &&
    inntektsmeldingerIBruk.some(inntektsmelding => inntektsmelding.journalpostId === document.journalpostId);

  return (
    <>
      <div className={styles.controlsContainer}>
        <Select
          size="small"
          onChange={event => setSelectedFilter(event.target.value)}
          label="Hvilke behandlinger skal vises?"
          hideLabel
        >
          <option value={alleBehandlinger}>Alle behandlinger</option>
          <option value={behandlingId}>Denne behandlingen</option>
        </Select>
        <ModiaLenke />
      </div>
      <Table>
        <Table.Header>
          <Table.Row>
            {headerTexts.map(text => (
              <Table.HeaderCell key={text} scope="col">
                {text}
              </Table.HeaderCell>
            ))}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {documents
            .filter(document =>
              `${behandlingId}` === selectedFilter
                ? document.behandlinger?.some(behandling => behandling === behandlingId)
                : true,
            )
            .map(document => {
              const directionImage = getDirectionImage(document);
              const directionText = getDirectionText(document);
              return (
                <Table.Row
                  key={document.dokumentId}
                  id={document.dokumentId}
                  className={isVedtaksdokument(document) ? styles.borderTop : ''}
                >
                  <Table.DataCell>
                    <Tooltip content={directionText}>
                      <a
                        className={styles.documentAnchorPlain}
                        href={makeDocumentURL(document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={-1}
                      >
                        <img className="h-5 w-[25px]" src={directionImage} alt={directionText} />
                      </a>
                    </Tooltip>
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
                        <StarFillIcon className={styles.starIcon} title="Brukes i behandlingen" />
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
                      {document?.gjelderFor && isTextMoreThan25char(document.gjelderFor) && (
                        <Tooltip content={document.gjelderFor} placement="left">
                          <BodyShort>{trimText(document.gjelderFor)}</BodyShort>
                        </Tooltip>
                      )}
                      {!isTextMoreThan25char(document?.gjelderFor) && document.gjelderFor}
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
                          I bestilling
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

export default DocumentList;
