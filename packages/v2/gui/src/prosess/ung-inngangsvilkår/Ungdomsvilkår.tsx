import {
  VilkårPeriodeDtoVilkarStatus,
  VilkårResultatDtoAvslagsårsak,
  type VilkårMedPerioderDto,
} from '@k9-sak-web/backend/ungsak/generated';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { CheckmarkCircleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Heading, HStack, VStack } from '@navikt/ds-react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import styles from './ungInngangsvilkår.module.css';
import { VilkårComponent } from './VilkårComponent';

const VilkårHeadingSection = ({ lovreferanse }: { lovreferanse?: string }) => (
  <HStack gap="space-16" align="baseline">
    <Heading size="small" level="2">
      I ungdomsprogrammet
    </Heading>
    {lovreferanse && (
      <Box>
        <Detail className={styles.lovreferanse}>
          <Lovreferanse isUng>{lovreferanse}</Lovreferanse>
        </Detail>
      </Box>
    )}
  </HStack>
);

interface UngdomsvilkårProps {
  vilkår: VilkårMedPerioderDto;
}

export const Ungdomsvilkår = ({ vilkår }: UngdomsvilkårProps) => {
  const periodeMedEndretStartdato = vilkår?.perioder?.find(
    periode =>
      periode.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT &&
      periode.avslagKode === VilkårResultatDtoAvslagsårsak.ENDRET_STARTDATO_UNGDOMSPROGRAM,
  );
  const periodeMedOpphør = vilkår?.perioder?.find(
    periode =>
      periode.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT &&
      (periode.avslagKode === VilkårResultatDtoAvslagsårsak.UDEFINERT || periode.avslagKode == undefined),
  );
  const oppfyltPeriode = vilkår?.perioder?.find(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT);
  return (
    <VilkårComponent>
      <VStack gap="space-24">
        {periodeMedOpphør && (
          <HStack gap="space-16">
            <InformationSquareFillIcon
              title="Deltagelse er opphørt"
              fontSize="1.75rem"
              style={{ color: 'var(--a-lightblue-700)' }}
            />
            <VStack gap="space-8">
              <VilkårHeadingSection lovreferanse={vilkår?.lovReferanse} />
              <BodyShort size="small">{`Deltaker meldt ut ${formatDate(periodeMedOpphør.periode.tom)}`}</BodyShort>
            </VStack>
          </HStack>
        )}
        {periodeMedEndretStartdato && oppfyltPeriode && (
          <HStack gap="space-16">
            <InformationSquareFillIcon
              title="Startdato er endret"
              fontSize="1.75rem"
              style={{ color: 'var(--a-lightblue-700)' }}
            />
            <VStack gap="space-8">
              <VilkårHeadingSection lovreferanse={vilkår?.lovReferanse} />
              <BodyShort size="small">{`Startdato er endret fra ${formatDate(periodeMedEndretStartdato.periode.fom)} til ${formatDate(oppfyltPeriode?.periode.fom)}`}</BodyShort>
            </VStack>
          </HStack>
        )}
        {oppfyltPeriode && (
          <HStack gap="space-16">
            <CheckmarkCircleFillIcon
              title="Vilkåret er oppfylt"
              fontSize="1.75rem"
              style={{ color: 'var(--a-surface-success)' }}
            />
            <VStack gap="space-8">
              <VilkårHeadingSection lovreferanse={vilkår?.lovReferanse} />
              <BodyShort size="small">{`Deltaker meldt inn ${formatDate(periodeMedEndretStartdato?.periode.fom || oppfyltPeriode.periode.fom)}`}</BodyShort>
            </VStack>
          </HStack>
        )}
      </VStack>
    </VilkårComponent>
  );
};
