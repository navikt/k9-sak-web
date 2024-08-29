import { FormattedMessage } from 'react-intl';

import { VerticalSpacer, useSaksbehandlerOppslag } from '@fpsak-frontend/shared-components';
import { VilkarResultPickerRHF } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

import { FunctionComponent } from 'react';
import { VilkarresultatMedBegrunnelseState } from './FormState';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import { CustomVilkarText } from './VilkarresultatMedOverstyringForm';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
  opprettetAv?: string;
}

interface StaticFunctions {
  transformValues: (values: VilkarresultatMedBegrunnelseState) => { begrunnelse: string };
  buildInitialValues: (
    avslagKode: string,
    aksjonspunkter: Aksjonspunkt[],
    status: string,
    periode: Vilkarperiode,
  ) => VilkarresultatMedBegrunnelseState;
}

/**
 * VilkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedBegrunnelse: FunctionComponent<VilkarresultatMedBegrunnelseProps> & StaticFunctions = ({
  erVilkarOk,
  readOnly,
  erMedlemskapsPanel,
  skalViseBegrunnelse = true,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  opprettetAv,
}) => {
  const { hentSaksbehandlerNavn } = useSaksbehandlerOppslag();
  return (
    <>
      {skalViseBegrunnelse && (
        <>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <AssessedBy name={hentSaksbehandlerNavn(opprettetAv)} />
          <VerticalSpacer eightPx />
        </>
      )}
      <VilkarResultPickerRHF
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

VilkarresultatMedBegrunnelse.buildInitialValues = (
  avslagKode: string,
  aksjonspunkter: Aksjonspunkt[],
  status: string,
  periode: Vilkarperiode,
) => ({
  ...VilkarResultPickerRHF.buildInitialValues(avslagKode, aksjonspunkter, status),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = (values: VilkarresultatMedBegrunnelseState) => ({
  begrunnelse: values.begrunnelse,
});

export default VilkarresultatMedBegrunnelse;
