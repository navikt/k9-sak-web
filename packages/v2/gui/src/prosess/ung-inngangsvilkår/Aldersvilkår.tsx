import { VilkårPeriodeDtoVilkarStatus, type VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/generated';
import { formatPeriod } from '@k9-sak-web/lib/dateUtils/dateUtils.js';
import { CheckmarkCircleFillIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { BodyShort, Box, Detail, Heading, HStack, VStack } from '@navikt/ds-react';
import { Lovreferanse } from '../../shared/lovreferanse/Lovreferanse';
import styles from './ungInngangsvilkår.module.css';
import { VilkårComponent } from './VilkårComponent';

interface AldersvilkårProps {
  vilkår: VilkårMedPerioderDto;
}

export const Aldersvilkår = ({ vilkår }: AldersvilkårProps) => {
  const fomDatoAldersvilkår = vilkår.perioder?.[0]?.periode.fom;
  const tomDatoAldersvilkår = vilkår.perioder?.[vilkår.perioder?.length - 1]?.periode.tom;
  const vilkårErOppfylt = vilkår?.perioder?.every(p => p.vilkarStatus === VilkårPeriodeDtoVilkarStatus.OPPFYLT);

  return (
    <VilkårComponent>
      <HStack gap="4">
        {vilkårErOppfylt ? (
          <CheckmarkCircleFillIcon
            title="Vilkåret er oppfylt"
            fontSize="1.75rem"
            style={{ color: 'var(--a-surface-success)' }}
          />
        ) : (
          <XMarkOctagonFillIcon
            title="Vilkåret er ikke oppfylt"
            fontSize="1.75rem"
            style={{ color: 'var(--a-surface-danger)' }}
          />
        )}
        <VStack gap="2">
          <HStack gap="4">
            <Heading size="small" level="2">
              Alder
            </Heading>
            {vilkår?.lovReferanse && (
              <Box>
                <Detail className={styles.lovreferanse}>
                  <Lovreferanse>{vilkår.lovReferanse}</Lovreferanse>
                </Detail>
              </Box>
            )}
          </HStack>
          {fomDatoAldersvilkår && tomDatoAldersvilkår && (
            <BodyShort size="small">
              {`Vilkåret er ${vilkårErOppfylt ? 'oppfylt' : 'avslått'} ${formatPeriod(fomDatoAldersvilkår, tomDatoAldersvilkår)} `}
            </BodyShort>
          )}
        </VStack>
      </HStack>
    </VilkårComponent>
  );
};
