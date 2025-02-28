import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { Label } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel, SelectField } from '@navikt/ft-form-hooks';
import { FunctionComponent, ReactNode } from 'react';
import styles from './vilkarResultPicker.module.css';
import { InnvilgetMerknad } from '@k9-sak-web/types/src/vilkarTsType';

export type VilkarResultPickerFormState = {
  erVilkarOk: boolean;
  avslagCode?: string;
  avslagDato?: string;
  innvilgelseMerknadCode?: string;
};

type TransformedValues = {
  erVilkarOk: boolean;
  avslagskode?: string;
  avslagDato?: string;
};

interface OwnProps {
  avslagsarsaker?: KodeverkMedNavn[];
  erVilkarOk?: boolean;
  customVilkarIkkeOppfyltText: string | ReactNode;
  customVilkarOppfyltText: string | ReactNode;
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
  fieldNamePrefix?: string;
  relevanteInnvilgetMerknader: InnvilgetMerknad[];
}

interface StaticFunctions {
  transformValues: (values: VilkarResultPickerFormState, periodeFom?: string, periodeTom?: string) => TransformedValues;
  buildInitialValues: (
    avslagKode: string,
    aksjonspunkter: Aksjonspunkt[],
    status: string,
    innvilgelseMerknadKode?: string,
  ) => VilkarResultPickerFormState;
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerRHF: FunctionComponent<OwnProps> & StaticFunctions = ({
  avslagsarsaker,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel = false,
  fieldNamePrefix,
  relevanteInnvilgetMerknader,
}) => {
  return (
    <div className={styles.container}>
      <VerticalSpacer sixteenPx />
      {readOnly && erVilkarOk !== undefined && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image className={styles.image} src={erVilkarOk ? innvilgetImage : avslattImage} />
            </FlexColumn>
            <FlexColumn>
              {erVilkarOk && <BodyShort size="small">{customVilkarOppfyltText}</BodyShort>}
              {!erVilkarOk && <BodyShort size="small">{customVilkarIkkeOppfyltText}</BodyShort>}
            </FlexColumn>
          </FlexRow>
          <VerticalSpacer eightPx />
        </FlexContainer>
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
              label: <Label input={customVilkarOppfyltText} textOnly />,
            },
            {
              value: 'false',
              label: <Label input={customVilkarIkkeOppfyltText} textOnly />,
            },
          ]}
        />
      )}
      {erVilkarOk !== undefined &&
        erVilkarOk &&
        relevanteInnvilgetMerknader &&
        relevanteInnvilgetMerknader.length > 0 && (
          <>
            <VerticalSpacer sixteenPx />
            <SelectField
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}innvilgelseMerknadCode`}
              label="Vilkårsmerknad"
              selectValues={relevanteInnvilgetMerknader.map(iu => (
                <option key={iu.merknad.kode} value={iu.merknad.kode}>
                  {iu.navn}
                </option>
              ))}
              readOnly={readOnly}
              validate={[required]}
            />
          </>
        )}
      {erVilkarOk !== undefined && !erVilkarOk && avslagsarsaker && (
        <>
          <VerticalSpacer sixteenPx />
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
          {erMedlemskapsPanel && (
            <>
              <VerticalSpacer eightPx />
              <Datepicker
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
                label="Dato"
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
              />
            </>
          )}
        </>
      )}
      <VerticalSpacer eightPx />
    </div>
  );
};

VilkarResultPickerRHF.buildInitialValues = (
  avslagKode: string,
  aksjonspunkter: Aksjonspunkt[],
  status: string,
  innvilgelseMerknadKode?: string,
): VilkarResultPickerFormState => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && avslagKode ? avslagKode : undefined,
    innvilgelseMerknadKode: erVilkarOk == true && innvilgelseMerknadKode ? innvilgelseMerknadKode : undefined,
  };
};

VilkarResultPickerRHF.transformValues = (values: VilkarResultPickerFormState) =>
  values.erVilkarOk
    ? { erVilkarOk: values.erVilkarOk, innvilgelseMerknadKode: values.innvilgelseMerknadCode }
    : {
        erVilkarOk: values.erVilkarOk,
        avslagskode: values.avslagCode,
        avslagDato: values.avslagDato,
      };

export default VilkarResultPickerRHF;
