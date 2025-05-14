import {
  UngdomsytelseSatsPeriodeDtoSatsType,
  type UngdomsprogramInformasjonDto,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatDate, formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, BodyShort, Box, Heading, Label, Table, Tooltip, VStack } from '@navikt/ds-react';
import styles from './dagsatsOgUtbetaling.module.css';
import { DataSection } from './DataSection';

const formatCurrencyWithKr = (value: number) => {
  const formattedValue = Number(value).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
  return `${formattedValue} kr`;
};

const formatCurrencyNoKr = (value: number) => {
  if (value === null || value === undefined) {
    return undefined;
  }
  // Fjerner mellomrom i tilfelle vi får inn tall med det
  const newVal = value.toString().replace(/\s/g, '');
  if (Number.isNaN(newVal)) {
    return undefined;
  }
  return Number(Math.round(+newVal)).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
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
    tooltipTekst = 'Når deltager er over 25 år, ganger vi grunnbeløpet med 2,056.';
  }
  return (
    <span className={styles.sats}>
      {satstype} {icon && <Tooltip content={tooltipTekst}>{icon}</Tooltip>}
    </span>
  );
};

interface DagsatsOgUtbetalingProps {
  satser: UngdomsytelseSatsPeriodeDto[];
  ungdomsprogramInformasjon: UngdomsprogramInformasjonDto | undefined;
}

export const DagsatsOgUtbetaling = ({ satser, ungdomsprogramInformasjon }: DagsatsOgUtbetalingProps) => {
  const grunnrettData = satser[0];
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
                    <Table.Row className={styles.lastRow}>
                      <Table.DataCell className={styles.firstHeaderCell}>
                        <BodyShort size="small">{grunnrettData.fom && formatDate(grunnrettData.fom)}</BodyShort>
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
                        <Label size="small">Rapportert inntekt</Label>
                      </Table.HeaderCell>
                      <Table.HeaderCell scope="col">
                        <Label size="small">Dager</Label>
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
                      ({ fom, tom, satsType, dagsats, grunnbeløp, antallBarn, dagsatsBarnetillegg }, index) => {
                        const isLastRow = index === satser.length - 1;
                        return (
                          <Table.ExpandableRow
                            key={`${fom}_${tom}`}
                            content="Innhold"
                            togglePlacement="right"
                            className={isLastRow ? styles.lastRow : ''}
                            expandOnRowClick
                          >
                            <Table.DataCell className={styles.firstHeaderCell}>
                              <BodyShort size="small">{fom && tom && formatPeriod(fom, tom)}</BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>
                              <BodyShort size="small">{formatSats(satsType)}</BodyShort>
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
                                {dagsatsBarnetillegg ? `${formatCurrencyNoKr(dagsatsBarnetillegg)} kr` : null}
                              </BodyShort>
                            </Table.DataCell>
                            <Table.DataCell>-</Table.DataCell>
                            <Table.DataCell />
                            <Table.DataCell />
                            <Table.DataCell />
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
