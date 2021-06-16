import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn } from '@k9-sak-web/types';

import { CustomVilkarText, DokumentStatus } from './SoknadsfristVilkarForm';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import VilkarDokument from './VilkarDokument';

interface SoknadsfristVilkarBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  avslagsarsaker: KodeverkMedNavn[];
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
  dokument?: DokumentStatus[];
}

/**
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const SoknadsfristVilkarBegrunnelse = ({
  erVilkarOk,
  readOnly,
  avslagsarsaker,
  erMedlemskapsPanel,
  skalViseBegrunnelse,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  dokument,
}: SoknadsfristVilkarBegrunnelseProps) => (
  <>
    <VilkarDokument isReadOnly={readOnly} dokument={dokument} />
    {skalViseBegrunnelse && (
      <>
        <VerticalSpacer eightPx />
        <VilkarBegrunnelse isReadOnly={readOnly} />
      </>
    )}
    <VilkarResultPicker
      avslagsarsaker={avslagsarsaker}
      customVilkarOppfyltText={
        <FormattedMessage
          id={customVilkarOppfyltText ? customVilkarOppfyltText.id : 'SoknadsfristVilkarForm.ErOppfylt'}
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
          id={customVilkarIkkeOppfyltText ? customVilkarOppfyltText.id : 'SoknadsfristVilkarForm.VilkarIkkeOppfylt'}
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

SoknadsfristVilkarBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

SoknadsfristVilkarBegrunnelse.buildInitialValues = (
  avslagKode,
  aksjonspunkter,
  status,
  overstyringApKode,
  periode,
  dokument,
) => ({
  ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status),
  ...VilkarBegrunnelse.buildInitialValues(periode),
  ...VilkarDokument.buildInitialValues(dokument),
});

SoknadsfristVilkarBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
  dokument: values.dokument,
});

SoknadsfristVilkarBegrunnelse.validate = (
  values: { erVilkarOk: boolean; avslagCode: string } = { erVilkarOk: false, avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default SoknadsfristVilkarBegrunnelse;
