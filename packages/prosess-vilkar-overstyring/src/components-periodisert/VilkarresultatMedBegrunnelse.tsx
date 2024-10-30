import { FormattedMessage } from 'react-intl';

import { VerticalSpacer } from '@fpsak-frontend/shared-components';
import { VilkarResultPickerPeriodisertRHF } from '@k9-sak-web/prosess-felles';
import { Aksjonspunkt, Vilkarperiode } from '@k9-sak-web/types';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

import { FunctionComponent } from 'react';
import { VilkarresultatMedBegrunnelseState } from './FormState';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import { CustomVilkarText } from './VilkarresultatMedOverstyringFormPeriodisert';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  customVilkarIkkeOppfyltText?: CustomVilkarText;
  customVilkarOppfyltText?: CustomVilkarText;
  skalViseBegrunnelse?: boolean;
  periodeFom?: string;
  periodeTom?: string;
  valgtPeriodeFom?: string;
  valgtPeriodeTom?: string;
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
 * VIlkarresultatMedBegrunnelse
 *
 * Presentasjonskomponent. Viser resultat av vilkårskjøring når det ikke finnes tilknyttede aksjonspunkter.
 * Resultatet kan overstyres av Nav-ansatt med overstyr-rettighet.
 */
export const VilkarresultatMedBegrunnelse: FunctionComponent<VilkarresultatMedBegrunnelseProps> & StaticFunctions = ({
  erVilkarOk,
  periodeVilkarStatus,
  readOnly,
  erMedlemskapsPanel,
  visPeriodisering,
  skalViseBegrunnelse = true,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  periodeFom,
  periodeTom,
  valgtPeriodeFom,
  valgtPeriodeTom,
  opprettetAv,
}: VilkarresultatMedBegrunnelseProps) => {
  return (
    <>
      {skalViseBegrunnelse && (
        <>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <AssessedBy ident={opprettetAv} />
          <VerticalSpacer eightPx />
        </>
      )}
      <VilkarResultPickerPeriodisertRHF
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
};

VilkarresultatMedBegrunnelse.buildInitialValues = (
  avslagKode: string,
  aksjonspunkter: Aksjonspunkt[],
  status: string,
  periode: Vilkarperiode,
) => ({
  ...VilkarResultPickerPeriodisertRHF.buildInitialValues(avslagKode, aksjonspunkter, status, periode),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = (values: VilkarresultatMedBegrunnelseState) => ({
  begrunnelse: values.begrunnelse,
});

export default VilkarresultatMedBegrunnelse;
