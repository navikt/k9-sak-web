import type { AksjonspunktDto, VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { Box } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { type FunctionComponent } from 'react';
import { type VilkarresultatMedBegrunnelseState } from './FormState';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import VilkarResultPickerRHF from './VilkarResultPickerRHF';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  customVilkarIkkeOppfyltText?: string | React.ReactElement<any>;
  customVilkarOppfyltText?: string | React.ReactElement<any>;
  skalViseBegrunnelse?: boolean;
  opprettetAv?: string;
  vilkarType: string;
}

interface StaticFunctions {
  transformValues: (values: VilkarresultatMedBegrunnelseState) => { begrunnelse: string };
  buildInitialValues: (
    aksjonspunkter: AksjonspunktDto[],
    status: string,
    periode: VilkårPeriodeDto,
    avslagKode?: string,
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
  vilkarType,
}) => {
  return (
    <>
      {skalViseBegrunnelse && (
        <Box marginBlock={'0 2'}>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <AssessedBy ident={opprettetAv} />
        </Box>
      )}
      <VilkarResultPickerRHF
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
        vilkarType={vilkarType}
      />
    </>
  );
};

VilkarresultatMedBegrunnelse.buildInitialValues = (
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  periode: VilkårPeriodeDto,
  avslagKode?: string,
) => ({
  ...VilkarResultPickerRHF.buildInitialValues(aksjonspunkter, status, avslagKode),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = (values: VilkarresultatMedBegrunnelseState) => ({
  begrunnelse: values.begrunnelse,
});

export default VilkarresultatMedBegrunnelse;
