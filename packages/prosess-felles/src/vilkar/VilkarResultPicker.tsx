import React, { ReactNode } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

import { VerticalSpacer, FlexContainer, FlexRow, FlexColumn, Image } from '@fpsak-frontend/shared-components';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import { isAksjonspunktOpen } from '@fpsak-frontend/kodeverk/src/aksjonspunktStatus';
import { DatepickerField, RadioGroupField, RadioOption, SelectField } from '@fpsak-frontend/form';
import { hasValidDate, isRequiredMessage, required } from '@fpsak-frontend/utils';
import avslattImage from '@fpsak-frontend/assets/images/avslaatt.svg';
import innvilgetImage from '@fpsak-frontend/assets/images/check.svg';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';

import getPackageIntl from '../../i18n/getPackageIntl';

import styles from './vilkarResultPicker.less';

type FormValues = {
  erVilkarOk: boolean;
  avslagCode?: string;
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
}

/**
 * VilkarResultPicker
 *
 * Presentasjonskomponent. Lar NAV-ansatt velge om vilkåret skal oppfylles eller avvises.
 */
const VilkarResultPicker = ({
  avslagsarsaker,
  erVilkarOk,
  customVilkarIkkeOppfyltText,
  customVilkarOppfyltText,
  readOnly,
  erMedlemskapsPanel = false,
  fieldNamePrefix,
}: OwnProps) => {
  const intl = getPackageIntl();
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
              {erVilkarOk && <Normaltekst>{customVilkarOppfyltText}</Normaltekst>}
              {!erVilkarOk && <Normaltekst>{customVilkarIkkeOppfyltText}</Normaltekst>}
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
          direction="vertical"
          readOnly={readOnly}
        >
          <RadioOption label={customVilkarOppfyltText} value />
          <RadioOption label={customVilkarIkkeOppfyltText} value={false} />
        </RadioGroupField>
      )}
      {erVilkarOk !== undefined && !erVilkarOk && avslagsarsaker && (
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
      <VerticalSpacer eightPx />
    </div>
  );
};

VilkarResultPicker.validate = (erVilkarOk: boolean, avslagCode: string): { avslagCode?: any } => {
  if (erVilkarOk === false && !avslagCode) {
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
): FormValues => {
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status));
  const erVilkarOk = isOpenAksjonspunkt ? undefined : vilkarUtfallType.OPPFYLT === status;
  return {
    erVilkarOk,
    avslagCode: erVilkarOk === false && avslagKode ? avslagKode : undefined,
  };
};

VilkarResultPicker.transformValues = (values: FormValues) =>
  values.erVilkarOk
    ? { erVilkarOk: values.erVilkarOk }
    : {
      erVilkarOk: values.erVilkarOk,
      avslagskode: values.avslagCode,
      avslagDato: values.avslagDato,
    };

export default VilkarResultPicker;
