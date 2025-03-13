import {
  type UngdomsytelseSatsPeriodeDto,
  UngdomsytelseSatsPeriodeDtoSatsType,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, Box, Heading, Loader, Table, Tabs, Tooltip, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import { DataSection } from './DataSection';
import UngBarnFakta from './UngBarnFakta';
import type { UngBeregningBackendApiType } from './UngBeregningBackendApiType';
import type { Barn } from './types/Barn';

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
  let icon = undefined;
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

interface Props {
  behandling: { uuid: string };
  api: UngBeregningBackendApiType;
  barn: Barn[];
}

const UngBeregning = ({ api, behandling, barn }: Props) => {
  const {
    data: satser,
    isLoading: satserIsLoading,
    isSuccess: satserSuccess,
    isError: satserIsError,
  } = useQuery<UngdomsytelseSatsPeriodeDto[]>({
    queryKey: ['satser', behandling.uuid],
    queryFn: () => api.getSatser(behandling.uuid),
  });

  if (satserIsLoading) {
    return <Loader size="large" />;
  }

  if (satserIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  return (
    <Box paddingInline="4 8" paddingBlock="2">
      <div className="min-h-svh">
        <Heading size="medium" level="1" spacing>
          Sats og beregning
        </Heading>
        <Tabs defaultValue="dagsats">
          <Tabs.List>
            <Tabs.Tab value="dagsats" label="Dagsats" />
            <Tabs.Tab value="barn" label="Registrerte barn" />
            <Tabs.Tab value="arbeid-inntekt" label="Dagsats og utbetaling" />
          </Tabs.List>
          <Tabs.Panel value="dagsats">
            <div className="mt-5">
              <VStack gap="4">
                <DataSection />
                {satserSuccess && (
                  <div>
                    <Heading size="xsmall">Beregning av dagsats</Heading>
                    <div className="rounded-lg border border-[#CFD3D8] px-4 pt-1 pb-4 flex border-solid mt-3 ">
                      <Table>
                        <Table.Header>
                          <Table.Row>
                            <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
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
                          </Table.Row>
                        </Table.Header>
                        <Table.Body>
                          {satser.map(
                            ({ fom, tom, satsType, dagsats, grunnbeløp, antallBarn, dagsatsBarnetillegg }) => (
                              <Table.Row key={`${fom}_${tom}`}>
                                <Table.DataCell>{fom && tom && formatPeriod(fom, tom)}</Table.DataCell>
                                <Table.DataCell>{formatSats(satsType)}</Table.DataCell>
                                <Table.DataCell align="right">
                                  {grunnbeløp && formatCurrencyWithKr(grunnbeløp)}
                                </Table.DataCell>
                                <Table.DataCell align="right">
                                  {dagsats && formatCurrencyNoKr(dagsats)} kr
                                </Table.DataCell>
                                <Table.DataCell align="right">{antallBarn}</Table.DataCell>
                                <Table.DataCell align="right">
                                  {dagsatsBarnetillegg ? `${formatCurrencyNoKr(dagsatsBarnetillegg)} kr` : ''}
                                </Table.DataCell>
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell />
                                <Table.DataCell />
                              </Table.Row>
                            ),
                          )}
                        </Table.Body>
                      </Table>
                    </div>
                  </div>
                )}
              </VStack>
            </div>
          </Tabs.Panel>
          <Tabs.Panel value="barn">
            <UngBarnFakta barn={barn} />
          </Tabs.Panel>
        </Tabs>
      </div>
    </Box>
  );
};

export default UngBeregning;
