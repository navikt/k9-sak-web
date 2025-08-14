import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
  k9_sak_kontrakt_vilkår_InnvilgetMerknad as InnvilgetMerknad,
} from '@k9-sak-web/backend/k9sak/generated';
import { Box } from '@navikt/ds-react';
import React, { type FunctionComponent } from 'react';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import { type VilkarresultatMedBegrunnelseState } from './FormState';
import VilkarResultPickerPeriodisertRHF from './VilkarResultPickerPeriodisertRHF';
import { VurdertAv } from '@k9-sak-web/gui/shared/vurdert-av/VurdertAv.js';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  customVilkarIkkeOppfyltText?: string | React.ReactElement<any>;
  customVilkarOppfyltText?: string | React.ReactElement<any>;
  skalViseBegrunnelse?: boolean;
  periodeFom: string;
  periodeTom: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
  opprettetAv?: string;
  vilkarType: string;
  relevanteInnvilgetMerknader: InnvilgetMerknad[];
}

interface StaticFunctions {
  transformValues: (values: VilkarresultatMedBegrunnelseState) => { begrunnelse: string };
  buildInitialValues: (
    aksjonspunkter: AksjonspunktDto[],
    status: string,
    periode: VilkårPeriodeDto,
    avslagKode1: string | undefined,
    innvilgelseMerknadKode?: string,
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
  vilkarType,
  relevanteInnvilgetMerknader,
}: VilkarresultatMedBegrunnelseProps) => {
  return (
    <>
      {skalViseBegrunnelse && (
        <Box marginBlock={'0 2'}>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <VurdertAv ident={opprettetAv} />
        </Box>
      )}
      <VilkarResultPickerPeriodisertRHF
        customVilkarOppfyltText={customVilkarOppfyltText ?? 'Vilkåret er oppfylt'}
        customVilkarIkkeOppfyltText={
          customVilkarIkkeOppfyltText ?? (
            <>
              Vilkåret er <b>ikke</b> oppfylt
            </>
          )
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
        vilkarType={vilkarType}
        relevanteInnvilgetMerknader={relevanteInnvilgetMerknader}
      />
    </>
  );
};

VilkarresultatMedBegrunnelse.buildInitialValues = (
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  periode: VilkårPeriodeDto,
  avslagKode?: string,
  innvilgelseMerknadKode?: string,
) => ({
  ...VilkarResultPickerPeriodisertRHF.buildInitialValues(
    aksjonspunkter,
    status,
    periode,
    avslagKode,
    innvilgelseMerknadKode,
  ),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = (values: VilkarresultatMedBegrunnelseState) => ({
  begrunnelse: values.begrunnelse,
});
