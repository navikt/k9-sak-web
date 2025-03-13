import { Alert, Table } from '@navikt/ds-react';
import type { Barn } from './types/Barn';

interface Props {
  barn: Barn[];
}

const UngBarnFakta = ({ barn }: Props) => {
  const harBarnMedDødsdato = barn.some(b => !!b.dødsdato);
  return (
    <div className="flex mt-4">
      {barn.length === 0 ? (
        <Alert variant="info" size="small">
          Det er ingen barn registrert på søker
        </Alert>
      ) : (
        <div>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col">Navn</Table.HeaderCell>
                <Table.HeaderCell scope="col">Fødselsdato</Table.HeaderCell>
                {harBarnMedDødsdato && <Table.HeaderCell scope="col">Dødsdato</Table.HeaderCell>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {barn.map(({ navn, fødselsdato, dødsdato }) => {
                return (
                  <Table.Row key={navn}>
                    <Table.HeaderCell scope="row">{navn}</Table.HeaderCell>
                    <Table.DataCell>{fødselsdato}</Table.DataCell>
                    {harBarnMedDødsdato && <Table.DataCell>{dødsdato}</Table.DataCell>}
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UngBarnFakta;
