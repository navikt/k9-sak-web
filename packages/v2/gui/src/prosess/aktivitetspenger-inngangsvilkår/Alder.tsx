import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { CogIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, Tag, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { getItemStatus, VilkårSplittPanel, type VilkårSplittPanelItem } from './VilkårSplittPanel';
interface Props {
  alderVilkår: VilkårMedPerioderDto;
}

const getVilkårUtfall = (vilkårStatus: Utfall) => {
  if (vilkårStatus === Utfall.OPPFYLT) return 'Ja';
  return 'Nei';
};

export const Alder = ({ alderVilkår }: Props) => {
  const items: VilkårSplittPanelItem[] = (alderVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getItemStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)} - ${formatDate(p.periode.tom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');

  const selectedVilkårPeriode = alderVilkår.perioder?.find(p => p.periode.fom === selectedId);

  return (
    <VilkårSplittPanel
      items={items}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av alder"
      lovreferanse={alderVilkår.lovReferanse}
    >
      <VStack gap="space-24">
        <VStack gap="space-8">
          <Label size="small" as="p">
            Er vilkår om alder oppfylt på søknadstidspunktet?
          </Label>
          <BodyShort size="small">
            <HStack gap="space-8" align="center">
              {selectedVilkårPeriode && getVilkårUtfall(selectedVilkårPeriode.vilkarStatus)}
              <Tag variant="outline" size="small">
                Fra folkeregisteret
              </Tag>
            </HStack>
          </BodyShort>
        </VStack>
        <HStack gap="space-8" align="center">
          <CogIcon title="Automatisk vurdering" fontSize="1.5rem" />
          <BodyShort size="small" weight="semibold">
            Automatisk vurdert
          </BodyShort>
        </HStack>
      </VStack>
    </VilkårSplittPanel>
  );
};
