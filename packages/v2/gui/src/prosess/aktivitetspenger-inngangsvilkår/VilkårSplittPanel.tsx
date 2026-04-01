import {
  CalendarIcon,
  CheckmarkCircleFillIcon,
  ChevronRightIcon,
  ExclamationmarkTriangleFillIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Heading, HGrid, HStack, Link, Table, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import styles from './vilkårSplittPanel.module.css';

export interface VilkårSplittPanelItem {
  id: string;
  status: 'success' | 'warning' | 'error';
  label: string;
  lovreferanse?: string;
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
      return <CheckmarkCircleFillIcon fontSize={24} color="var(--ax-bg-success-strong)" />;
    case 'error':
      return <XMarkOctagonFillIcon fontSize={24} color="var(--ax-bg-danger-strong)" />;
    case 'warning':
      return <ExclamationmarkTriangleFillIcon fontSize={24} color="var(--ax-text-warning-decoration)" />;
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
      <Box
        width="400px"
        borderColor="neutral-subtle"
        borderRadius="8"
        borderWidth="1"
        paddingBlock="space-16 space-0"
        paddingInline="space-16"
        style={{ alignSelf: 'start' }}
      >
        <Heading size="small" level="2">
          Alle søknader
        </Heading>
        <Bleed marginInline="space-16">
          <Table size="medium">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textSize="small" scope="col" className={styles.tableStatusCell}>
                  Status
                </Table.HeaderCell>
                <Table.HeaderCell textSize="small" scope="col" colSpan={2}>
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
                  className={`${styles.selectableRow} ${item.id === selectedItemId ? styles.selectedRow : ''}`}
                >
                  <Table.HeaderCell scope="row" align="center">
                    <HStack align="center" justify="center">
                      <StatusIcon status={item.status} />
                    </HStack>
                  </Table.HeaderCell>
                  <Table.DataCell>
                    <BodyShort size="small" textColor="subtle">
                      <Link as="p" inlineText>
                        {item.label}
                      </Link>
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell>
                    <HStack align="center" justify="end">
                      <ChevronRightIcon title="Åpne" fontSize="1.5rem" />
                    </HStack>
                  </Table.DataCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Bleed>
      </Box>
      <Box borderColor="neutral-subtle" borderRadius="8" borderWidth="1" background="accent-soft" padding="space-24">
        <HStack gap="space-8" align="baseline">
          <Heading size="small" level="2" spacing>
            {detailHeading}
          </Heading>
          {selectedItem?.lovreferanse && (
            <BodyShort size="small" textColor="subtle">
              <Lovreferanse isUng>{selectedItem.lovreferanse}</Lovreferanse>
            </BodyShort>
          )}
        </HStack>
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
