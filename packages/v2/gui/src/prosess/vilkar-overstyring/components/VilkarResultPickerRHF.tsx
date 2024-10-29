import { vilkårStatus } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatus.js';
import { KodeverkType, type KodeverkObject } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, BodyShort, Box, Label } from '@navikt/ds-react';
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
}) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  const avslagsarsaker = hentKodeverkForKode(KodeverkType.AVSLAGSARSAK) as KodeverkObject[];
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
              label: <Label>{customVilkarOppfyltText}</Label>,
            },
            {
              value: 'false',
              label: <Label>{customVilkarIkkeOppfyltText}</Label>,
            },
          ]}
        />
      )}
      {erVilkarOk !== undefined && !erVilkarOk && avslagsarsaker && (
        <>
          <Box marginBlock={'4 0'}>
            <SelectField
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
              label="Avslagsårsak"
              selectValues={avslagsarsaker.map(aa => (
                <option key={aa.kode} value={aa.kode}>
                  {aa.navn}
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
