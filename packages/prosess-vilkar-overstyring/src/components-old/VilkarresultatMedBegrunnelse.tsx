import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { CustomVilkarText } from './VilkarresultatMedOverstyringForm';
import VilkarBegrunnelse from './VilkarBegrunnelse';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  avslagsarsaker: KodeverkMedNavn[];
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
  periodeFom?: string;
  periodeTom?: string;
  valgtPeriodeFom?: string;
  valgtPeriodeTom?: string;
}

/**
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedBegrunnelse = ({
  erVilkarOk,
  periodeVilkarStatus,
  readOnly,
  avslagsarsaker,
  erMedlemskapsPanel,
  visPeriodisering,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  periodeFom,
  periodeTom,
  valgtPeriodeFom,
  valgtPeriodeTom,
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
      visPeriodisering={visPeriodisering}
      periodeFom={periodeFom}
      periodeTom={periodeTom}
      valgtPeriodeFom={valgtPeriodeFom}
      valgtPeriodeTom={valgtPeriodeTom}
      periodeVilkarStatus={periodeVilkarStatus}
    />
  </>
);

VilkarresultatMedBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

VilkarresultatMedBegrunnelse.buildInitialValues = (avslagKode, aksjonspunkter, status, overstyringApKode, periode) => ({
  ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status, periode),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
