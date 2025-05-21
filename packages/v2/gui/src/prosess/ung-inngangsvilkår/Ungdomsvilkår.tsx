import { VilkårPeriodeDtoVilkarStatus, type VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated';
import { formatDate } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { CheckmarkCircleFillIcon, InformationSquareFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Heading, HStack, VStack } from '@navikt/ds-react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import styles from './ungInngangsvilkår.module.css';
import { VilkårComponent } from './VilkårComponent';

interface UngdomsvilkårProps {
  vilkår: VilkårMedPerioderDto;
}

export const Ungdomsvilkår = ({ vilkår }: UngdomsvilkårProps) => {
  const oppstartsperiode = vilkår?.perioder?.find(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT);
  const opphørsperiode = vilkår?.perioder?.find(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.IKKE_OPPFYLT);
  const oppstartsdato = oppstartsperiode?.periode.fom;
  const opphørsdato = opphørsperiode?.periode.tom;
  return (
    <VilkårComponent>
      <VStack gap="6">
        {opphørsperiode && (
          <HStack gap="4">
            <InformationSquareFillIcon
              title="Deltagelse er opphørt"
              fontSize="1.75rem"
              style={{ color: 'var(--a-lightblue-700)' }}
            />
            <VStack gap="2">
              <HStack gap="4" align="baseline">
                <Heading size="small" level="2">
                  I ungdomsprogrammet
                </Heading>
                {vilkår?.lovReferanse && (
                  <Box>
                    <Detail className={styles.lovreferanse}>
                      <Lovreferanse>{vilkår.lovReferanse}</Lovreferanse>
                    </Detail>
                  </Box>
                )}
              </HStack>
              {opphørsdato && <BodyShort size="small">{`Deltaker meldt ut ${formatDate(opphørsdato)}`}</BodyShort>}
            </VStack>
          </HStack>
        )}
        {oppstartsperiode && (
          <HStack gap="4">
            <CheckmarkCircleFillIcon
              title="Vilkåret er oppfylt"
              fontSize="1.75rem"
              style={{ color: 'var(--a-surface-success)' }}
            />
            <VStack gap="2">
              <HStack gap="4" align="baseline">
                <Heading size="small" level="2">
                  I ungdomsprogrammet
                </Heading>
                {vilkår?.lovReferanse && (
                  <Box>
                    <Detail className={styles.lovreferanse}>
                      <Lovreferanse>{vilkår.lovReferanse}</Lovreferanse>
                    </Detail>
                  </Box>
                )}
              </HStack>
              {oppstartsdato && <BodyShort size="small">{`Deltaker meldt inn ${formatDate(oppstartsdato)}`}</BodyShort>}
            </VStack>
          </HStack>
        )}
      </VStack>
    </VilkårComponent>
  );
};
