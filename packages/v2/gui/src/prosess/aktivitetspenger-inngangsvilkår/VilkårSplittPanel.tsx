import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import {
  CalendarIcon,
  CheckmarkCircleFillIcon,
  ChevronRightIcon,
  ExclamationmarkTriangleFillIcon,
  PencilIcon,
  XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import { Bleed, BodyShort, Box, Button, Heading, HGrid, HStack, Link, Table, VStack } from '@navikt/ds-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import styles from './vilkårSplittPanel.module.css';

export interface VilkårSplittPanelItem {
  id: string;
  status: 'success' | 'warning' | 'error';
  label: string;
  periode: {
    fom: string;
    tom: string;
  };
}

interface VilkårSplittPanelProps {
  items: VilkårSplittPanelItem[];
  selectedItemId: string;
  onItemSelect: (id: string) => void;
  detailHeading: string;
  lovreferanse?: string;
  defaultIsEditable?: boolean;
  readOnly?: boolean;
  children: ReactNode | ((isLocked: boolean, setIsLocked: React.Dispatch<React.SetStateAction<boolean>>) => ReactNode);
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

export const getItemStatus = (status: string): VilkårSplittPanelItem['status'] => {
  if (status === Utfall.OPPFYLT) return 'success';
  if (status === Utfall.IKKE_OPPFYLT) return 'error';
  return 'warning';
};

export const VilkårSplittPanel = ({
  items,
  selectedItemId,
  onItemSelect,
  detailHeading,
  defaultIsEditable = false,
  readOnly = false,
  children,
  lovreferanse,
}: VilkårSplittPanelProps) => {
  const selectedItem = items.find(item => item.id === selectedItemId);
  const isRenderProp = typeof children === 'function';
  const [isEditable, setIsEditable] = useState(defaultIsEditable);
  const effectiveLocked = isEditable || readOnly;

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
                      <Link as="span" inlineText>
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
          {lovreferanse && (
            <BodyShort size="small" textColor="subtle">
              <Lovreferanse isUng>{lovreferanse}</Lovreferanse>
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
          {isRenderProp ? (
            <Box
              borderRadius="8"
              padding={effectiveLocked ? 'space-16' : 'space-0'}
              background={effectiveLocked ? 'info-softA' : undefined}
            >
              <VStack gap={isEditable && !readOnly ? 'space-20' : 'space-0'}>
                {children(effectiveLocked, setIsEditable)}
                <Bleed marginInline="space-8">
                  {isEditable && !readOnly && (
                    <Button
                      size="small"
                      variant="tertiary"
                      icon={<PencilIcon title="Rediger vurdering" fontSize="1.5rem" />}
                      onClick={() => setIsEditable(false)}
                    >
                      Rediger vurdering
                    </Button>
                  )}
                </Bleed>
              </VStack>
            </Box>
          ) : (
            children
          )}
        </VStack>
      </Box>
    </HGrid>
  );
};
