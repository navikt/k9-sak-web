import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { CheckmarkCircleFillIcon, KeyHorizontalIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, HStack, Label } from '@navikt/ds-react';
import { AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { SetStateAction } from 'react';
import styles from './SoknadsfristVilkarForm.module.css';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const VilkarOkMessage = ({ originalErVilkarOk }: { originalErVilkarOk: boolean }) => {
  let message = 'Ikke behandlet';
  if (originalErVilkarOk) {
    message = 'Vilkåret er oppfylt for hele perioden';
  } else if (originalErVilkarOk === false) {
    message = 'Vilkåret er avslått';
  }

  return (
    <Label size="small" as="p">
      {message}
    </Label>
  );
};

interface SoknadsfristVilkarHeaderProps {
  aksjonspunkter: AksjonspunktDto[];
  erOverstyrt?: boolean;
  kanOverstyreAccess?: {
    employeeHasAccess: boolean;
    isEnabled: boolean;
  };
  lovReferanse?: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  status: string;
}

const SoknadsfristVilkarHeader = ({
  panelTittelKode,
  erOverstyrt,
  overstyringApKode,
  lovReferanse,
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunkter,
  status,
  toggleOverstyring,
}: Partial<SoknadsfristVilkarHeaderProps>) => {
  const aksjonspunktCodes = aksjonspunkter.map(a => a.definisjon);
  const erOppfylt = vilkårStatus.OPPFYLT === status;
  const originalErVilkarOk = vilkårStatus.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <>
      <>
        <HStack gap="4">
          {!erOverstyrt && originalErVilkarOk !== undefined && (
            <>
              {originalErVilkarOk ? (
                <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
              ) : (
                <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
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
        <div className="flex">
          <div className="px-2">
            <div className="mt-2" />
            <VilkarOkMessage originalErVilkarOk={originalErVilkarOk} />
          </div>
          {originalErVilkarOk !== undefined &&
            kanOverstyreAccess.employeeHasAccess &&
            !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
              <>
                {!erOverstyrt && !overrideReadOnly && (
                  <div className="px-2">
                    <Button
                      size="small"
                      type="button"
                      variant="tertiary"
                      icon={<KeyHorizontalIcon className="-rotate-45 text-3xl" />}
                      onClick={togglePa}
                      aria-label="Overstyring av søknadsfristvilkåret"
                    />
                  </div>
                )}
                {(erOverstyrt || overrideReadOnly) && (
                  <div className="px-2">
                    <div className="mt-1" />
                    <KeyHorizontalIcon className="-rotate-45 text-3xl text-[#b7b1a9]" />
                  </div>
                )}
              </>
            )}
        </div>
      </>
      <div className="mt-2" />
    </>
  );
};

export default SoknadsfristVilkarHeader;
