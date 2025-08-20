import {
  ung_kodeverk_vilkår_Utfall as VilkårPeriodeDtoVilkarStatus,
  type ung_sak_kontrakt_vilkår_VilkårMedPerioderDto as VilkårMedPerioderDto,
} from '@k9-sak-web/backend/ungsak/generated';
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
      <HStack gap="space-16">
        {vilkårErOppfylt ? (
          <CheckmarkCircleFillIcon
            title="Vilkåret er oppfylt"
            fontSize="1.75rem"
            style={{ color: 'var(--ax-bg-success-strong)' }}
          />
        ) : (
          <XMarkOctagonFillIcon
            title="Vilkåret er ikke oppfylt"
            fontSize="1.75rem"
            style={{ color: 'var(--ax-bg-danger-strong)' }}
          />
        )}
        <VStack gap="space-8">
          <HStack gap="space-16" align="baseline">
            <Heading size="small" level="2">
              Alder
            </Heading>
            {vilkår?.lovReferanse && (
              <Box.New>
                <Detail className={styles.lovreferanse}>
                  <Lovreferanse isUng>{vilkår.lovReferanse}</Lovreferanse>
                </Detail>
              </Box.New>
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
