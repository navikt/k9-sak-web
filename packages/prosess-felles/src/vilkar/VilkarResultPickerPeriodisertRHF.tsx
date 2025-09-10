import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { Label } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { Aksjonspunkt, KodeverkMedNavn, Periode, Vilkarperiode, vilkarUtfallPeriodisert } from '@k9-sak-web/types';
import { InnvilgetMerknad } from '@k9-sak-web/types/src/vilkarTsType';
import { BodyShort, Radio } from '@navikt/ds-react';
import { RhfDatepicker, RhfRadioGroupNew, RhfSelect } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { isAfter, isBefore, parse } from 'date-fns';
import { FunctionComponent, ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import styles from './vilkarResultPicker.module.css';

export type VilkarResultPickerFormState = {
  erVilkarOk: string;
  periodeVilkarStatus: boolean;
  avslagCode?: string;
  innvilgelseMerknadCode?: string;
  avslagDato?: string;
  valgtPeriodeFom?: string;
  valgtPeriodeTom?: string;
};

type TransformedValues = {
  erVilkarOk: boolean;
  periode: Periode | null | undefined;
  avslagskode?: string;
  innvilgelseMerknadKode?: string;
  avslagDato?: string;
};

interface OwnProps {
  avslagsarsaker?: KodeverkMedNavn[];
  relevanteInnvilgetMerknader?: InnvilgetMerknad[];
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  customVilkarIkkeOppfyltText: string | ReactNode;
  customVilkarOppfyltText: string | ReactNode;
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
  visPeriodisering: boolean;
  fieldNamePrefix?: string;
  periodeFom?: string;
  periodeTom?: string;
  valgtPeriodeFom?: string;
  valgtPeriodeTom?: string;
}

interface StaticFunctions {
  transformValues: (values: VilkarResultPickerFormState, periodeFom?: string, periodeTom?: string) => TransformedValues;
  buildInitialValues: (
    avslagKode: string,
    aksjonspunkter: Aksjonspunkt[],
    status: string,
    periode: Vilkarperiode,
    innvilgelseMerknadKode?: string,
  ) => VilkarResultPickerFormState;
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerPeriodisertRHF: FunctionComponent<OwnProps> & StaticFunctions = ({
  avslagsarsaker,
  relevanteInnvilgetMerknader,
  erVilkarOk,
  periodeVilkarStatus,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel = false,
  visPeriodisering,
  fieldNamePrefix,
  periodeFom,
  periodeTom,
  valgtPeriodeFom,
  valgtPeriodeTom,
}) => {
  const { control } = useFormContext();
  const ugyldigeFomDatoer = () => [
    (date: Date) => isBefore(date, parse(periodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(valgtPeriodeTom, 'yyyy-MM-dd', new Date())),
  ];

  const ugyldigeTomDatoer = () => [
    (date: Date) => isBefore(date, parse(valgtPeriodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(periodeTom, 'yyyy-MM-dd', new Date())),
  ];

  const radios = [
    {
      value: vilkarUtfallPeriodisert.OPPFYLT,
      label: <Label input={customVilkarOppfyltText} textOnly />,
    },
    ...(visPeriodisering
      ? [
          {
            value: periodeVilkarStatus
              ? vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT
              : vilkarUtfallPeriodisert.DELVIS_OPPFYLT,
            label: periodeVilkarStatus ? (
              <>
                Vilkåret er <b>delvis ikke</b> oppfylt
              </>
            ) : (
              'Vilkåret er delvis oppfylt'
            ),
          },
        ]
      : []),
    {
      value: vilkarUtfallPeriodisert.IKKE_OPPFYLT,
      label: <Label input={customVilkarIkkeOppfyltText} textOnly />,
    },
  ];

  return (
    <div className={styles.container}>
      <VerticalSpacer sixteenPx />
      {readOnly && erVilkarOk !== undefined && (
        <FlexContainer>
          <FlexRow>
            <FlexColumn>
              <Image
                className={styles.image}
                src={erVilkarOk === vilkarUtfallPeriodisert.OPPFYLT ? innvilgetImage : avslattImage}
              />
            </FlexColumn>
            <FlexColumn>
              {erVilkarOk === vilkarUtfallPeriodisert.OPPFYLT && (
                <BodyShort size="small">{customVilkarOppfyltText}</BodyShort>
              )}
              {erVilkarOk === vilkarUtfallPeriodisert.IKKE_OPPFYLT && (
                <BodyShort size="small">{customVilkarIkkeOppfyltText}</BodyShort>
              )}
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
          {radios.map(radio => (
            <Radio key={radio.value} value={radio.value}>
              {radio.label}
            </Radio>
          ))}
        </RhfRadioGroupNew>
      )}

      {erVilkarOk !== undefined && (
        <>
          {erVilkarOk === vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT && avslagsarsaker && (
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
          )}
          {(erVilkarOk === vilkarUtfallPeriodisert.DELVIS_OPPFYLT ||
            erVilkarOk === vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT) && (
            <>
              <VerticalSpacer eightPx />
              <RhfDatepicker
                control={control}
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeFom`}
                label="Fra dato"
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
                disabledDays={ugyldigeFomDatoer()}
              />
              <RhfDatepicker
                control={control}
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeTom`}
                label="Til dato"
                disabledDays={ugyldigeTomDatoer()}
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
              />
            </>
          )}

          {erVilkarOk === vilkarUtfallPeriodisert.OPPFYLT &&
            relevanteInnvilgetMerknader &&
            relevanteInnvilgetMerknader.length > 0 && (
              <>
                <VerticalSpacer sixteenPx />
                <RhfSelect
                  control={control}
                  name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}innvilgelseMerknadCode`}
                  label="Hjemmel for innvilgelse"
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

          {erVilkarOk === vilkarUtfallPeriodisert.IKKE_OPPFYLT && avslagsarsaker && (
            <>
              <VerticalSpacer eightPx />
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
                <RhfDatepicker
                  control={control}
                  name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
                  label="Dato"
                  isReadOnly={readOnly}
                  validate={[required, hasValidDate]}
                />
              )}
            </>
          )}
        </>
      )}
      <VerticalSpacer eightPx />
    </div>
  );
};

VilkarResultPickerPeriodisertRHF.buildInitialValues = (
  avslagKode: string,
  aksjonspunkter: Aksjonspunkt[],
  status: string,
  periode: Vilkarperiode,
  innvilgelseMerknadKode?: string,
): VilkarResultPickerFormState => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
  let erVilkarOk;

  if (status === vilkarUtfallType.OPPFYLT) {
    erVilkarOk = vilkarUtfallPeriodisert.OPPFYLT;
  } else if (status === vilkarUtfallType.IKKE_OPPFYLT) {
    erVilkarOk = vilkarUtfallPeriodisert.IKKE_OPPFYLT;
  }

  return {
    erVilkarOk,
    periodeVilkarStatus: !isOpenAksjonspunkt && status === vilkarUtfallType.OPPFYLT,
    avslagCode: erVilkarOk === vilkarUtfallType.IKKE_OPPFYLT && avslagKode ? avslagKode : undefined,
    innvilgelseMerknadCode:
      erVilkarOk === vilkarUtfallType.OPPFYLT && innvilgelseMerknadKode ? innvilgelseMerknadKode : undefined,
    valgtPeriodeFom: periode.periode.fom,
    valgtPeriodeTom: periode.periode.tom,
  };
};

VilkarResultPickerPeriodisertRHF.transformValues = (
  values: VilkarResultPickerFormState,
  periodeFom?: string,
  periodeTom?: string,
) => {
  switch (values.erVilkarOk) {
    case vilkarUtfallPeriodisert.OPPFYLT:
      return {
        erVilkarOk: true,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
        innvilgelseMerknadKode: values.innvilgelseMerknadCode,
      };

    case vilkarUtfallPeriodisert.DELVIS_OPPFYLT:
      return {
        erVilkarOk: true,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
        innvilgelseMerknadKode: null,
      };

    case vilkarUtfallPeriodisert.IKKE_OPPFYLT:
      return {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        avslagsDato: values.avslagDato,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
        innvilgelseMerknadKode: null,
      };

    case vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT:
      return {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
        innvilgelseMerknadKode: null,
      };
    default:
      return {
        erVilkarOk: null,
        avslagskode: null,
        periode: null,
        innvilgelseMerknadKode: null,
      };
  }
};

export default VilkarResultPickerPeriodisertRHF;
