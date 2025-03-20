import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { HStack, Table } from '@navikt/ds-react';

const dummyData = [
  {
    status: 'Ingen avvik',
    arbeidsforhold: 'Bedrift AS',
    periode: `${new Date().toLocaleDateString('no')} - ${new Date().toLocaleDateString('no')}`,
    rapportertDeltager: '0 kr',
    rapportertInntekt: '0 kr',
  },
];

export const ArbeidOgInntekt = () => (
  <div className="rounded-lg border border-[#CFD3D8] flex border-solid mt-7 ">
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell scope="col" className="pl-4">
            Status
          </Table.HeaderCell>
          <Table.HeaderCell scope="col">Arbeidsforhold</Table.HeaderCell>
          <Table.HeaderCell scope="col">Periode</Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Rapportert av deltager
          </Table.HeaderCell>
          <Table.HeaderCell scope="col" align="right">
            Rapportert i A-inntekt
          </Table.HeaderCell>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {dummyData.map((data, index) => {
          const isLastRow = index === dummyData.length - 1;
          return (
            <Table.ExpandableRow
              key={index}
              content="Innhold"
              togglePlacement="right"
              className={isLastRow ? '[&>td]:border-none' : ''}
            >
              <Table.DataCell className="pl-2">
                <HStack gap="2">
                  <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
                  {data.status}
                </HStack>
              </Table.DataCell>
              <Table.DataCell>{data.arbeidsforhold}</Table.DataCell>
              <Table.DataCell>{data.periode}</Table.DataCell>
              <Table.DataCell align="right">{data.rapportertDeltager}</Table.DataCell>
              <Table.DataCell align="right">{data.rapportertInntekt}</Table.DataCell>
            </Table.ExpandableRow>
          );
        })}
      </Table.Body>
    </Table>
  </div>
);
