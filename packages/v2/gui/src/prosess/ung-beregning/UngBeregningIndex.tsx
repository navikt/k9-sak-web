import type { BehandlingDto } from '@k9-sak-web/backend/k9sak/generated';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, Heading, Loader, Table, VStack } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import axios, { type AxiosResponse } from 'axios';

const formatCurrencyWithKr = (value: number) => {
  const formattedValue = Number(value).toLocaleString('nb-NO').replace(/,|\s/g, ' ');
  return `${formattedValue} kr`;
};

const fetchSatser = (signal: AbortSignal, behandlingUuid: string) =>
  axios
    .get('/k9/sak/api/ungdomsytelse/satser', { signal, params: { behandlingUuid } })
    .then(({ data }: AxiosResponse<SatserData[]>) => data ?? []);

const fetchUttak = (signal: AbortSignal, behandlingUuid: string) =>
  axios
    .get('/k9/sak/api/ungdomsytelse/uttak', { signal, params: { behandlingUuid } })
    .then(({ data }: AxiosResponse<UttakData[]>) => data ?? []);

interface SatserData {
  fom: string;
  tom: string;
  dagsats: number;
  grunnbeløpFaktor: number;
  grunnbeløp: number;
}

interface UttakData {
  fom: string;
  tom: string;
  utbetalingsgrad: number;
  avslagsårsak: string | null;
}

interface Props {
  behandling: BehandlingDto;
}

const UngBeregningIndex = ({ behandling }: Props) => {
  const {
    data: satser,
    isLoading: satserIsLoading,
    isSuccess: satserSuccess,
    isError: satserIsError,
  } = useQuery<SatserData[]>({
    queryKey: ['satser'],
    queryFn: ({ signal }) => fetchSatser(signal, behandling.uuid),
  });

  const {
    data: uttak,
    isLoading: uttakIsLoading,
    isSuccess: uttakSuccess,
    isError: uttakIsError,
  } = useQuery<UttakData[]>({
    queryKey: ['uttak'],
    queryFn: ({ signal }) => fetchUttak(signal, behandling.uuid),
  });

  if (satserIsLoading || uttakIsLoading) {
    return <Loader size="large" />;
  }

  if (satserIsError && uttakIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  return (
    <div className="max-w-[768px]">
      <VStack gap="8">
        {satserSuccess && (
          <div>
            <Heading size="small" level="2">
              Satser
            </Heading>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Periode</Table.HeaderCell>
                  <Table.HeaderCell>Dagsats</Table.HeaderCell>
                  <Table.HeaderCell>Grunnbeløpfaktor</Table.HeaderCell>
                  <Table.HeaderCell>Grunnbeløp</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {satser.map(({ fom, tom, dagsats, grunnbeløpFaktor, grunnbeløp }) => (
                  <Table.Row key={`${fom}_${tom}`}>
                    <Table.DataCell>{formatPeriod(fom, tom)}</Table.DataCell>
                    <Table.DataCell>{dagsats} kr</Table.DataCell>
                    <Table.DataCell>{grunnbeløpFaktor}</Table.DataCell>
                    <Table.DataCell>{formatCurrencyWithKr(grunnbeløp)}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}

        {uttakSuccess && (
          <div>
            <Heading size="small" level="2">
              Uttak
            </Heading>
            <Table>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Periode</Table.HeaderCell>
                  <Table.HeaderCell>Utbetalingsgrad</Table.HeaderCell>
                  <Table.HeaderCell>Avslagsårsak</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {uttak.map(({ fom, tom, utbetalingsgrad, avslagsårsak }) => (
                  <Table.Row key={`${fom}_${tom}`}>
                    <Table.DataCell>{formatPeriod(fom, tom)}</Table.DataCell>
                    <Table.DataCell>{utbetalingsgrad}</Table.DataCell>
                    <Table.DataCell>{avslagsårsak}</Table.DataCell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        )}
      </VStack>
    </div>
  );
};

export default UngBeregningIndex;
