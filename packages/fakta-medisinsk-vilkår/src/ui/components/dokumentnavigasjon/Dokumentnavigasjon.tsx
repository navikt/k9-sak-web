import { prettifyDateString } from '@fpsak-frontend/utils';
import {
  CheckmarkCircleFillIcon,
  ChevronRightIcon,
  ExclamationmarkTriangleFillIcon,
  FilesFillIcon,
  PersonFillIcon,
  PersonIcon,
} from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Heading, HStack, Pagination, Table, Tooltip } from '@navikt/ds-react';
import React, { type JSX } from 'react';
import { Dokument, dokumentLabel, Dokumenttype } from '../../../types/Dokument';
import Dokumentfilter from '../dokumentfilter/Dokumentfilter';
import styles from './dokumentnavigasjon.module.css';

interface DokumentnavigasjonProps {
  tittel: string;
  dokumenter: Dokument[];
  onDokumentValgt: (dokument: Dokument) => void;
  valgtDokument: Dokument | null;
  displayFilterOption?: boolean;
  usePagination?: boolean;
}

const ANTALL_DOKUMENTER_PER_SIDE = 5;

const erIkkeDuplikat = (dokument: Dokument) => dokument.duplikatAvId === null;

const StatusIcon = ({ dokument }: { dokument: Dokument }) => {
  if (dokument.type === Dokumenttype.UKLASSIFISERT) {
    return (
      <ExclamationmarkTriangleFillIcon
        title="Dokumentet må håndteres"
        fontSize="1.5rem"
        color="var(--ax-text-warning-decoration)"
      />
    );
  }
  return (
    <CheckmarkCircleFillIcon
      title="Dokumentet er ferdig håndtert"
      fontSize="1.5rem"
      color="var(--ax-bg-success-strong)"
    />
  );
};

const PartIcon = ({ annenPartErKilde }: { annenPartErKilde: boolean }) => {
  if (annenPartErKilde) {
    return <PersonIcon fontSize="1.5rem" title="Annen part" />;
  }
  return <PersonFillIcon fontSize="1.5rem" title="Søker" />;
};

const getDokumenttype = (dokument: Dokument) => {
  if (dokument.type === Dokumenttype.UKLASSIFISERT) {
    return dokumentLabel.UKLASSIFISERT;
  }
  return dokumentLabel[dokument.type] || dokument.navn;
};

const getDatert = (dokument: Dokument) => {
  if (dokument.type === Dokumenttype.UKLASSIFISERT) {
    return (
      <Tooltip content="Dato dokumentet ble mottatt">
        <span>{`${prettifyDateString(dokument.datert || dokument.mottattDato)}*`}</span>
      </Tooltip>
    );
  }
  return prettifyDateString(dokument.datert);
};

const Dokumentnavigasjon = ({
  tittel,
  dokumenter,
  onDokumentValgt,
  valgtDokument,
  displayFilterOption,
  usePagination = false,
}: DokumentnavigasjonProps): JSX.Element => {
  const [dokumenttypeFilter, setDokumenttypeFilter] = React.useState([...Object.values(Dokumenttype)]);
  const [aktivSide, setAktivSide] = React.useState(1);
  const updateDokumenttypeFilter = type =>
    dokumenttypeFilter.includes(type)
      ? setDokumenttypeFilter(dokumenttypeFilter.filter(v => v !== type))
      : setDokumenttypeFilter(dokumenttypeFilter.concat([type]));

  const filtrerteDokumenter = dokumenter.filter(
    dokument => dokumenttypeFilter.includes(dokument.type) && erIkkeDuplikat(dokument),
  );
  const antallSider = Math.max(1, Math.ceil(filtrerteDokumenter.length / ANTALL_DOKUMENTER_PER_SIDE));

  React.useEffect(() => {
    if (aktivSide > antallSider) {
      setAktivSide(antallSider);
    }
  }, [aktivSide, antallSider]);

  const dokumenterSomVises = usePagination
    ? filtrerteDokumenter.slice((aktivSide - 1) * ANTALL_DOKUMENTER_PER_SIDE, aktivSide * ANTALL_DOKUMENTER_PER_SIDE)
    : filtrerteDokumenter;
  const alleRelevanteDokumentTyper = [...new Set(dokumenter.map(dokument => dokument.type))];

  return (
    <Box className={styles.dokumentnavigasjon}>
      <Box
        width="456px"
        borderColor="neutral-subtle"
        borderRadius="8"
        borderWidth="1"
        paddingBlock="space-16 space-0"
        paddingInline="space-16"
        style={{ alignSelf: 'start' }}
      >
        <Heading size="small" level="2">
          {tittel}
        </Heading>
        <Bleed marginInline="space-16">
          <Table size="medium">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textSize="small" scope="col" className={styles.statusCell}>
                  Status
                </Table.HeaderCell>
                {!displayFilterOption && (
                  <Table.HeaderCell textSize="small" scope="col">
                    Type
                  </Table.HeaderCell>
                )}
                {displayFilterOption && (
                  <Table.HeaderCell textSize="small" scope="col">
                    <Dokumentfilter
                      className=""
                      text="Type"
                      filters={dokumenttypeFilter}
                      onFilterChange={updateDokumenttypeFilter}
                      alleRelevanteDokumentTyper={alleRelevanteDokumentTyper}
                    />
                  </Table.HeaderCell>
                )}
                <Table.HeaderCell textSize="small" scope="col">
                  Datert
                </Table.HeaderCell>
                <Table.HeaderCell textSize="small" scope="col" colSpan={2}>
                  Part
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {dokumenterSomVises.length === 0 && (
                <Table.Row>
                  <Table.DataCell colSpan={4}>
                    <BodyShort size="small">Ingen dokumenter å vise</BodyShort>
                  </Table.DataCell>
                </Table.Row>
              )}
              {dokumenterSomVises.map(dokument => (
                <Table.Row
                  key={dokument.id}
                  onClick={() => onDokumentValgt(dokument)}
                  selected={dokument === valgtDokument}
                  className={`${styles.selectableRow} ${dokument === valgtDokument ? styles.selectedRow : ''}`}
                >
                  <Table.DataCell>
                    <HStack align="center" justify="center">
                      <StatusIcon dokument={dokument} />
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    <BodyShort size="small">
                      <HStack gap="space-8" align="center">
                        {getDokumenttype(dokument)}
                        {dokument.duplikater?.length > 0 && (
                          <FilesFillIcon
                            title="Det finnes ett eller flere duplikater av dette dokumentet"
                            fontSize="1.5rem"
                          />
                        )}
                      </HStack>
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <BodyShort size="small">{getDatert(dokument)}</BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <HStack align="center">
                      <PartIcon annenPartErKilde={dokument.annenPartErKilde} />
                    </HStack>
                  </Table.DataCell>
                  <Table.DataCell>
                    <HStack align="center" justify="end">
                      <ChevronRightIcon title="Åpne" fontSize="1.5rem" />
                    </HStack>
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Bleed>
        {usePagination && antallSider > 1 && (
          <Box paddingBlock="space-16">
            <Pagination size="small" page={aktivSide} onPageChange={setAktivSide} count={antallSider} />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dokumentnavigasjon;
