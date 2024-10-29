import type { AksjonspunktDto, VilkårPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';
import { vilkårStatusPeriodisert } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/VilkårStatusPeriodisert.js';
import { useKodeverkContext } from '@k9-sak-web/gui/kodeverk/index.js';
import { type KodeverkObject, KodeverkType, type Periode } from '@k9-sak-web/lib/kodeverk/types.js';
import { Alert, BodyShort, Box, Label } from '@navikt/ds-react';
import { Datepicker, RadioGroupPanel, SelectField } from '@navikt/ft-form-hooks';
import { hasValidDate, required } from '@navikt/ft-form-validators';
import { isAfter, isBefore, parse } from 'date-fns';
import type { FunctionComponent, ReactNode } from 'react';
import { isAksjonspunktOpen } from '../../../utils/aksjonspunktUtils';

export type VilkarResultPickerFormState = {
  erVilkarOk: string;
  periodeVilkarStatus: boolean;
  avslagCode?: string;
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
  customVilkarIkkeOppfyltText: string | ReactNode;
  customVilkarOppfyltText: string | ReactNode;
  readOnly: boolean;
  erMedlemskapsPanel?: boolean;
  visPeriodisering: boolean;
  fieldNamePrefix?: string;
  periodeFom: string;
  periodeTom: string;
  valgtPeriodeFom: string;
  valgtPeriodeTom: string;
}

interface StaticFunctions {
  transformValues: (values: VilkarResultPickerFormState, periodeFom?: string, periodeTom?: string) => TransformedValues;
  buildInitialValues: (
    aksjonspunkter: AksjonspunktDto[],
    status: string,
    periode: VilkårPeriodeDto,
    avslagKode?: string,
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
}) => {
  const { hentKodeverkForKode } = useKodeverkContext();
  const avslagsarsaker = hentKodeverkForKode(KodeverkType.AVSLAGSARSAK) as KodeverkObject[];

  const ugyldigeFomDatoer = () => [
    (date: Date) => isBefore(date, parse(periodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(valgtPeriodeTom, 'yyyy-MM-dd', new Date())),
  ];

  const ugyldigeTomDatoer = () => [
    (date: Date) => isBefore(date, parse(valgtPeriodeFom, 'yyyy-MM-dd', new Date())),
    (date: Date) => isAfter(date, parse(periodeTom, 'yyyy-MM-dd', new Date())),
  ];

  return (
    <Box paddingBlock={'4 0'} paddingInline={'4 0'}>
      {readOnly && erVilkarOk !== undefined && (
        <Alert variant={erVilkarOk === vilkårStatusPeriodisert.OPPFYLT ? 'success' : 'error'}>
          {erVilkarOk === vilkårStatusPeriodisert.OPPFYLT && (
            <BodyShort size="small">{customVilkarOppfyltText}</BodyShort>
          )}
          {erVilkarOk === vilkårStatusPeriodisert.IKKE_OPPFYLT && (
            <BodyShort size="small">{customVilkarIkkeOppfyltText}</BodyShort>
          )}
        </Alert>
      )}

      {(!readOnly || erVilkarOk === undefined) && (
        <RadioGroupPanel
          name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
          validate={[required]}
          isReadOnly={readOnly}
          radios={[
            {
              value: vilkårStatusPeriodisert.OPPFYLT,
              label: <Label>{customVilkarOppfyltText}</Label>,
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
              label: <Label>{customVilkarIkkeOppfyltText}</Label>,
            },
          ]}
        />
      )}

      {erVilkarOk !== undefined && (
        <>
          {erVilkarOk === vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT && avslagsarsaker && (
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
          )}
          {(erVilkarOk === vilkårStatusPeriodisert.DELVIS_OPPFYLT ||
            erVilkarOk === vilkårStatusPeriodisert.DELVIS_IKKE_OPPFYLT) && (
            <Box marginBlock={'2 0'}>
              <Datepicker
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeFom`}
                label="Fra dato"
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
                disabledDays={ugyldigeFomDatoer()}
              />
              <Datepicker
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeTom`}
                label="Til dato"
                disabledDays={ugyldigeTomDatoer()}
                isReadOnly={readOnly}
                validate={[required, hasValidDate]}
              />
            </Box>
          )}

          {erVilkarOk === vilkårStatusPeriodisert.IKKE_OPPFYLT && avslagsarsaker && (
            <Box marginBlock={'2 0'}>
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
                <Datepicker
                  name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
                  label="Dato"
                  isReadOnly={readOnly}
                  validate={[required, hasValidDate]}
                />
              )}
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

VilkarResultPickerPeriodisertRHF.buildInitialValues = (
  aksjonspunkter: AksjonspunktDto[],
  status: string,
  periode: VilkårPeriodeDto,
  avslagKode?: string,
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
      };

    case vilkårStatusPeriodisert.DELVIS_OPPFYLT:
      return {
        erVilkarOk: true,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
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
