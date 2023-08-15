import React from 'react';
import { FormattedMessage } from 'react-intl';

import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { KodeverkMedNavn, SaksbehandlereInfo } from '@k9-sak-web/types';
import { K9sakApiKeys } from '@k9-sak-web/sak-app/src/data/k9sakApi';
import useGlobalStateRestApiData from '@k9-sak-web/rest-api-hooks/src/global-data/useGlobalStateRestApiData';

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
  opprettetAv?: string;
}

/**
 * VilkarresultatMedBegrunnelse
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
  opprettetAv,
}: VilkarresultatMedBegrunnelseProps) => {
  const { saksbehandlere = {} } = useGlobalStateRestApiData<SaksbehandlereInfo>(K9sakApiKeys.HENT_SAKSBEHANDLERE) || {};
  return (
    <>
      {skalViseBegrunnelse && (
        <>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <AssessedBy name={saksbehandlere[opprettetAv] || opprettetAv} />
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
};

VilkarresultatMedBegrunnelse.defaultProps = {
  customVilkarIkkeOppfyltText: undefined,
  customVilkarOppfyltText: undefined,
  erVilkarOk: undefined,
  skalViseBegrunnelse: true,
};

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
