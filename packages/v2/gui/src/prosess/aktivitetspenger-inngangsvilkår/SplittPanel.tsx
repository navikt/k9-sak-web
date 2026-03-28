import { CalendarIcon, CheckmarkCircleFillIcon, ChevronRightIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Heading, HGrid, HStack, Label, Table, Tabs, VStack } from '@navikt/ds-react';

export const SplittPanel = () => {
  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab value="søknadsfrist" label="Søknadsfrist" />
        <Tabs.Tab value="alder" label="Alder" />
        <Tabs.Tab value="bosatt_i_trondheim" label="Bosatt i Trondheim" />
        <Tabs.Tab value="andre_livsoppholdytelser" label="Andre livsoppholdytelser" />
        <Tabs.Tab value="behov_for_bistand" label="Behov for bistand" />
      </Tabs.List>
      <Tabs.Panel value="søknadsfrist">
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
                <Table.Row>
                  <Table.HeaderCell scope="row">
                    <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
                  </Table.HeaderCell>
                  <Table.DataCell>
                    <BodyShort size="small" textColor="subtle" data-color="accent">
                      01.11.2026
                    </BodyShort>
                  </Table.DataCell>
                  <Table.DataCell align="right">
                    <ChevronRightIcon title="Åpne" fontSize="1.5rem" />
                  </Table.DataCell>
                </Table.Row>
              </Table.Body>
            </Table>
          </Box>
          <Box
            borderColor="neutral-subtle"
            borderRadius="4"
            borderWidth="1"
            background="accent-soft"
            padding="space-24"
          >
            <Heading size="small" level="2" spacing>
              Vurdering av søknadsfrist
            </Heading>
            <VStack gap="space-16">
              <HStack gap="space-12" align="center">
                <CalendarIcon fontSize="1.5rem" />
                <BodyShort size="small" weight="semibold">
                  01.11.2026
                </BodyShort>
              </HStack>
              <Box borderWidth="1 0 0 0" />
              <Box borderRadius="8" background="info-softA" padding="space-16">
                <VStack gap="space-24">
                  <VStack gap="space-8">
                    <Label size="small" as="p">
                      Søknad innsendt
                    </Label>
                    <BodyShort size="small">01.11.2026</BodyShort>
                  </VStack>
                  <VStack gap="space-8">
                    <Label size="small" as="p">
                      Er vilkår om søknadsfrist oppfylt?
                    </Label>
                    <BodyShort size="small">Vilkåret er oppfylt</BodyShort>
                  </VStack>
                </VStack>
              </Box>
            </VStack>
          </Box>
        </HGrid>
      </Tabs.Panel>
    </Tabs>
  );
};
