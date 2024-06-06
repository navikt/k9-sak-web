import React from 'react';
import { FormattedMessage } from 'react-intl';

import { VerticalSpacer, useSaksbehandlerOppslag } from '@fpsak-frontend/shared-components';
import { VilkarResultPickerPeriodisert as VilkarResultPicker } from '@k9-sak-web/prosess-felles';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';

import { CustomVilkarText } from './VilkarresultatMedOverstyringForm';
import VilkarBegrunnelse from './VilkarBegrunnelse';

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
      <VilkarResultPicker
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

VilkarresultatMedBegrunnelse.buildInitialValues = (avslagKode, aksjonspunkter, status, overstyringApKode, periode) => ({
  ...VilkarResultPicker.buildInitialValues(avslagKode, aksjonspunkter, status, periode),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = values => ({
  begrunnelse: values.begrunnelse,
});

VilkarresultatMedBegrunnelse.validate = (
  values: { erVilkarOk: string; avslagCode: string } = { erVilkarOk: '', avslagCode: '' },
) => VilkarResultPicker.validate(values.erVilkarOk, values.avslagCode);

export default VilkarresultatMedBegrunnelse;
