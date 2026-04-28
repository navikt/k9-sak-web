import { BodyShort, Label, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { VilkårSplittPanel } from './VilkårSplittPanel';

export const Søknadsfrist = () => {
  const [selectedId, setSelectedId] = useState('1');

  return (
    <VilkårSplittPanel
      items={[{ id: '1', status: 'success', label: '01.01.2001', lovreferanse: 'Forskrift om aktivitetspenger § 4-3' }]}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av søknadsfrist"
    >
      <VStack gap="space-24">
        <VStack gap="space-8">
          <Label size="small" as="p">
            Søknad innsendt
          </Label>
          <BodyShort size="small">01.01.2001</BodyShort>
        </VStack>
        <VStack gap="space-8">
          <Label size="small" as="p">
            Er vilkår om søknadsfrist oppfylt?
          </Label>
          <BodyShort size="small">Vilkåret er oppfylt</BodyShort>
        </VStack>
      </VStack>
    </VilkårSplittPanel>
  );
};
