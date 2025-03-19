import { Box, Table } from '@navikt/ds-react';
import styles from './barn.module.css';
import type { Barn } from './types/Barn';

interface Props {
  barn: Barn[];
}

export const BarnPanel = ({ barn }: Props) => {
  const harBarnMedDødsdato = barn.some(b => !!b.dødsdato);
  return (
    <Box marginBlock="4 0" borderRadius="large" borderWidth="1" borderColor="border-divider">
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell scope="col" className={styles.firstHeaderCell}>
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
              <Table.Row key={navn} className={isLastRow ? styles.lastRow : ''}>
                <Table.DataCell className={styles.firstHeaderCell}>{navn}</Table.DataCell>
                <Table.DataCell>{fødselsdato}</Table.DataCell>
                {harBarnMedDødsdato && <Table.DataCell>{dødsdato}</Table.DataCell>}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Box>
  );
};
