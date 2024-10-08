import { FunctionComponent, ReactNode } from 'react';

import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { DatepickerField, Label, RadioGroupField, SelectField } from '@fpsak-frontend/form';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { hasValidDate, isRequiredMessage, required } from '@fpsak-frontend/utils';
import { Aksjonspunkt, KodeverkMedNavn, Periode, Vilkarperiode, vilkarUtfallPeriodisert } from '@k9-sak-web/types';
import { BodyShort } from '@navikt/ds-react';
import { parse } from 'date-fns';
import getPackageIntl from '../../i18n/getPackageIntl';

import styles from './vilkarResultPicker.module.css';

export type VilkarResultPickerFormState = {
  erVilkarOk: string;
  periodeVilkarStatus: boolean;
  avslagCode?: string;
  avslagDato?: string;
  valgtPeriodeFom?: string;
  valgtPeriodeTom?: string;
};

type TransformedValues = {
  erVilkarOk: boolean;
  periode: Periode | null | undefined;
  avslagskode?: string;
  avslagDato?: string;
};

interface OwnProps {
  avslagsarsaker?: KodeverkMedNavn[];
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
  ) => VilkarResultPickerFormState;
  validate: (erVilkarOk: string, avslagCode: string) => { avslagCode?: [{ id: 'ValidationMessage.NotEmpty' }] };
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPicker: FunctionComponent<OwnProps> & StaticFunctions = ({
  avslagsarsaker,
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
  const intl = getPackageIntl();

  const gyldigFomDatoer = () => ({
    before: parse(periodeFom, 'yyyy-MM-dd', new Date()),
    after: parse(valgtPeriodeTom, 'yyyy-MM-dd', new Date()),
  });

  const gyldigTomDatoer = () => ({
    before: parse(valgtPeriodeFom, 'yyyy-MM-dd', new Date()),
    after: parse(periodeTom, 'yyyy-MM-dd', new Date()),
  });

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
        <RadioGroupField
          name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}erVilkarOk`}
          validate={[required]}
          bredde="XXL"
          isVertical
          readOnly={readOnly}
          radios={[
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
                    label: periodeVilkarStatus
                      ? intl.formatMessage(
                          { id: 'OpptjeningPanel.DelvisIkkeOppfylt' },
                          { b: chunks => <b>{chunks}</b> },
                        )
                      : intl.formatMessage({ id: 'OpptjeningPanel.DelvisOppfylt' }),
                  },
                ]
              : []),
            {
              value: vilkarUtfallPeriodisert.IKKE_OPPFYLT,
              label: <Label input={customVilkarIkkeOppfyltText} textOnly />,
            },
          ]}
        />
      )}

      {erVilkarOk !== undefined && (
        <>
          {erVilkarOk === vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT && avslagsarsaker && (
            <SelectField
              name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
              label={intl.formatMessage({ id: 'VilkarResultPicker.Arsak' })}
              placeholder={intl.formatMessage({ id: 'VilkarResultPicker.SelectArsak' })}
              selectValues={avslagsarsaker.map(aa => (
                <option key={aa.kode} value={aa.kode}>
                  {aa.navn}
                </option>
              ))}
              bredde="xl"
              readOnly={readOnly}
            />
          )}
          {(erVilkarOk === vilkarUtfallPeriodisert.DELVIS_OPPFYLT ||
            erVilkarOk === vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT) && (
            <>
              <VerticalSpacer eightPx />
              <DatepickerField
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeFom`}
                label={intl.formatMessage({ id: 'VilkarResultPicker.VilkarPeriodisertFraDato' })}
                readOnly={readOnly}
                validate={[required, hasValidDate]}
                disabledDays={gyldigFomDatoer()}
              />
              <DatepickerField
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}valgtPeriodeTom`}
                label={intl.formatMessage({ id: 'VilkarResultPicker.VilkarPeriodisertTilDato' })}
                disabledDays={gyldigTomDatoer()}
                readOnly={readOnly}
                validate={[required, hasValidDate]}
              />
            </>
          )}

          {erVilkarOk === vilkarUtfallPeriodisert.IKKE_OPPFYLT && avslagsarsaker && (
            <>
              <VerticalSpacer eightPx />
              <SelectField
                name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagCode`}
                label={intl.formatMessage({ id: 'VilkarResultPicker.Arsak' })}
                placeholder={intl.formatMessage({ id: 'VilkarResultPicker.SelectArsak' })}
                selectValues={avslagsarsaker.map(aa => (
                  <option key={aa.kode} value={aa.kode}>
                    {aa.navn}
                  </option>
                ))}
                bredde="xl"
                readOnly={readOnly}
              />
              {erMedlemskapsPanel && (
                <DatepickerField
                  name={`${fieldNamePrefix ? `${fieldNamePrefix}.` : ''}avslagDato`}
                  label={intl.formatMessage({ id: 'VilkarResultPicker.VilkarDato' })}
                  readOnly={readOnly}
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

VilkarResultPicker.validate = (erVilkarOk: string, avslagCode: string): { avslagCode?: any } => {
  if (
    (erVilkarOk === vilkarUtfallPeriodisert.IKKE_OPPFYLT ||
      erVilkarOk === vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT) &&
    !avslagCode
  ) {
    return {
      avslagCode: isRequiredMessage(),
    };
  }
  return {};
};

VilkarResultPicker.buildInitialValues = (
  avslagKode: string,
  aksjonspunkter: Aksjonspunkt[],
  status: string,
  periode: Vilkarperiode,
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
    valgtPeriodeFom: periode.periode.fom,
    valgtPeriodeTom: periode.periode.tom,
  };
};

VilkarResultPicker.transformValues = (
  values: VilkarResultPickerFormState,
  periodeFom?: string,
  periodeTom?: string,
) => {
  switch (values.erVilkarOk) {
    case vilkarUtfallPeriodisert.OPPFYLT:
      return {
        erVilkarOk: true,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
      };

    case vilkarUtfallPeriodisert.DELVIS_OPPFYLT:
      return {
        erVilkarOk: true,
        periode: {
          fom: values.valgtPeriodeFom,
          tom: values.valgtPeriodeTom,
        },
      };

    case vilkarUtfallPeriodisert.IKKE_OPPFYLT:
      return {
        erVilkarOk: false,
        avslagskode: values.avslagCode,
        avslagsDato: values.avslagDato,
        periode: periodeFom && periodeTom ? { fom: periodeFom, tom: periodeTom } : undefined,
      };

    case vilkarUtfallPeriodisert.DELVIS_IKKE_OPPFYLT:
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
        erVilkarOk: null,
        avslagskode: null,
        periode: null,
      };
  }
};

export default VilkarResultPicker;
