import { VilkårMedPerioderDtoVilkarType, type VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated';
import { Box, Heading, VStack } from '@navikt/ds-react';
import { Aldersvilkår } from './Aldersvilkår';
import { Ungdomsvilkår } from './Ungdomsvilkår';

interface UngInngangsvilkårProps {
  vilkar: VilkårMedPerioderDto[];
}

export const UngInngangsvilkår = (props: UngInngangsvilkårProps) => {
  const { vilkar: vilkår } = props;
  const aldersvilkår = vilkår.find(v => v.vilkarType === VilkårMedPerioderDtoVilkarType.ALDERSVILKÅR);
  const ungdomsprogramvilkår = vilkår.find(v => v.vilkarType === VilkårMedPerioderDtoVilkarType.UNGDOMSPROGRAMVILKÅRET);

  return (
    <Box.New marginBlock="2 8" marginInline="4 0">
      <VStack gap="space-16">
        <Heading size="medium" level="1">
          Inngangsvilkår
        </Heading>
        <VStack gap="space-20">
          {aldersvilkår && <Aldersvilkår vilkår={aldersvilkår} />}
          {ungdomsprogramvilkår && <Ungdomsvilkår vilkår={ungdomsprogramvilkår} />}
        </VStack>
      </VStack>
    </Box.New>
  );
};
