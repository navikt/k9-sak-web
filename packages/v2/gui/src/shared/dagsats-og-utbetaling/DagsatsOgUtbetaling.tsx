import {
  ung_sak_kontrakt_ungdomsytelse_ytelse_UtbetalingStatus as UngdomsytelseUtbetaltMånedDtoStatus,
  type GetSatsOgUtbetalingPerioderResponse,
  type ung_sak_kontrakt_ungdomsytelse_UngdomsprogramInformasjonDto as UngdomsprogramInformasjonDto,
} from '@k9-sak-web/backend/ungsak/generated/types.js';
import {
  formatCurrencyWithKr,
  formatCurrencyWithoutKr,
  formatDate,
  formatPeriod,
} from '@k9-sak-web/gui/utils/formatters.js';
import { Alert, BodyShort, Box, Heading, Label, Table, Tag, VStack } from '@navikt/ds-react';
import { BeregningsDetaljer } from './BeregningsDetaljer';
import styles from './dagsatsOgUtbetaling.module.css';
import { formatMonthYear, formatSats } from './dagsatsUtils';
import { DataCellWithValue } from './DataCellWithValue';
import { DataSection } from './DataSection';

const satsTableHeaders = [
  'Periode',
  'Sats',
  'Grunnbeløp',
  'Dagsats',
  'Antall barn',
  'Barnetillegg',
  'Dager',
  'Benyttet inntekt',
  'Utbetaling',
  'Status',
];

const grunnrettTableHeaders = ['Startdato', 'Sats', 'Grunnbeløp', 'Dagsats', 'Antall barn', 'Barnetillegg'];

interface ColumnHeaderProps {
  label: string;
  isFirst?: boolean;
}

export const TableColumnHeader = ({ label, isFirst = false }: ColumnHeaderProps) => (
  <Table.HeaderCell scope="col" className={isFirst ? styles.firstHeaderCell : undefined}>
    <Label size="small">{label}</Label>
  </Table.HeaderCell>
);

const StatusTag = ({ status }: { status: UngdomsytelseUtbetaltMånedDtoStatus }) => (
  <Tag size="small" variant={status === UngdomsytelseUtbetaltMånedDtoStatus.TIL_UTBETALING ? 'info' : 'success'}>
    {status === UngdomsytelseUtbetaltMånedDtoStatus.TIL_UTBETALING ? 'Til utbetaling' : 'Utbetalt'}
  </Tag>
);

export const sortSatser = (data: GetSatsOgUtbetalingPerioderResponse) =>
  data?.toSorted((a, b) => new Date(a.måned).getTime() - new Date(b.måned).getTime()).toReversed();

interface DagsatsOgUtbetalingProps {
  satser: GetSatsOgUtbetalingPerioderResponse;
  ungdomsprogramInformasjon?: UngdomsprogramInformasjonDto;
}

export const DagsatsOgUtbetaling = ({ satser, ungdomsprogramInformasjon }: DagsatsOgUtbetalingProps) => {
  if (!satser) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }
  const grunnrettData = satser[satser.length - 1]?.satsperioder[0];
  return (
    <div className={styles.dagsatsSection}>
      <VStack gap="space-16">
        {ungdomsprogramInformasjon && <DataSection ungdomsprogramInformasjon={ungdomsprogramInformasjon} />}
        <VStack gap="space-32">
          {grunnrettData && (
            <div>
              <Heading size="xsmall" level="2">
                Grunnrett
              </Heading>
              <Box
                marginBlock="space-16 space-0"
                borderRadius="8"
                borderWidth="1"
                maxWidth="43.5rem"
                borderColor="neutral-subtle"
              >
                <Table>
                  <Table.Header>
                    <Table.Row>
                      {grunnrettTableHeaders.map((header, index) => (
                        <TableColumnHeader key={header} label={header} isFirst={index === 0} />
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row className={styles.noBottomBorder}>
                      <Table.DataCell className={styles.firstHeaderCell}>
                        <BodyShort size="small">{grunnrettData && formatDate(grunnrettData.fom)}</BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">
                          {grunnrettData.satsType && formatSats(grunnrettData.satsType)}
                        </BodyShort>
                      </Table.DataCell>
                      <DataCellWithValue value={grunnrettData.grunnbeløp} formatter={formatCurrencyWithKr} />
                      <DataCellWithValue
                        value={grunnrettData.dagsats}
                        formatter={formatCurrencyWithoutKr}
                        suffix=" kr"
                      />
                      <DataCellWithValue value={grunnrettData.antallBarn} />
                      <DataCellWithValue
                        value={grunnrettData.dagsatsBarnetillegg}
                        formatter={formatCurrencyWithoutKr}
                        suffix=" kr"
                      />
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Box>
            </div>
          )}
          <div>
            <Heading level="2" size="xsmall">
              Beregning av dagsats og utbetaling
            </Heading>
            {satser.length === 0 && (
              <Box marginBlock="space-12 space-0" maxWidth="43.5rem">
                <Alert variant="info" size="small">
                  Ingen utbetaling enda
                </Alert>
              </Box>
            )}
            {satser.length > 0 && (
              <Box marginBlock="space-16 space-0" borderRadius="8" borderWidth="1" borderColor="neutral-subtle">
                <Table>
                  <Table.Header>
                    <Table.Row>
                      {satsTableHeaders.map((header, index) => (
                        <TableColumnHeader key={header} label={header} isFirst={index === 0} />
                      ))}
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {satser.map(
                      (
                        {
                          antallDager,
                          måned,
                          rapportertInntekt,
                          satsperioder,
                          status,
                          utbetaling,
                          reduksjon,
                          reduksjonsgrunnlag,
                          gjelderDelerAvMåned,
                        },
                        index,
                      ) => {
                        const harFlereSatsperioder = satsperioder.length > 1;
                        if (harFlereSatsperioder) {
                          return (
                            <>
                              <Table.ExpandableRow
                                key={`${satsperioder[0]?.fom}-${satsperioder[0]?.tom}`}
                                content={
                                  <BeregningsDetaljer
                                    satsperioder={satsperioder}
                                    utbetaling={utbetaling}
                                    rapportertInntekt={rapportertInntekt}
                                    reduksjon={reduksjon}
                                    reduksjonsgrunnlag={reduksjonsgrunnlag}
                                    gjelderDelerAvMåned={gjelderDelerAvMåned}
                                  />
                                }
                                togglePlacement="right"
                                expandOnRowClick
                              >
                                <Table.HeaderCell scope="row" className={styles.firstHeaderCell}>
                                  <Label size="small">{formatMonthYear(måned)}</Label>
                                </Table.HeaderCell>
                                <Table.DataCell>{/* Sats */}</Table.DataCell>
                                <Table.DataCell>{/* Grunnbeløp */}</Table.DataCell>
                                <Table.DataCell>{/* Dagsats */}</Table.DataCell>
                                <Table.DataCell>{/* Antall barn */}</Table.DataCell>
                                <Table.DataCell>{/* Barnetillegg */}</Table.DataCell>
                                <DataCellWithValue value={antallDager} />
                                <DataCellWithValue value={rapportertInntekt} formatter={formatCurrencyWithKr} />
                                <DataCellWithValue value={utbetaling} formatter={formatCurrencyWithKr} />
                                <Table.DataCell>{status && <StatusTag status={status} />}</Table.DataCell>
                              </Table.ExpandableRow>
                              {satsperioder
                                .toReversed()
                                .map(
                                  ({
                                    fom,
                                    tom,
                                    satsType,
                                    grunnbeløp,
                                    dagsats,
                                    antallBarn,
                                    dagsatsBarnetillegg,
                                    antallDager: antallDagerIPeriode,
                                  }) => (
                                    <Table.Row
                                      key={`${fom}-${tom}`}
                                      content="Innhold"
                                      className={styles.noBottomBorder}
                                    >
                                      <Table.DataCell className={styles.firstHeaderCell}>
                                        <BodyShort size="small">{fom && tom && formatPeriod(fom, tom)}</BodyShort>
                                      </Table.DataCell>
                                      <Table.DataCell>
                                        <BodyShort size="small">{satsType && formatSats(satsType)}</BodyShort>
                                      </Table.DataCell>
                                      <DataCellWithValue value={grunnbeløp} formatter={formatCurrencyWithKr} />
                                      <DataCellWithValue
                                        value={dagsats}
                                        formatter={formatCurrencyWithoutKr}
                                        suffix=" kr"
                                      />
                                      <DataCellWithValue value={antallBarn} />
                                      <DataCellWithValue
                                        value={dagsatsBarnetillegg === 0 ? null : dagsatsBarnetillegg}
                                        formatter={formatCurrencyWithoutKr}
                                        suffix=" kr"
                                      />
                                      <DataCellWithValue value={antallDagerIPeriode} />
                                      <Table.DataCell>{/* Rapportert inntekt */}</Table.DataCell>
                                      <Table.DataCell>{/* Utbetaling */}</Table.DataCell>
                                      <Table.DataCell>{/* Status */}</Table.DataCell>
                                      <Table.DataCell>{/* Toggle placeholder */}</Table.DataCell>
                                    </Table.Row>
                                  ),
                                )}
                            </>
                          );
                        }
                        const isLastRow = index === satser.length - 1;
                        const periode = satsperioder[0];
                        const { fom, tom, satsType, grunnbeløp, dagsats, antallBarn, dagsatsBarnetillegg } =
                          periode || {};
                        return (
                          <Table.ExpandableRow
                            key={`${fom}-${tom}`}
                            content={
                              <BeregningsDetaljer
                                satsperioder={satsperioder}
                                utbetaling={utbetaling}
                                rapportertInntekt={rapportertInntekt}
                                reduksjon={reduksjon}
                                reduksjonsgrunnlag={reduksjonsgrunnlag}
                                gjelderDelerAvMåned={gjelderDelerAvMåned}
                              />
                            }
                            togglePlacement="right"
                            className={isLastRow ? styles.noBottomBorder : ''}
                            expandOnRowClick
                          >
                            <Table.HeaderCell scope="row" className={styles.firstHeaderCell}>
                              <Label size="small">{formatMonthYear(måned)}</Label>
                            </Table.HeaderCell>
                            <Table.DataCell>
                              <BodyShort size="small">{satsType && formatSats(satsType)}</BodyShort>
                            </Table.DataCell>
                            <DataCellWithValue value={grunnbeløp} formatter={formatCurrencyWithKr} />
                            <DataCellWithValue value={dagsats} formatter={formatCurrencyWithoutKr} suffix=" kr" />
                            <DataCellWithValue value={antallBarn} />
                            <DataCellWithValue
                              value={dagsatsBarnetillegg === 0 ? null : dagsatsBarnetillegg}
                              formatter={formatCurrencyWithoutKr}
                              suffix=" kr"
                            />
                            <DataCellWithValue value={antallDager} />
                            <DataCellWithValue value={rapportertInntekt} formatter={formatCurrencyWithKr} />
                            <DataCellWithValue value={utbetaling} formatter={formatCurrencyWithKr} />
                            <Table.DataCell>{status && <StatusTag status={status} />}</Table.DataCell>
                          </Table.ExpandableRow>
                        );
                      },
                    )}
                  </Table.Body>
                </Table>
              </Box>
            )}
          </div>
        </VStack>
      </VStack>
    </div>
  );
};
