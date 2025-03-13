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
          Deltaker har ingen registrerte barn i folkeregisteret.
        </Alert>
      ) : (
        <div className="rounded-lg border border-[#CFD3D8] flex border-solid">
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell scope="col" className="pl-4">
                  Navn
                </Table.HeaderCell>
                <Table.HeaderCell scope="col">Fødselsdato</Table.HeaderCell>
                {harBarnMedDødsdato && <Table.HeaderCell scope="col">Dødsdato</Table.HeaderCell>}
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {barn.map(({ navn, fødselsdato, dødsdato }, index) => {
                const isLastRow = index === barn.length - 1;
                return (
                  <Table.Row key={navn} className={isLastRow ? '[&>td]:border-none' : ''}>
                    <Table.DataCell className="pl-4">{navn}</Table.DataCell>
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
