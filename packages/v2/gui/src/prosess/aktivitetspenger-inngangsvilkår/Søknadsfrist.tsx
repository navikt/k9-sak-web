import { Utfall } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/Utfall.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { CogIcon } from '@navikt/aksel-icons';
import { BodyShort, HStack, Label, VStack } from '@navikt/ds-react';
import { useState } from 'react';
import { getPeriodStatus, VilkårSplittPanel, type VilkårSplittPanelPeriod } from './VilkårSplittPanel';

interface Props {
  søknadsfristVilkår: VilkårMedPerioderDto;
}

const getVilkårUtfall = (vilkårStatus: Utfall) => {
  if (vilkårStatus === Utfall.OPPFYLT) return 'Vilkåret er oppfylt';
  return 'Vilkåret er ikke oppfylt';
};

export const Søknadsfrist = ({ søknadsfristVilkår }: Props) => {
  const periods: VilkårSplittPanelPeriod[] = (søknadsfristVilkår?.perioder ?? []).map(p => ({
    id: p.periode.fom,
    status: getPeriodStatus(p.vilkarStatus),
    label: `${formatDate(p.periode.fom)}`,
    periode: p.periode,
  }));
  const [selectedId, setSelectedId] = useState(periods[0]?.id ?? '');

  if (!søknadsfristVilkår) {
    return null;
  }
  const selectedVilkårPeriode = søknadsfristVilkår.perioder?.find(p => p.periode.fom === selectedId);

  return (
    <VilkårSplittPanel
      periods={periods}
      selectedItemId={selectedId}
      onItemSelect={setSelectedId}
      detailHeading="Vurdering av søknadsfrist"
      lovreferanse={søknadsfristVilkår.lovReferanse}
    >
      <VStack gap="space-24">
        <VStack gap="space-8">
          <Label size="small" as="p">
            Søknad innsendt
          </Label>
          <BodyShort size="small">{selectedVilkårPeriode && formatDate(selectedVilkårPeriode.periode.fom)}</BodyShort>
        </VStack>
        <VStack gap="space-8">
          <Label size="small" as="p">
            Er vilkår om søknadsfrist oppfylt?
          </Label>
          <BodyShort size="small">
            {selectedVilkårPeriode && getVilkårUtfall(selectedVilkårPeriode.vilkarStatus)}
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
