import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import VilkarBegrunnelse from './VilkarBegrunnelse';
import { CustomVilkarText } from './VilkarresultatMedOverstyringForm';

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
  skalViseBegrunnelse = true,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
}: VilkarresultatMedBegrunnelseProps) => (
  <>
    {skalViseBegrunnelse && (
      <>
        <VilkarBegrunnelse isReadOnly={readOnly} />
        <VerticalSpacer eightPx />
      </>
    )}
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarOppfyltText={
        <FormattedMessage
          id={customVilkarOppfyltText ? customVilkarOppfyltText.id : 'VilkarresultatMedOverstyringForm.ErOppfylt'}
          values={
            customVilkarOppfyltText
              ? {
                  b: chunks => <b>{chunks}</b>,
                  ...customVilkarIkkeOppfyltText.values,
                }
              : { b: chunks => <b>{chunks}</b> }
          }
        />
      }
      customVilkarIkkeOppfyltText={
        <FormattedMessage
          id={
            customVilkarIkkeOppfyltText
              ? customVilkarOppfyltText.id
              : 'VilkarresultatMedOverstyringForm.VilkarIkkeOppfylt'
          }
          values={
            customVilkarIkkeOppfyltText
              ? {
                  b: chunks => <b>{chunks}</b>,
                  ...customVilkarIkkeOppfyltText.values,
                }
              : { b: chunks => <b>{chunks}</b> }
          }
        />
      }
      erVilkarOk={erVilkarOk}
      readOnly={readOnly}
      erMedlemskapsPanel={erMedlemskapsPanel}
    />
  </>
);

VilkarresultatMedBegrunnelse.buildInitialValues = (avslagKode, aksjonspunkter, status, overstyringApKode, periode) => ({
  ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
