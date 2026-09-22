import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import type { VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/vilkår/VilkårPeriodeDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { CircleIkkeOppfyltIkon } from '@k9-sak-web/gui/shared/icons/CircleIkkeOppfyltIkon.js';
import { CircleOppfyltIkon } from '@k9-sak-web/gui/shared/icons/CircleOppfyltIkon.js';
import { formatDate } from '@k9-sak-web/gui/utils/formatters.js';
import { Box, Detail, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { SideMenu } from '@navikt/ft-plattform-komponenter';
import { useState } from 'react';
import styles from './MedisinskVilkarProsessIndex.module.css';

// Periode fra vilkåret, utvidet med informasjon om pleietrengende er over 18 år
interface MedisinskVilkarPeriode extends VilkårPeriodeDto {
  pleietrengendeErOver18år?: boolean;
}

interface MedisinskVilkarProsessIndexProps {
  perioder: MedisinskVilkarPeriode[];
  panelTittel: string;
  lovReferanse?: string;
}

const vilkårStatusTekst = (erVilkarOk?: boolean) => {
  if (erVilkarOk === true) {
    return 'Vilkåret er oppfylt';
  }
  if (erVilkarOk === false) {
    return 'Vilkåret er avslått';
  }
  return 'Ikke behandlet';
};

// Opplæringspenger og livets sluttfase har egne lovreferanser som skal brukes direkte
const utledLovReferanseTekst = (pleietrengendeErOver18år?: boolean, lovReferanse?: string) => {
  if (lovReferanse) {
    return lovReferanse;
  }
  if (pleietrengendeErOver18år) {
    return '§ 9-10 tredje ledd (over 18 år)';
  }
  return '§ 9-10 første og andre ledd, og 9-16 første ledd';
};

const getVilkarStatusIkon = (erVilkarOk?: boolean) => {
  if (erVilkarOk === true) {
    return <CircleOppfyltIkon />;
  }
  if (erVilkarOk === false) {
    return <CircleIkkeOppfyltIkon />;
  }
  return null;
};

const erPeriodeOppfylt = (periode?: MedisinskVilkarPeriode) => {
  const status = periode?.vilkarStatus ?? vilkårStatus.IKKE_VURDERT;
  return status === vilkårStatus.IKKE_VURDERT ? undefined : status === vilkårStatus.OPPFYLT;
};

const MedisinskVilkarProsessIndex = ({ perioder, panelTittel, lovReferanse }: MedisinskVilkarProsessIndexProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (perioder.length === 0) {
    return null;
  }

  const skalBrukeSidemeny = perioder.length > 1;
  const activePeriode = skalBrukeSidemeny ? perioder[activeTab] : perioder[0];
  const erVilkarOk = erPeriodeOppfylt(activePeriode);

  const lovReferanseTekst = utledLovReferanseTekst(activePeriode?.pleietrengendeErOver18år, lovReferanse);

  return (
    <HStack className={skalBrukeSidemeny ? styles.harSidemeny : undefined}>
      {skalBrukeSidemeny && (
        <Box flexShrink="0" marginInline="space-0 space-32">
          <SideMenu
            links={perioder.map((periode, index) => ({
              active: activeTab === index,
              label: `${formatDate(periode.periode.fom)} - ${formatDate(periode.periode.tom)}`,
              icon: getVilkarStatusIkon(erPeriodeOppfylt(periode)),
            }))}
            onClick={setActiveTab}
            heading="Perioder"
          />
        </Box>
      )}
      <VStack gap="space-8" flexGrow="1">
        <HStack gap="space-16" align="center">
          {getVilkarStatusIkon(erVilkarOk)}
          <Heading size="small" level="2">
            {panelTittel}
          </Heading>
          <Detail className={styles.vilkar}>
            <Lovreferanse>{lovReferanseTekst}</Lovreferanse>
          </Detail>
        </HStack>
        <Label size="small">{vilkårStatusTekst(erVilkarOk)}</Label>
      </VStack>
    </HStack>
  );
};

export default MedisinskVilkarProsessIndex;
