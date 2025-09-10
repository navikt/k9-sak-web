import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { Label } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { InnvilgetMerknad } from '@k9-sak-web/types/src/vilkarTsType';
import { BodyShort, Radio } from '@navikt/ds-react';
import { RhfDatepicker, RhfRadioGroupNew, RhfSelect } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { FunctionComponent, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './vilkarResultPicker.module.css';

export type VilkarResultPickerFormState = {
  erVilkarOk?: boolean;
  avslagCode?: string;
  avslagDato?: string;
  innvilgelseMerknadKode?: string;
};

type TransformedValues = {
  erVilkarOk?: boolean;
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
  const { control } = useFormContext();

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
        <RhfRadioGroupNew
          control={control}
          name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
          validate={[required]}
          isReadOnly={readOnly}
        >
          <Radio value={true}>
            <Label input={customVilkarOppfyltText} textOnly />
          </Radio>
          <Radio value={false}>
            <Label input={customVilkarIkkeOppfyltText} textOnly />
          </Radio>
        </RhfRadioGroupNew>
      )}
      {erVilkarOk !== undefined &&
        erVilkarOk &&
        relevanteInnvilgetMerknader &&
        relevanteInnvilgetMerknader.length > 0 && (
          <>
            <VerticalSpacer sixteenPx />
            <RhfSelect
              control={control}
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}innvilgelseMerknadKode`}
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
          <RhfSelect
            control={control}
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
              <RhfDatepicker
                control={control}
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
    ? { erVilkarOk: values.erVilkarOk, innvilgelseMerknadKode: values.innvilgelseMerknadKode }
    : {
        erVilkarOk: values.erVilkarOk,
        avslagskode: values.avslagCode,
        avslagDato: values.avslagDato,
      };

export default VilkarResultPickerRHF;
