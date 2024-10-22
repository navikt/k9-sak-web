import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, Heading, Loader, Table } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
import type { SatserData } from './SatserData';
import type { UngBeregningBackendApiType } from './UngBeregningBackendApiType';

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

const parseCurrencyInput = (input: number) => {
  const inputNoSpace = input.toString().replace(/\s/g, '');
  const parsedValue = parseInt(inputNoSpace, 10);
  return Number.isNaN(parsedValue) ? '' : formatCurrencyNoKr(parsedValue);
};

interface Props {
  behandling: { uuid: string };
  api: UngBeregningBackendApiType;
}

const UngBeregning = ({ api, behandling }: Props) => {
  const {
    data: satser,
    isLoading: satserIsLoading,
    isSuccess: satserSuccess,
    isError: satserIsError,
  } = useQuery<SatserData[]>({
    queryKey: ['satser'],
    queryFn: () => api.getSatser(behandling.uuid),
  });

  if (satserIsLoading) {
    return <Loader size="large" />;
  }

  if (satserIsError) {
    return <Alert variant="error">Noe gikk galt, vennligst prøv igjen senere</Alert>;
  }

  return (
    <div className="max-w-[768px]">
      {satserSuccess && (
        <div>
          <Heading size="small" level="2">
            Satser
          </Heading>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Periode</Table.HeaderCell>
                <Table.HeaderCell>Sats</Table.HeaderCell>
                <Table.HeaderCell>Grunnbeløp</Table.HeaderCell>
                <Table.HeaderCell>Dagsats</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {satser.map(({ fom, tom, satsType, dagsats, grunnbeløp }) => (
                <Table.Row key={`${fom}_${tom}`}>
                  <Table.DataCell>{formatPeriod(fom, tom)}</Table.DataCell>
                  <Table.DataCell>{satsType}</Table.DataCell>
                  <Table.DataCell>{formatCurrencyWithKr(grunnbeløp)}</Table.DataCell>
                  <Table.DataCell>{parseCurrencyInput(dagsats)} kr</Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UngBeregning;
