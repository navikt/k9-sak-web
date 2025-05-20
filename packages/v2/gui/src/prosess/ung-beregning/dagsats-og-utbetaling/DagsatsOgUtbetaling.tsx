import {
  UngdomsytelseSatsPeriodeDtoSatsType,
  UngdomsytelseUtbetaltMånedDtoStatus,
  type GetSatsOgUtbetalingPerioderResponse,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatDate, formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, BodyShort, Box, Heading, Label, Loader, Table, Tag, Tooltip, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import type { UngBeregningBackendApiType } from '../UngBeregningBackendApiType';
import styles from './dagsatsOgUtbetaling.module.css';
import { DataSection } from './DataSection';

const formatCurrencyWithKr = (value: number) => {
  const roundedValue = Math.round(value);
  const formattedValue = roundedValue.toLocaleString('nb-NO').replace(/,|\s/g, ' ');
  return `${formattedValue} kr`;
};

const formatCurrencyNoKr = (value: number) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  const newVal = value.toString().replace(/\s/g, '');
  if (Number.isNaN(newVal)) {
    return undefined;
  }
  return Math.round(+newVal).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
};

const formatSats = (satstype: UngdomsytelseSatsPeriodeDtoSatsType) => {
  let icon: React.ReactElement | undefined = undefined;
  let tooltipTekst = '';
  if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.LAV) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#417DA0" />
      </svg>
    );
    tooltipTekst = 'Når deltaker er under 25 år, ganger vi grunnbeløpet med 1,33.';
  } else if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.HØY) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#B65781" />
      </svg>
    );
    tooltipTekst = 'Når deltaker er over 25 år, ganger vi grunnbeløpet med 2,056.';
  }
  return (
    <span className={styles.sats}>
      {satstype} {icon && <Tooltip content={tooltipTekst}>{icon}</Tooltip>}
    </span>
  );
};

const sortSatser = (data: GetSatsOgUtbetalingPerioderResponse) =>
  data?.toSorted((a, b) => new Date(a.måned).getTime() - new Date(b.måned).getTime()).toReversed();

const formatMonthYear = (dateStr: string): string => {
  const date = new Date(`${dateStr}-01T00:00:00`);

  // Format using Norwegian locale
  const formatted = new Intl.DateTimeFormat('nb-NO', {
    month: 'long',
    year: 'numeric',
  }).format(date);

  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};

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
  } = useQuery<GetSatsOgUtbetalingPerioderResponse>({
    queryKey: ['satser', behandling.uuid],
    queryFn: () => api.getSatser(behandling.uuid),
    select: sortSatser,
  });
  const isLoading = satserIsLoading || ungdomsprogramInformasjonIsLoading;
  if (isLoading) {
    <Loader size="large" />;
  }
  if (satserIsError || ungdomsprogramInformasjonIsError || !satser) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }
  const grunnrettData = satser[0]?.satsperioder[0];
  return (
    <div className={styles.dagsatsSection}>
      <VStack gap="4">
        <DataSection ungdomsprogramInformasjon={ungdomsprogramInformasjon} />
        <VStack gap="8">
          {grunnrettData && (
            <div>
              <Heading size="xsmall">Grunnrett</Heading>
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
                      <Table.HeaderCell scope="col" className={styles.firstHeaderCell}>
                        <Label size="small">Startdato</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Sats</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Grunnbeløp</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Dagsats</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Antall barn</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Barnetillegg</Label>
                      </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    <Table.Row className={styles.noBottomBorder}>
                      <Table.DataCell className={styles.firstHeaderCell}>
                        <BodyShort size="small">{grunnrettData && formatDate(grunnrettData.fom)}</BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">{formatSats(grunnrettData.satsType)}</BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">
                          {grunnrettData.grunnbeløp && formatCurrencyWithKr(grunnrettData.grunnbeløp)}
                        </BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">
                          {grunnrettData.dagsats && formatCurrencyNoKr(grunnrettData.dagsats)} kr
                        </BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">{grunnrettData.antallBarn}</BodyShort>
                      </Table.DataCell>
                      <Table.DataCell>
                        <BodyShort size="small">
                          {grunnrettData.dagsatsBarnetillegg
                            ? `${formatCurrencyNoKr(grunnrettData.dagsatsBarnetillegg)} kr`
                            : null}
                        </BodyShort>
                      </Table.DataCell>
                    </Table.Row>
                  </Table.Body>
                </Table>
              </Box>
            </div>
          )}
          <div>
            <Heading size="xsmall">Beregning av dagsats og utbetaling</Heading>
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
                      <Table.HeaderCell scope="col" className={styles.firstHeaderCell}>
                        <Label size="small">Periode</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Sats</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Grunnbeløp</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Dagsats</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Antall barn</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Barnetillegg</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Dager</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Rapportert inntekt</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Utbetaling</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Status</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell />
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {satser.map(
                      ({ antallDager, måned, rapportertInntekt, satsperioder, status, utbetaling }, index) => {
                        const harFlereSatsperioder = satsperioder.length > 1;
                        if (harFlereSatsperioder) {
                          return (
                            <>
                              <Table.ExpandableRow
                                key={`${satsperioder[0]?.fom}-${satsperioder[0]?.tom}`}
                                content="Innhold"
                                togglePlacement="right"
                                expandOnRowClick
                              >
                                <Table.HeaderCell scope="row" className={styles.firstHeaderCell}>
                                  <Label size="small">{formatMonthYear(måned)}</Label>
                                </Table.HeaderCell>
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell>{antallDager}</Table.DataCell>
                                <Table.DataCell>
                                  <BodyShort size="small">
                                    {(rapportertInntekt && formatCurrencyWithKr(rapportertInntekt)) ?? '-'}
                                  </BodyShort>
                                </Table.DataCell>
                                <Table.DataCell>{utbetaling && formatCurrencyWithKr(utbetaling)}</Table.DataCell>
                                <Table.DataCell>
                                  {status === UngdomsytelseUtbetaltMånedDtoStatus.TIL_UTBETALING ? (
                                    <Tag size="small" variant="info">
                                      Til utbetaling
                                    </Tag>
                                  ) : (
                                    <Tag size="small" variant="success">
                                      Utbetalt
                                    </Tag>
                                  )}
                                </Table.DataCell>
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
                                  }) => {
                                    return (
                                      <Table.Row
                                        key={`${fom}-${tom}`}
                                        content="Innhold"
                                        className={styles.noBottomBorder}
                                      >
                                        <Table.DataCell className={styles.firstHeaderCell}>
                                          <BodyShort size="small">{fom && tom && formatPeriod(fom, tom)}</BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                          <BodyShort size="small">{formatSats(satsType)}</BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                          <BodyShort size="small">
                                            {grunnbeløp && formatCurrencyWithKr(grunnbeløp)}
                                          </BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                          <BodyShort size="small">
                                            {dagsats && formatCurrencyNoKr(dagsats)} kr
                                          </BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                          <BodyShort size="small">{antallBarn}</BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                          <BodyShort size="small">
                                            {dagsatsBarnetillegg
                                              ? `${formatCurrencyNoKr(dagsatsBarnetillegg)} kr`
                                              : '-'}
                                          </BodyShort>
                                        </Table.DataCell>
                                        <Table.DataCell>{antallDagerIPeriode}</Table.DataCell>
                                        <Table.DataCell />
                                        <Table.DataCell />
                                        <Table.DataCell />
                                        <Table.DataCell />
                                      </Table.Row>
                                    );
                                  },
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
                            content="Innhold"
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
                            <Table.DataCell>
                              <BodyShort size="small">{grunnbeløp && formatCurrencyWithKr(grunnbeløp)}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                              <BodyShort size="small">{dagsats && formatCurrencyNoKr(dagsats)} kr</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                              <BodyShort size="small">{antallBarn}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                              <BodyShort size="small">
                                {dagsatsBarnetillegg ? `${formatCurrencyNoKr(dagsatsBarnetillegg)} kr` : '-'}
                              </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>{antallDager}</Table.DataCell>
                            <Table.DataCell>
                              <BodyShort size="small">
                                {rapportertInntekt && formatCurrencyWithKr(rapportertInntekt)}
                              </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>{utbetaling && formatCurrencyWithKr(utbetaling)}</Table.DataCell>
                            <Table.DataCell>
                              {status === UngdomsytelseUtbetaltMånedDtoStatus.TIL_UTBETALING ? (
                                <Tag size="small" variant="info">
                                  Til utbetaling
                                </Tag>
                              ) : (
                                <Tag size="small" variant="success">
                                  Utbetalt
                                </Tag>
                              )}
                            </Table.DataCell>
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
