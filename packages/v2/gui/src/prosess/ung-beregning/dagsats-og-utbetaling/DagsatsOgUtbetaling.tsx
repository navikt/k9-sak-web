import {
  UngdomsytelseUtbetaltMånedDtoStatus,
  type GetSatsOgUtbetalingPerioderResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatCurrencyWithKr, formatCurrencyWithoutKr } from '@k9-sak-web/gui/utils/formatters.js';
import { formatDate, formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, BodyShort, Box, Heading, Label, Loader, Table, Tag, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import type { UngBeregningBackendApiType } from '../UngBeregningBackendApiType';
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
  'Rapportert inntekt',
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

const sortSatser = (data: GetSatsOgUtbetalingPerioderResponse) =>
  data?.toSorted((a, b) => new Date(a.måned).getTime() - new Date(b.måned).getTime()).toReversed();

interface DagsatsOgUtbetalingProps {
  api: UngBeregningBackendApiType;
  behandling: { uuid: string };
}

export const DagsatsOgUtbetaling = ({ api, behandling }: DagsatsOgUtbetalingProps) => {
  const {
    data: ungdomsprogramInformasjon,
    isLoading: ungdomsprogramInformasjonIsLoading,
    isError: ungdomsprogramInformasjonIsError,
  } = useQuery({
    queryKey: ['ungdomsprogramInformasjon', behandling.uuid],
    queryFn: () => api.getUngdomsprogramInformasjon(behandling.uuid),
  });

  const {
    data: satser,
    isLoading: satserIsLoading,
    isError: satserIsError,
  } = useQuery({
    queryKey: ['satser', behandling.uuid],
    queryFn: () => api.getSatsOgUtbetalingPerioder(behandling.uuid),
    select: sortSatser,
  });
  const isLoading = satserIsLoading || ungdomsprogramInformasjonIsLoading;
  if (isLoading) {
    <Loader size="large" />;
  }
  if (satserIsError || ungdomsprogramInformasjonIsError || !satser) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }
  const grunnrettData = satser[satser.length - 1]?.satsperioder[0];
  const sisteUtbetaling = satser.find(sats => sats.status === UngdomsytelseUtbetaltMånedDtoStatus.UTBETALT);
  return (
    <div className={styles.dagsatsSection}>
      <VStack gap="4">
        <DataSection ungdomsprogramInformasjon={ungdomsprogramInformasjon} sisteUtbetaling={sisteUtbetaling} />
        <VStack gap="8">
          {grunnrettData && (
            <div>
              <Heading size="xsmall" level="2">
                Grunnrett
              </Heading>
              <Box
                marginBlock="4 0"
                borderRadius="large"
                borderWidth="1"
                borderColor="border-divider"
                maxWidth="43.5rem"
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
              <Box marginBlock="3 0" maxWidth="43.5rem">
                <Alert variant="info" size="small">
                  Ingen utbetaling ennå
                </Alert>
              </Box>
            )}
            {satser.length > 0 && (
              <Box marginBlock="4 0" borderRadius="large" borderWidth="1" borderColor="border-divider">
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
                        { antallDager, måned, rapportertInntekt, satsperioder, status, utbetaling, reduksjon },
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
