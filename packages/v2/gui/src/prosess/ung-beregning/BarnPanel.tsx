import { BodyShort, Box, Label, Table } from '@navikt/ds-react';
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
              <Label size="small">Navn</Label>
            </Table.HeaderCell>
            <Table.HeaderCell scope="col">
              <Label size="small">Fødselsdato</Label>
            </Table.HeaderCell>
            {harBarnMedDødsdato && (
              <Table.HeaderCell scope="col">
                <Label size="small">Dødsdato</Label>
              </Table.HeaderCell>
            )}
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {barn.map(({ navn, fødselsdato, dødsdato }, index) => {
            const isLastRow = index === barn.length - 1;
            return (
              <Table.Row key={navn} className={isLastRow ? styles.lastRow : ''}>
                <Table.DataCell className={styles.firstHeaderCell}>
                  <BodyShort size="small">{navn}</BodyShort>
                </Table.DataCell>
                <Table.DataCell>
                  <BodyShort size="small">{fødselsdato}</BodyShort>
                </Table.DataCell>
                {harBarnMedDødsdato && (
                  <Table.DataCell>
                    <BodyShort size="small">{dødsdato}</BodyShort>
                  </Table.DataCell>
                )}
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
    </Box>
  );
};
