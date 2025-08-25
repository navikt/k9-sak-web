import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import type { AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { CheckmarkCircleFillIcon, KeyHorizontalIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Box, Button, Detail, Heading, HStack, Label, VStack } from '@navikt/ds-react';
import { type SetStateAction } from 'react';
import styles from '../components-periodisert/vilkarresultatMedOverstyringFormPeriodisert.module.css';

const opptjeningMidlertidigInaktivKoder = {
  TYPE_A: '7847A',
  TYPE_A_NEW: 'VM_7847_A',
  TYPE_B: '7847B',
  TYPE_B_NEW: 'VM_7847_B',
};

const hent847Text = (kode: string) => {
  const kodeTekster: { [key: string]: string } = {
    [opptjeningMidlertidigInaktivKoder.TYPE_A]: 'Vilkåret beregnes jf § 8-47 bokstav A',
    [opptjeningMidlertidigInaktivKoder.TYPE_A_NEW]: 'Vilkåret beregnes jf § 8-47 bokstav A',
    [opptjeningMidlertidigInaktivKoder.TYPE_B]: 'Vilkåret beregnes jf § 8-47 bokstav B',
    [opptjeningMidlertidigInaktivKoder.TYPE_B_NEW]: 'Vilkåret beregnes jf § 8-47 bokstav B',
  };

  return kodeTekster[kode] || '';
};

const isOverridden = (aksjonspunktCodes: AksjonspunktCodes[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (
  kanOverstyre: boolean,
  aksjonspunktCodes: AksjonspunktCodes[],
  aksjonspunktCode: string,
  vurderesIBehandlingen: boolean,
) => (!isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre) || !vurderesIBehandlingen;

const vilkårResultatText = (originalErVilkarOk?: boolean, periode?: VilkårPeriodeDto) => {
  let text = 'Ikke behandlet';
  if (originalErVilkarOk) {
    text = 'Vilkåret er oppfylt';
  }
  if (originalErVilkarOk === false) {
    text = 'Vilkåret er avslått';
  }
  if (periode?.merknad && Object.values(opptjeningMidlertidigInaktivKoder).includes(periode?.merknad)) {
    text = hent847Text(periode.merknad);
  }
  return (
    <Label size="small" as="p">
      {text}
    </Label>
  );
};

interface VilkarresultatMedOverstyringHeaderProps {
  aksjonspunkter: AksjonspunktDto[];
  erOverstyrt?: boolean;
  kanOverstyreAccess?: {
    isEnabled: boolean;
  };
  lovReferanse?: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  periode?: VilkårPeriodeDto;
}

const VilkarresultatMedOverstyringHeader = ({
  panelTittelKode,
  erOverstyrt,
  overstyringApKode,
  lovReferanse,
  overrideReadOnly,
  kanOverstyreAccess,
  toggleOverstyring,
  aksjonspunkter,
  periode,
}: VilkarresultatMedOverstyringHeaderProps) => {
  const aksjonspunktCodes = aksjonspunkter
    .filter((a): a is { definisjon: AksjonspunktCodes } => a.definisjon !== undefined)
    .map(a => a.definisjon);
  const status = periode?.vilkarStatus;
  const erOppfylt = vilkårStatus.OPPFYLT === status;
  const erVilkarOk = vilkårStatus.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <Box.New marginBlock={'0 2'}>
      <VStack gap="space-8">
        <HStack gap="space-16">
          {!erOverstyrt && erVilkarOk !== undefined && (
            <>
              {erVilkarOk ? (
                <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--ax-bg-success-strong)' }} />
              ) : (
                <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--ax-bg-danger-strong)' }} />
              )}
            </>
          )}
          <Heading size="small" level="2">
            {panelTittelKode}
          </Heading>
          {lovReferanse && (
            <Detail className={styles.vilkar}>
              <Lovreferanse>{lovReferanse}</Lovreferanse>
            </Detail>
          )}
        </HStack>
        <HStack gap="space-16">
          <Box.New marginBlock={'2 0'}>{vilkårResultatText(erVilkarOk, periode)}</Box.New>
          {erVilkarOk !== undefined &&
            !isHidden(
              !!kanOverstyreAccess?.isEnabled,
              aksjonspunktCodes,
              overstyringApKode,
              !!periode?.vurderesIBehandlingen,
            ) && (
              <Box.New marginBlock={'1 0'}>
                <Button
                  variant="tertiary"
                  size="xsmall"
                  onClick={togglePa}
                  icon={<KeyHorizontalIcon className="-rotate-45 text-3xl" />}
                  disabled={erOverstyrt || overrideReadOnly}
                />
              </Box.New>
            )}
        </HStack>
      </VStack>
    </Box.New>
  );
};

export default VilkarresultatMedOverstyringHeader;
