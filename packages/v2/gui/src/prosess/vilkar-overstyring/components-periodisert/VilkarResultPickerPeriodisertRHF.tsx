import type {
  k9_sak_kontrakt_aksjonspunkt_AksjonspunktDto as AksjonspunktDto,
  k9_sak_kontrakt_vilkår_InnvilgetMerknad as InnvilgetMerknad,
  k9_sak_kontrakt_vilkår_VilkårPeriodeDto as VilkårPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';
import { vilkårStatusPeriodisert } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatusPeriodisert.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { type KodeverkMedUndertype, KodeverkType, type Periode } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, BodyShort, Box } from '@navikt/ds-react';
import { RhfDatepicker, RhfRadioGroup, RhfSelect } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { isAfter, isBefore, parse } from 'date-fns';
import type { FunctionComponent, ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

export type VilkarResultPickerFormState = {
  erVilkarOk: string;
  periodeVilkarStatus: boolean;
  avslagCode?: string;
  innvilgelseMerknadCode?: string;
  avslagDato?: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
};

type TransformedValues = {
  erVilkarOk: boolean;
  periode: Periode | null | undefined;
  avslagskode?: string;
  avslagDato?: string;
};

interface OwnProps {
  erVilkarOk?: string;
  periodeVilkarStatus?: boolean;
  customVilkarIkkeOppfyltText: string | ReactElement;
  customVilkarOppfyltText: string | ReactElement;
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
  visPeriodisering: boolean;
  fieldNamePrefix?: string;
  periodeFom: string;
  periodeTom: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
  vilkarType: string;
  relevanteInnvilgetMerknader: InnvilgetMerknad[];
}

interface StaticFunctions {
  transformValues: (values: VilkarResultPickerFormState, periodeFom?: string, periodeTom?: string) => TransformedValues;
  buildInitialValues: (
    aksjonspunkter: AksjonspunktDto[],
    status: string,
    periode: VilkårPeriodeDto,
    avslagKode1: string | undefined,
    innvilgelseMerknadKode?: string,
  ) => VilkarResultPickerFormState;
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPickerPeriodisertRHF: FunctionComponent<OwnProps> & StaticFunctions = ({
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
  vilkarType,
  relevanteInnvilgetMerknader,
}) => {
  const { control } = useFormContext();
  const { hentKodeverkForKode } = useKodeverkContext();
  const avslagsarsaker = hentKodeverkForKode(KodeverkType.AVSLAGSARSAK) as KodeverkMedUndertype;
  const avslagsårsakerForVilkar = avslagsarsaker[vilkarType];
  const ugyldigeFomDatoer = () => [
    (date: Date) => isBefore(date, parse(periodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(valgtPeriodeTom, 'yyyy-MM-dd', new Date())),
  ];

  const ugyldigeTomDatoer = () => [
    (date: Date) => isBefore(date, parse(valgtPeriodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(periodeTom, 'yyyy-MM-dd', new Date())),
  ];

  return (
    <Box.New paddingBlock={'4 0'} paddingInline={'4 0'}>
      {readOnly && erVilkarOk !== undefined && (
        <Alert variant={erVilkarOk === vilkårStatusPeriodisert.OPPFYLT ? 'success' : 'error'} inline>
          {erVilkarOk === vilkårStatusPeriodisert.OPPFYLT && (
            <BodyShort size="small">{customVilkarOppfyltText}</BodyShort>
          )}
          {erVilkarOk === vilkårStatusPeriodisert.IKKE_OPPFYLT && (
            <BodyShort size="small">{customVilkarIkkeOppfyltText}</BodyShort>
          )}
        </Alert>
      )}

      {(!readOnly || erVilkarOk === undefined) && (
        <RhfRadioGroup
          control={control}
          name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
          validate={[required]}
          isReadOnly={readOnly}
          radios={[
            {
              value: vilkårStatusPeriodisert.OPPFYLT,
              label: customVilkarOppfyltText,
            },
            ...(visPeriodisering
              ? [
                  {
                    value: periodeVilkarStatus
                      ? vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT
                      : vilkårStatusPeriodisert.DELVIS_OPPFYLT,
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
              value: vilkårStatusPeriodisert.IKKE_OPPFYLT,
              label: customVilkarIkkeOppfyltText,
            },
          ]}
        />
      )}

      {erVilkarOk !== undefined && (
        <>
          {erVilkarOk === vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT && avslagsårsakerForVilkar && (
            <RhfSelect
              control={control}
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
              label="Avslagsårsak"
              selectValues={avslagsårsakerForVilkar
                .filter((avslagsårsak): avslagsårsak is string => typeof avslagsårsak === 'string')
                .map(avslagsårsak => (
                  <option key={avslagsårsak} value={avslagsårsak}>
                    {avslagsårsak}
                  </option>
                ))}
              readOnly={readOnly}
              validate={[required]}
            />
          )}
          {(erVilkarOk === vilkårStatusPeriodisert.DELVIS_OPPFYLT ||
            erVilkarOk === vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT) && (
            <Box.New marginBlock={'2 0'}>
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
            </Box.New>
          )}

          {erVilkarOk === vilkårStatusPeriodisert.OPPFYLT && relevanteInnvilgetMerknader && (
            <Box.New marginBlock={'2 0'}>
              <RhfSelect
                control={control}
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}innvilgetMerknadCode`}
                label="Hjemmel for innvilgelse"
                selectValues={relevanteInnvilgetMerknader.map(innvilgetMerknad => (
                  <option key={innvilgetMerknad.merknad} value={innvilgetMerknad.merknad}>
                    {innvilgetMerknad.navn}
                  </option>
                ))}
                readOnly={readOnly}
                validate={[required]}
              />
            </Box.New>
          )}

          {erVilkarOk === vilkårStatusPeriodisert.IKKE_OPPFYLT && avslagsårsakerForVilkar && (
            <Box.New marginBlock={'2 0'}>
              <RhfSelect
                control={control}
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
                label="Avslagsårsak"
                selectValues={avslagsårsakerForVilkar
                  .filter((avslagsårsak): avslagsårsak is string => typeof avslagsårsak === 'string')
                  .map(avslagsårsak => (
                    <option key={avslagsårsak} value={avslagsårsak}>
                      {avslagsårsak}
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
            </Box.New>
          )}
        </>
      )}
    </Box.New>
  );
};

VilkarResultPickerPeriodisertRHF.buildInitialValues = (
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  periode: VilkårPeriodeDto,
  avslagKode?: string,
  innvilgelseMerknadKode?: string,
): VilkarResultPickerFormState => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => ap.status && isAksjonspunktOpen(ap.status));
  let erVilkarOk = '';

  if (status === vilkårStatusPeriodisert.OPPFYLT) {
    erVilkarOk = vilkårStatusPeriodisert.OPPFYLT;
  } else if (status === vilkårStatusPeriodisert.IKKE_OPPFYLT) {
    erVilkarOk = vilkårStatusPeriodisert.IKKE_OPPFYLT;
  }

  return {
    erVilkarOk,
    periodeVilkarStatus: !isOpenAksjonspunkt && status === vilkårStatusPeriodisert.OPPFYLT,
    avslagCode: erVilkarOk === vilkårStatusPeriodisert.IKKE_OPPFYLT && avslagKode ? avslagKode : undefined,
    innvilgelseMerknadCode: innvilgelseMerknadKode,
    valgtPeriodeFom: periode.periode.fom ?? '',
    valgtPeriodeTom: periode.periode.tom ?? '',
  };
};

VilkarResultPickerPeriodisertRHF.transformValues = (
  values: VilkarResultPickerFormState,
  periodeFom?: string,
  periodeTom?: string,
) => {
  switch (values.erVilkarOk) {
    case vilkårStatusPeriodisert.OPPFYLT:
      return {
        erVilkarOk: true,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
        innvilgelseMerknadCode: values.innvilgelseMerknadCode,
      };

    case vilkårStatusPeriodisert.DELVIS_OPPFYLT:
      return {
        erVilkarOk: true,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
        innvilgelseMerknadCode: values.innvilgelseMerknadCode,
      };

    case vilkårStatusPeriodisert.IKKE_OPPFYLT:
      return {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        avslagsDato: values.avslagDato,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
      };

    case vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT:
      return {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
      };
    default:
      return {
        erVilkarOk: false,
        avslagskode: undefined,
        periode: { fom: '', tom: '' },
      };
  }
};

export default VilkarResultPickerPeriodisertRHF;
