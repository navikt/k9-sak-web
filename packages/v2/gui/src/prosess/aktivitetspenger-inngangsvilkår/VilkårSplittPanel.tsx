import { CalendarIcon, CheckmarkCircleFillIcon, ChevronRightIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, HGrid, HStack, Table, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';

export interface VilkårSplittPanelItem {
  id: string;
  status: 'success' | 'warning' | 'error';
  label: string;
}

interface VilkårSplittPanelProps {
  items: VilkårSplittPanelItem[];
  selectedItemId: string;
  onItemSelect: (id: string) => void;
  detailHeading: string;
  children: ReactNode;
}

const StatusIcon = ({ status }: { status: VilkårSplittPanelItem['status'] }) => {
  switch (status) {
    case 'success':
      return <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />;
    case 'error':
      return <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />;
    case 'warning':
      return <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-warning-strong)' }} />;
  }
};

export const VilkårSplittPanel = ({
  items,
  selectedItemId,
  onItemSelect,
  detailHeading,
  children,
}: VilkårSplittPanelProps) => {
  const selectedItem = items.find(item => item.id === selectedItemId);

  return (
    <HGrid columns="400px 1fr" gap="space-32">
      <Box width="400px" borderColor="neutral-subtle" borderRadius="4" borderWidth="1" padding="space-24">
        <Heading size="small" level="2" spacing>
          Alle søknader
        </Heading>
        <Table size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell scope="col">Status</Table.HeaderCell>
              <Table.HeaderCell scope="col" colSpan={2}>
                Søknadstidspunkt
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {items.map(item => (
              <Table.Row
                key={item.id}
                onClick={() => onItemSelect(item.id)}
                selected={item.id === selectedItemId}
                style={{ cursor: 'pointer' }}
              >
                <Table.HeaderCell scope="row">
                  <HStack align="center">
                    <StatusIcon status={item.status} />
                  </HStack>
                </Table.HeaderCell>
                <Table.DataCell>
                  <BodyShort size="small" textColor="subtle">
                    {item.label}
                  </BodyShort>
                </Table.DataCell>
                <Table.DataCell align="right">
                  <ChevronRightIcon title="Åpne" fontSize="1.5rem" />
                </Table.DataCell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Box>
      <Box borderColor="neutral-subtle" borderRadius="4" borderWidth="1" background="accent-soft" padding="space-24">
        <Heading size="small" level="2" spacing>
          {detailHeading}
        </Heading>
        <VStack gap="space-16">
          {selectedItem && (
            <HStack gap="space-12" align="center">
              <CalendarIcon fontSize="1.5rem" />
              <BodyShort size="small" weight="semibold">
                {selectedItem.label}
              </BodyShort>
            </HStack>
          )}
          <Box borderWidth="1 0 0 0" />
          {children}
        </VStack>
      </Box>
    </HGrid>
  );
};
