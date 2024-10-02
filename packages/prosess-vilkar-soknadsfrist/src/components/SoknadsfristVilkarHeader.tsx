import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { CheckmarkCircleFillIcon, KeyHorizontalIcon, XMarkOctagonFillIcon } from '@navikt/aksel-icons';
import { Button, Detail, Heading, HStack, Label } from '@navikt/ds-react';
import { SetStateAction } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styles from './SoknadsfristVilkarForm.module.css';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const getVilkarOkMessage = originalErVilkarOk => {
  let messageId = 'SoknadsfristVilkarForm.IkkeBehandlet';
  if (originalErVilkarOk) {
    messageId = 'SoknadsfristVilkarForm.ErOppfylt';
  } else if (originalErVilkarOk === false) {
    messageId = 'SoknadsfristVilkarForm.ErIkkeOppfylt';
  }

  return (
    <Label size="small" as="p">
      <FormattedMessage id={messageId} />
    </Label>
  );
};

interface SoknadsfristVilkarHeaderProps {
  aksjonspunktCodes: string[];
  aksjonspunkter: Aksjonspunkt[];
  erOverstyrt?: boolean;
  kanOverstyreAccess?: {
    isEnabled: boolean;
  };
  lovReferanse?: string;
  originalErVilkarOk?: boolean;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
}

const SoknadsfristVilkarHeader = ({
  panelTittelKode,
  erOverstyrt,
  overstyringApKode,
  lovReferanse,
  originalErVilkarOk,
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunktCodes,
  toggleOverstyring,
}: Partial<SoknadsfristVilkarHeaderProps>) => {
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <>
      <FlexContainer>
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
            <FormattedMessage id={panelTittelKode} />
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
            {getVilkarOkMessage(originalErVilkarOk)}
          </FlexColumn>
          {originalErVilkarOk !== undefined &&
            !isHidden(kanOverstyreAccess.isEnabled, aksjonspunktCodes, overstyringApKode) && (
              <>
                {!erOverstyrt && !overrideReadOnly && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Button
                      size="small"
                      type="button"
                      variant="tertiary"
                      icon={<KeyHorizontalIcon className="-rotate-45 text-3xl" />}
                      onClick={togglePa}
                      aria-label="Overstyring av søknadsfristvilkåret"
                    />
                  </FlexColumn>
                )}
                {(erOverstyrt || overrideReadOnly) && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <KeyHorizontalIcon className="-rotate-45 text-3xl text-[#b7b1a9] -mt-1" />
                  </FlexColumn>
                )}
              </>
            )}
        </FlexRow>
      </FlexContainer>
      <VerticalSpacer eightPx />
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: SoknadsfristVilkarHeaderProps) => {
  const aksjonspunktCodes = initialOwnProps.aksjonspunkter.map(a => a.definisjon.kode);

  return (state, ownProps) => {
    const erOppfylt = vilkarUtfallType.OPPFYLT === ownProps.status;
    const erVilkarOk = vilkarUtfallType.IKKE_VURDERT !== ownProps.status ? erOppfylt : undefined;

    return {
      aksjonspunktCodes,
      originalErVilkarOk: erVilkarOk,
    };
  };
};

export default connect(mapStateToPropsFactory)(SoknadsfristVilkarHeader);
