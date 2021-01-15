import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';
import React from 'react';
import { CustomVilkarText } from './VilkarresultatMedOverstyringForm';
import VilkarBegrunnelse from './VilkarBegrunnelse';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  avslagsarsaker: KodeverkMedNavn[];
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
}

/**
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedBegrunnelse = ({
  erVilkarOk,
  readOnly,
  avslagsarsaker,
  erMedlemskapsPanel,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
}: VilkarresultatMedBegrunnelseProps) => (
  <>
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarIkkeOppfyltText={customVilkarIkkeOppfyltText}
      customVilkarOppfyltText={customVilkarOppfyltText}
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      erMedlemskapsPanel={erMedlemskapsPanel}
    />
    {skalViseBegrunnelse && (
      <>
        <VerticalSpacer eightPx />
        <VilkarBegrunnelse isReadOnly={readOnly} />
      </>
    )}
  </>
);

VilkarresultatMedBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

VilkarresultatMedBegrunnelse.buildInitialValues = (avslagKode, aksjonspunkter, status, overstyringApKode, periode) => {
  return {
    ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status),
    ...VilkarBegrunnelse.buildInitialValues(periode),
  };
};

VilkarresultatMedBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
