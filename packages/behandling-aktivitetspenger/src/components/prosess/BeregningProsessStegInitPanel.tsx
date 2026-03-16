import { ProsessPanelContext } from '@k9-sak-web/gui/behandling/prosess/ProsessPanelContext.js';
import { prosessStegCodes } from '@k9-sak-web/konstanter';
import { Box, Heading, Table, VStack } from '@navikt/ds-react';
import { useContext } from 'react';

const mockData = {
  virkningstidspunkt: '2026-02-26',
  årsinntektSisteÅr: 0,
  årsinntektSisteTreÅr: 0,
  besteBeregning: 0,
  pgiÅrsinntekter: [
    {
      årstall: 2023,
      pgiÅrsinntekt: 0,
      avkortetOgOppjustert: 0,
    },
    {
      årstall: 2024,
      pgiÅrsinntekt: 0,
      avkortetOgOppjustert: 0,
    },
    {
      årstall: 2025,
      pgiÅrsinntekt: 0,
      avkortetOgOppjustert: 0,
    },
  ],
};

const PANEL_ID = prosessStegCodes.BEREGNING;

export const BeregningProsessStegInitPanel = () => {
  const prosessPanelContext = useContext(ProsessPanelContext);
  const erValgt = prosessPanelContext?.erValgt(PANEL_ID);
  if (!erValgt) {
    return null;
  }
  return (
    <Box paddingInline="space-16 space-32" paddingBlock="space-8">
      <VStack gap="space-16">
        <Heading size="medium" level="1" spacing>
          Beregning
        </Heading>
        <Heading size="small" level="2" spacing>
          Pensjonsgivende inntekt
        </Heading>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>3 siste år fra skatt</Table.HeaderCell>
              <Table.HeaderCell>Inntekt</Table.HeaderCell>
              <Table.HeaderCell>Avkortet og oppjustert</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {mockData.pgiÅrsinntekter.map(inntekt => (
              <Table.Row key={inntekt.årstall}>
                <Table.DataCell>{inntekt.årstall}</Table.DataCell>
                <Table.DataCell>{inntekt.pgiÅrsinntekt}</Table.DataCell>
                <Table.DataCell>{inntekt.avkortetOgOppjustert}</Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </VStack>
    </Box>
  );
};
