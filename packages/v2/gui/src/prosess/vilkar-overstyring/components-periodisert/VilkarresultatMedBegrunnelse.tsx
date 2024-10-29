import type { AksjonspunktDto, VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { Box } from '@navikt/ds-react';
import { AssessedBy } from '@navikt/ft-plattform-komponenter';
import { type FunctionComponent } from 'react';
import { type VilkarresultatMedBegrunnelseState } from './FormState';
import VilkarBegrunnelse from './VilkarBegrunnelse';
import VilkarResultPickerPeriodisertRHF from './VilkarResultPickerPeriodisertRHF';

interface VilkarresultatMedBegrunnelseProps {
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  readOnly: boolean;
  erMedlemskapsPanel: boolean;
  visPeriodisering: boolean;
  customVilkarIkkeOppfyltText?: string | React.ReactElement;
  customVilkarOppfyltText?: string | React.ReactElement;
  skalViseBegrunnelse?: boolean;
  periodeFom: string;
  periodeTom: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
  opprettetAv?: string;
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
        <Box marginBlock={'0 2'}>
          <VilkarBegrunnelse isReadOnly={readOnly} />
          <AssessedBy ident={opprettetAv} />
        </Box>
      )}
      <VilkarResultPickerPeriodisertRHF
        customVilkarOppfyltText={
          customVilkarOppfyltText ?? 'Vilkåret er oppfylt'
          // <FormattedMessage
          //   id={customVilkarOppfyltText ? customVilkarOppfyltText.id : 'VilkarresultatMedOverstyringForm.ErOppfylt'}
          //   values={
          //     customVilkarOppfyltText
          //       ? {
          //           b: chunks => <b>{chunks}</b>,
          //           ...customVilkarIkkeOppfyltText?.values,
          //         }
          //       : { b: chunks => <b>{chunks}</b> }
          //   }
          // />
        }
        customVilkarIkkeOppfyltText={
          customVilkarIkkeOppfyltText ?? (
            <>
              Vilkåret er <b>ikke</b> oppfylt
            </>
          )
          // <FormattedMessage
          //   id={
          //     customVilkarIkkeOppfyltText
          //       ? customVilkarOppfyltText?.id
          //       : 'VilkarresultatMedOverstyringForm.VilkarIkkeOppfylt'
          //   }
          //   values={
          //     customVilkarIkkeOppfyltText
          //       ? {
          //           b: chunks => <b>{chunks}</b>,
          //           ...customVilkarIkkeOppfyltText.values,
          //         }
          //       : { b: chunks => <b>{chunks}</b> }
          //   }
          // />
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
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  periode: VilkårPeriodeDto,
  avslagKode?: string,
) => ({
  ...VilkarResultPickerPeriodisertRHF.buildInitialValues(aksjonspunkter, status, periode, avslagKode),
  ...VilkarBegrunnelse.buildInitialValues(periode),
});

VilkarresultatMedBegrunnelse.transformValues = (values: VilkarresultatMedBegrunnelseState) => ({
  begrunnelse: values.begrunnelse,
});
