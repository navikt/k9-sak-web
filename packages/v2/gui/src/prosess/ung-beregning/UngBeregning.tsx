import type { UngdomsytelseSatsPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { Alert, Heading, Loader, Table } from '@navikt/ds-react';
import { useQuery } from '@tanstack/react-query';
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
  } = useQuery<UngdomsytelseSatsPeriodeDto[]>({
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
                <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
                <Table.HeaderCell scope="col">Sats</Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Grunnbeløp
                </Table.HeaderCell>
                <Table.HeaderCell scope="col" align="right">
                  Dagsats
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {satser.map(({ fom, tom, satsType, dagsats, grunnbeløp }) => (
                <Table.Row key={`${fom}_${tom}`}>
                  <Table.DataCell>{fom && tom && formatPeriod(fom, tom)}</Table.DataCell>
                  <Table.DataCell>{satsType}</Table.DataCell>
                  <Table.DataCell align="right">{grunnbeløp && formatCurrencyWithKr(grunnbeløp)}</Table.DataCell>
                  <Table.DataCell align="right">{dagsats && formatCurrencyNoKr(dagsats)} kr</Table.DataCell>
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
