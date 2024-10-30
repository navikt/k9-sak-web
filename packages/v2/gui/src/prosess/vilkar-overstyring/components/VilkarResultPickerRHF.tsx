import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { KodeverkType, type KodeverkMedUndertype, type KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, BodyShort, Box } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel, SelectField } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { type AksjonspunktDto } from '@navikt/k9-sak-typescript-client';
import { type FunctionComponent, type ReactNode } from 'react';
import { useKodeverkContext } from '../../../kodeverk';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

export type VilkarResultPickerFormState = {
  erVilkarOk?: boolean;
  avslagCode?: string;
  avslagDato?: string;
};

type TransformedValues = {
  erVilkarOk: boolean;
  avslagskode?: string;
  avslagDato?: string;
};

interface OwnProps {
  erVilkarOk?: boolean;
  customVilkarIkkeOppfyltText: string | ReactNode;
  customVilkarOppfyltText: string | ReactNode;
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
  fieldNamePrefix?: string;
  vilkarType: string;
}

interface StaticFunctions {
  transformValues: (values: VilkarResultPickerFormState, periodeFom?: string, periodeTom?: string) => TransformedValues;
  buildInitialValues: (
    aksjonspunkter: AksjonspunktDto[],
    status: string,
    avslagKode?: string,
  ) => VilkarResultPickerFormState;
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerRHF: FunctionComponent<OwnProps> & StaticFunctions = ({
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel = false,
  fieldNamePrefix,
  vilkarType,
}) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  const avslagsarsaker = hentKodeverkForKode(KodeverkType.AVSLAGSARSAK) as KodeverkMedUndertype;
  const avslagsårsakerForVilkar = avslagsarsaker[vilkarType];

  return (
    <Box paddingBlock={'4 0'} paddingInline={'0 4'}>
      {readOnly && erVilkarOk !== undefined && (
        <Alert variant={erVilkarOk ? 'success' : 'error'} inline>
          <BodyShort size="small">{erVilkarOk ? customVilkarOppfyltText : customVilkarIkkeOppfyltText}</BodyShort>
        </Alert>
      )}
      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupPanel
          name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
          validate={[required]}
          isReadOnly={readOnly}
          isTrueOrFalseSelection
          radios={[
            {
              value: 'true',
              label: customVilkarOppfyltText,
            },
            {
              value: 'false',
              label: customVilkarIkkeOppfyltText,
            },
          ]}
        />
      )}
      {erVilkarOk !== undefined && !erVilkarOk && avslagsårsakerForVilkar && (
        <>
          <Box marginBlock={'4 0'}>
            <SelectField
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
              label="Avslagsårsak"
              selectValues={avslagsårsakerForVilkar
                .filter(
                  (avslagsårsak): avslagsårsak is KodeverkObject => (avslagsårsak as KodeverkObject).kode !== undefined,
                )
                .map(avslagsårsak => (
                  <option key={avslagsårsak.kode} value={avslagsårsak.kode}>
                    {avslagsårsak.navn}
                  </option>
                ))}
              readOnly={readOnly}
              validate={[required]}
            />
          </Box>
          {erMedlemskapsPanel && (
            <Box marginBlock={'2 0'}>
              <Datepicker
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
                label="Dato"
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

VilkarResultPickerRHF.buildInitialValues = (
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  avslagKode?: string,
): VilkarResultPickerFormState => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => ap.status && isAksjonspunktOpen(ap.status));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkårStatus.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && avslagKode ? avslagKode : undefined,
  };
};

VilkarResultPickerRHF.transformValues = (values: VilkarResultPickerFormState) =>
  values.erVilkarOk
    ? { erVilkarOk: true }
    : {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        avslagDato: values.avslagDato,
      };

export default VilkarResultPickerRHF;
