import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import {
  hent847Text,
  opptjeningMidlertidigInaktivKoder,
} from '@fpsak-frontend/prosess-vilkar-opptjening-oms/src/components/VilkarField';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';
import { CheckmarkCircleFillIcon, KeyHorizontalIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, HStack, Label } from '@navikt/ds-react';
import { SetStateAction } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styles from './vilkarresultatMedOverstyringForm.module.css';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (
  kanOverstyre: boolean,
  aksjonspunktCodes: string[],
  aksjonspunktCode: string,
  vurderesIBehandlingen: boolean,
) => (!isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre) || !vurderesIBehandlingen;

const vilkårResultatText = (originalErVilkarOk: boolean, periode: Vilkarperiode) => {
  let text = 'Ikke behandlet';
  if (originalErVilkarOk) {
    text = 'Vilkåret er oppfylt';
  }
  if (originalErVilkarOk === false) {
    text = 'Vilkåret er avslått';
  }
  if (Object.values(opptjeningMidlertidigInaktivKoder).includes(periode?.merknad?.kode)) {
    text = hent847Text(periode.merknad.kode);
  }
  return (
    <Label size="small" as="p">
      {text}
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
  periode: Vilkarperiode;
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
}: Partial<VilkarresultatMedOverstyringHeaderProps>) => {
  const intl = useIntl();
  const aksjonspunktCodes = aksjonspunkter.map(a => a.definisjon.kode);
  const status = periode?.vilkarStatus?.kode;
  const erOppfylt = vilkarUtfallType.OPPFYLT === status;
  const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== status ? erOppfylt : undefined;
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  const panelTittelKodeExists = panelTittelKode && !!intl.messages[panelTittelKode];

  return (
    <>
      <FlexContainer>
        <HStack gap="4">
          {!erOverstyrt && erVilkarOk !== undefined && (
            <>
              {erVilkarOk ? (
                <CheckmarkCircleFillIcon fontSize={24} style={{ color: 'var(--a-surface-success)' }} />
              ) : (
                <XMarkOctagonFillIcon fontSize={24} style={{ color: 'var(--a-surface-danger)' }} />
              )}
            </>
          )}
          <Heading size="small" level="2">
            {panelTittelKodeExists ? <FormattedMessage id={panelTittelKode} /> : panelTittelKode}
          </Heading>
          {lovReferanse && (
            <Detail className={styles.vilkar}>
              <Lovreferanse>{lovReferanse}</Lovreferanse>
            </Detail>
          )}
        </HStack>
        <FlexRow>
          <FlexColumn>
            <VerticalSpacer eightPx />
            {vilkårResultatText(erVilkarOk, periode)}
          </FlexColumn>
          {erVilkarOk !== undefined &&
            !isHidden(
              kanOverstyreAccess.isEnabled,
              aksjonspunktCodes,
              overstyringApKode,
              periode.vurderesIBehandlingen,
            ) && (
              <FlexColumn>
                <VerticalSpacer fourPx />
                <Button
                  variant="tertiary"
                  size="xsmall"
                  onClick={togglePa}
                  icon={<KeyHorizontalIcon className="-rotate-45 text-3xl" />}
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
