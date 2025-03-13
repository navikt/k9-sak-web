import {
  UngdomsytelseSatsPeriodeDtoSatsType,
  type UngdomsytelseSatsPeriodeDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Heading, Table, Tooltip, VStack } from '@navikt/ds-react';
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
  if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.LAV) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#417DA0" />
      </svg>
    );
  } else if (satstype === UngdomsytelseSatsPeriodeDtoSatsType.HØY) {
    icon = (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="5" cy="5" r="5" fill="#B65781" />
      </svg>
    );
  }
  return (
    <div className="flex items-center gap-2">
      {satstype} {icon && <Tooltip content="Hjelpetekst om satser her">{icon}</Tooltip>}
    </div>
  );
};

interface DagsatsOgUtbetalingProps {
  satser: UngdomsytelseSatsPeriodeDto[];
}

export const DagsatsOgUtbetaling = ({ satser }: DagsatsOgUtbetalingProps) => (
  <div className="mt-5">
    <VStack gap="4">
      <DataSection />

      <div>
        <Heading size="xsmall">Beregning av dagsats</Heading>
        <div className="rounded-lg border border-[#CFD3D8] flex border-solid mt-3 ">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col" className="pl-4">
                  Periode
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Sats</Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Grunnbeløp
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Dagsats
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Antall barn
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Barnetillegg
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Rapportert inntekt
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Dager
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Utbetaling
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Status</Table.HeaderCell>
                <Table.HeaderCell />
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {satser.map(({ fom, tom, satsType, dagsats, grunnbeløp, antallBarn, dagsatsBarnetillegg }, index) => {
                const isLastRow = index === satser.length - 1;
                return (
                  <Table.ExpandableRow
                    key={`${fom}_${tom}`}
                    content="Innhold"
                    togglePlacement="right"
                    className={isLastRow ? '[&>td]:border-none' : ''}
                  >
                    <Table.DataCell className="pl-4">{fom && tom && formatPeriod(fom, tom)}</Table.DataCell>
                    <Table.DataCell>{formatSats(satsType)}</Table.DataCell>
                    <Table.DataCell align="right">{grunnbeløp && formatCurrencyWithKr(grunnbeløp)}</Table.DataCell>
                    <Table.DataCell align="right">{dagsats && formatCurrencyNoKr(dagsats)} kr</Table.DataCell>
                    <Table.DataCell align="right">{antallBarn}</Table.DataCell>
                    <Table.DataCell align="right">
                      {dagsatsBarnetillegg ? `${formatCurrencyNoKr(dagsatsBarnetillegg)} kr` : ''}
                    </Table.DataCell>
                    <Table.DataCell />
                    <Table.DataCell />
                    <Table.DataCell />
                    <Table.DataCell />
                  </Table.ExpandableRow>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      </div>
    </VStack>
  </div>
);
