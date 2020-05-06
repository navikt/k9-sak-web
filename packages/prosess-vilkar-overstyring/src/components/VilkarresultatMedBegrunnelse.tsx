import { VilkarBegrunnelse, VilkarResultPicker } from '@fpsak-frontend/fp-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Kodeverk } from '@k9-sak-web/types';
import React from 'react';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  hasAksjonspunkt: boolean;
  avslagsarsaker: Kodeverk[];
  customVilkarIkkeOppfyltText?: {
    id: string;
    values?: any;
  };
  customVilkarOppfyltText?: {
    id: string;
    values?: any;
  };
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
  hasAksjonspunkt,
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
      hasAksjonspunkt={hasAksjonspunkt}
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

VilkarresultatMedBegrunnelse.buildInitialValues = (behandlingsresultat, aksjonspunkter, status, overstyringApKode) => {
  const aksjonspunkt = aksjonspunkter.find(ap => ap.definisjon.kode === overstyringApKode);
  return {
    ...VilkarResultPicker.buildInitialValues(behandlingsresultat, aksjonspunkter, status),
    ...VilkarBegrunnelse.buildInitialValues(aksjonspunkt),
  };
};

VilkarresultatMedBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
