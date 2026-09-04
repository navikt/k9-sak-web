import {
  Kommunikasjonsretning,
  type KommunikasjonsretningType,
} from '@k9-sak-web/backend/k9sak/kodeverk/dokument/Kommunikasjonsretning.js';
import { type DokumentfilterGruppeType } from '@k9-sak-web/backend/k9sak/kodeverk/dokument/DokumentfilterGruppe.js';
import type { DokumentDto } from '@k9-sak-web/backend/k9sak/kontrakt/dokument/DokumentDto.js';
import { type FagsakYtelsesType, fagsakYtelsesType } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.js';
import { addLegacySerializerOption } from '@k9-sak-web/gui/utils/axios/axiosUtils.js';
import { StarFillIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, Link, Table, Tooltip, UNSAFE_Combobox } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext, useState } from 'react';
import DateTimeLabel from '../../../shared/dateTimeLabel/DateTimeLabel';
import { isUngWeb } from '../../../utils/urlUtils';
import type { FagsakPerson } from '../types/FagsakPerson';
import { type Kompletthet } from '../types/Kompletthetsperioder';
import styles from './documentList.module.css';
import arrowLeftPurpleImageUrl from './icons/arrow_left_purple.svg';
import eksternLinkImageUrl from './icons/ekstern_link_pil_boks.svg';
import internDokumentImageUrl from './icons/intern_dokument.svg';
import mottaDokumentImageUrl from './icons/motta_dokument.svg';
import sendDokumentImageUrl from './icons/send_dokument.svg';
import { ignore404Errors } from '@k9-sak-web/gui/app/errorhandling/ignore404Errors.js';
import { K9KodeverkoppslagContext } from '../../../kodeverk/oppslag/K9KodeverkoppslagContext';

const getBackendPath = () => (isUngWeb() ? 'ung' : 'k9');

const headerTexts = ['Inn/ut', 'Dokument', 'Gjelder', 'Sendt/mottatt'];

const vedtaksdokumenter = ['INNVILGELSE', 'AVSLAG', 'FRITKS', 'ENDRING', 'MANUELL'];

const inntektsmeldingBrevkode = '4936';

const KUN_DENNE_BEHANDLINGEN = 'KUN_DENNE_BEHANDLINGEN';
const INNGAENDE_DOKUMENTER = 'INNGAENDE_DOKUMENTER';
const UTGAENDE_DOKUMENTER = 'UTGAENDE_DOKUMENTER';

const isVedtaksdokument = (document: DokumentDto) =>
  vedtaksdokumenter.some(vedtaksdokument => vedtaksdokument === document.brevkode);

const isTextMoreThan25char = (text?: string): boolean => !!text && text.length > 25;
const trimText = (text: string): string => `${text?.substring(0, 24)}...`;

const getDirectionImage = (document: DokumentDto): string => {
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
const getDirectionText = (document: DokumentDto): string => {
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
  if (host === 'k9.intern.dev.nav.no' || host === 'ung.intern.dev.nav.no') {
    return `https://app-q1.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  if (host === 'app.adeo.no' || host === 'k9.intern.nav.no' || host === 'ung.intern.nav.no') {
    return `https://app.adeo.no/modiapersonoversikt/person/${fødselsnummer}/meldinger/`;
  }
  return '#';
};

interface OwnProps {
  documents: DokumentDto[];
  behandlingId?: number;
  fagsakPerson?: FagsakPerson;
  saksnummer: number;
  behandlingUuid: string;
  sakstype: FagsakYtelsesType;
}

interface DokumentTypeOption {
  label: string;
  value:
    typeof KUN_DENNE_BEHANDLINGEN | typeof INNGAENDE_DOKUMENTER | typeof UTGAENDE_DOKUMENTER | DokumentfilterGruppeType;
}

/**
 * DocumentListNew
 *
 * Presentasjonskomponent. Viser dokumenter i en liste. Finnes ingen dokumenter blir det kun vist en label
 * som viser at ingen dokumenter finnes på fagsak.
 */
const DocumentListNew = ({ documents, behandlingId, fagsakPerson, saksnummer, behandlingUuid, sakstype }: OwnProps) => {
  const kv = useContext(K9KodeverkoppslagContext);
  const dokumentFilterGrupper = kv.k9sak.alleKodeverdierForKodeverk('dokumentFilterGrupper');

  const dokumentTypeAlternativer: DokumentTypeOption[] = [
    { label: 'Vis kun dokumenter fra denne behandlingen', value: KUN_DENNE_BEHANDLINGEN },
    { label: 'Inngående dokumenter', value: INNGAENDE_DOKUMENTER },
    { label: 'Utgående dokumenter', value: UTGAENDE_DOKUMENTER },
    ...dokumentFilterGrupper
      .sort((a, b) => a.navn.localeCompare(b.navn))
      .map(gruppe => ({
        label: gruppe.navn,
        value: gruppe.kilde,
      })),
  ];

  const [kunDenneBehandlingen, setKunDenneBehandlingen] = useState(false);
  const [valgteDokumentTyper, setValgteDokumentTyper] = useState<
    Set<DokumentfilterGruppeType | KommunikasjonsretningType>
  >(new Set());

  const erDokumentfilterGruppeType = (value: string): value is DokumentfilterGruppeType =>
    dokumentFilterGrupper.some(gruppe => gruppe.kilde === value);

  const erKommunikasjonsretning = (value: string): value is typeof INNGAENDE_DOKUMENTER | typeof UTGAENDE_DOKUMENTER =>
    value === INNGAENDE_DOKUMENTER || value === UTGAENDE_DOKUMENTER;

  const getKommunikasjonsretning = (
    value: typeof INNGAENDE_DOKUMENTER | typeof UTGAENDE_DOKUMENTER,
  ): KommunikasjonsretningType => {
    if (value === INNGAENDE_DOKUMENTER) {
      return Kommunikasjonsretning.INN;
    }
    return Kommunikasjonsretning.UT;
  };

  const onToggleDokumentType = (option: string, isSelected: boolean) => {
    if (option === KUN_DENNE_BEHANDLINGEN) {
      setKunDenneBehandlingen(isSelected);
      return;
    }
    if (erKommunikasjonsretning(option)) {
      const retning = getKommunikasjonsretning(option);
      setValgteDokumentTyper(prev => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.add(retning);
        } else {
          newSet.delete(retning);
        }
        return newSet;
      });
      return;
    }
    if (!erDokumentfilterGruppeType(option)) {
      throw new Error(`Ugyldig dokumentfiltergruppe type: ${option}`);
    }
    setValgteDokumentTyper(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(option);
      } else {
        newSet.delete(option);
      }
      return newSet;
    });
  };

  const erStøttetFagsakYtelseType = [
    fagsakYtelsesType.PLEIEPENGER_SYKT_BARN,
    fagsakYtelsesType.OMSORGSPENGER,
    fagsakYtelsesType.PLEIEPENGER_NÆRSTÅENDE,
    fagsakYtelsesType.OPPLÆRINGSPENGER,
  ].some(t => t === sakstype);

  const getInntektsmeldingerIBruk = (signal?: AbortSignal) =>
    axios
      .get<Kompletthet>(
        `/${getBackendPath()}/sak/api/behandling/kompletthet/beregning/vurderinger`,
        addLegacySerializerOption({
          signal,
          params: {
            behandlingUuid,
          },
        }),
      )
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
    throwOnError: ignore404Errors, // k9-sak kaster 404 på dette kallet av og til. Uvisst når pr no
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

  const makeDocumentURL = (document: DokumentDto) =>
    `/${getBackendPath()}/sak/api/dokument/hent-dokument?saksnummer=${saksnummer}&journalpostId=${document.journalpostId}&dokumentId=${document.dokumentId}`;

  const erInntektsmeldingOgBruktIDenneBehandlingen = (document: DokumentDto) =>
    document.brevkode === inntektsmeldingBrevkode &&
    inntektsmeldingerIBruk &&
    inntektsmeldingerIBruk.length > 0 &&
    inntektsmeldingerIBruk.some(inntektsmelding => inntektsmelding.journalpostId === document.journalpostId);

  return (
    <>
      <div className={styles.controlsContainer}>
        <HStack gap="space-16" align="end">
          <UNSAFE_Combobox
            size="small"
            label="Dokumenttype"
            hideLabel
            className={styles.dokumenttypeFilter}
            options={dokumentTypeAlternativer}
            selectedOptions={dokumentTypeAlternativer.filter(a => {
              if (a.value === KUN_DENNE_BEHANDLINGEN) {
                return kunDenneBehandlingen;
              }
              if (erKommunikasjonsretning(a.value)) {
                return valgteDokumentTyper.has(getKommunikasjonsretning(a.value));
              }
              return valgteDokumentTyper.has(a.value);
            })}
            onToggleSelected={onToggleDokumentType}
            isMultiSelect
            shouldAutocomplete
            placeholder="Alle dokumenttyper"
          />
        </HStack>
        <ModiaLenke />
      </div>
      <Table style={{ width: '100%' }}>
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
            .filter(document => {
              if (kunDenneBehandlingen && !document.behandlinger?.some(b => b === behandlingId)) {
                return false;
              }
              if (valgteDokumentTyper.size === 0) {
                return true;
              }
              const { dokumentgruppe } = document;
              return [...valgteDokumentTyper].some(
                type =>
                  type === document.kommunikasjonsretning ||
                  (dokumentgruppe != null && dokumentgruppe.some(gruppe => gruppe === type)),
              );
            })
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
                      <Link
                        className={styles.documentAnchorPlain}
                        href={makeDocumentURL(document)}
                        target="_blank"
                        rel="noopener noreferrer"
                        tabIndex={-1}
                      >
                        <img className="h-5 w-[25px]" src={directionImage} alt={directionText} />
                      </Link>
                    </Tooltip>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Link
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
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Link
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
                    </Link>
                  </Table.DataCell>
                  <Table.DataCell>
                    <Link
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
                    </Link>
                  </Table.DataCell>
                </Table.Row>
              );
            })}
        </Table.Body>
      </Table>
    </>
  );
};

export default DocumentListNew;
