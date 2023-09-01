import avslattImage from '@fpsak-frontend/assets/images/avslaatt_hover.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/innvilget_hover.svg';
import keyUtgraetImage from '@fpsak-frontend/assets/images/key-1-rotert-utgraet.svg';
import keyImage from '@fpsak-frontend/assets/images/key-1-rotert.svg';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt } from '@k9-sak-web/types';
import { Element, Undertekst, Undertittel } from 'nav-frontend-typografi';
import React, { SetStateAction } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styles from './vilkarresultatMedOverstyringForm.css';

const isOverridden = (aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  aksjonspunktCodes.some(code => code === aksjonspunktCode);
const isHidden = (kanOverstyre: boolean, aksjonspunktCodes: string[], aksjonspunktCode: string) =>
  !isOverridden(aksjonspunktCodes, aksjonspunktCode) && !kanOverstyre;

const getVilkarOkMessage = originalErVilkarOk => {
  let messageId = 'VilkarresultatMedOverstyringForm.IkkeBehandlet';
  if (originalErVilkarOk) {
    messageId = 'VilkarresultatMedOverstyringForm.ErOppfylt';
  } else if (originalErVilkarOk === false) {
    messageId = 'VilkarresultatMedOverstyringForm.ErIkkeOppfylt';
  }

  return (
    <Element>
      <FormattedMessage id={messageId} />
    </Element>
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
  originalErVilkarOk?: boolean;
  overrideReadOnly: boolean;
  overstyringApKode: string;
  panelTittelKode: string;
  toggleOverstyring: (overstyrtPanel: SetStateAction<string[]>) => void;
}

const VilkarresultatMedOverstyringHeader = ({
  panelTittelKode,
  erOverstyrt,
  overstyringApKode,
  lovReferanse,
  originalErVilkarOk,
  overrideReadOnly,
  kanOverstyreAccess,
  aksjonspunktCodes,
  toggleOverstyring,
}: Partial<VilkarresultatMedOverstyringHeaderProps>) => {
  const togglePa = () => {
    toggleOverstyring(oldArray => [...oldArray, overstyringApKode]);
  };
  return (
    <>
      <FlexContainer>
        <FlexRow>
          {!erOverstyrt && originalErVilkarOk !== undefined && (
            <FlexColumn>
              <Image className={styles.status} src={originalErVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
          )}
          <FlexColumn>
            <Undertittel>
              <FormattedMessage id={panelTittelKode} />
            </Undertittel>
          </FlexColumn>
          {lovReferanse && (
            <FlexColumn>
              <Undertekst className={styles.vilkar}>{lovReferanse}</Undertekst>
            </FlexColumn>
          )}
        </FlexRow>
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
                    <Image className={styles.key} src={keyImage} onClick={togglePa} />
                  </FlexColumn>
                )}
                {(erOverstyrt || overrideReadOnly) && (
                  <FlexColumn>
                    <VerticalSpacer eightPx />
                    <Image className={styles.keyWithoutCursor} src={keyUtgraetImage} />
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

const mapStateToPropsFactory = (_initialState, initialOwnProps: VilkarresultatMedOverstyringHeaderProps) => {
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

export default connect(mapStateToPropsFactory)(VilkarresultatMedOverstyringHeader);
