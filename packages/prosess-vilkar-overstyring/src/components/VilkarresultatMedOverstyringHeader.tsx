import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Button, Detail, Heading, Label } from '@navikt/ds-react';
import React, { SetStateAction } from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './vilkarresultatMedOverstyringForm.module.css';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const getVilkarOkMessage = (originalErVilkarOk: boolean) => {
  let messageId = 'Ikke behandlet';
  if (originalErVilkarOk) {
    messageId = 'Vilkåret er oppfylt';
  } else if (originalErVilkarOk === false) {
    messageId = 'Vilkåret er avslått';
  }

  return (
    <Label size="small" as="p">
      {messageId}
    </Label>
  );
};

interface VilkarresultatMedOverstyringHeaderProps {
  aksjonspunktCodes: string[];
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrt?: boolean;
  kanOverstyreAccess?: {
    isEnabled: boolean;
  };
  lovReferanse?: string;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
  status: string;
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
  status,
}: Partial<VilkarresultatMedOverstyringHeaderProps>) => {
  const aksjonspunktCodes = aksjonspunkter.map(a => a.definisjon);
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <>
      <FlexContainer>
        <FlexRow>
          {!erOverstyrt && erVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Heading size="small" level="2">
              <FormattedMessage id={panelTittelKode} />
            </Heading>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <Detail className={styles.vilkar}>
                <Lovreferanse>{lovReferanse}</Lovreferanse>
              </Detail>
            </FlexColumn>
          )}
        </FlexRow>
        <FlexRow>
          <FlexColumn>
            <VerticalSpacer eightPx />
            {getVilkarOkMessage(erVilkarOk)}
          </FlexColumn>
          {erVilkarOk !== undefined &&
            !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
              <FlexColumn>
                <VerticalSpacer fourPx />
                <Button
                  variant="tertiary"
                  size="xsmall"
                  onClick={togglePa}
                  icon={<Image className={styles.key} src={keyImage} aria-label="Overstyring" />}
                  disabled={erOverstyrt || overrideReadOnly}
                />
              </FlexColumn>
            )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
    </>
  );
};

export default VilkarresultatMedOverstyringHeader;
