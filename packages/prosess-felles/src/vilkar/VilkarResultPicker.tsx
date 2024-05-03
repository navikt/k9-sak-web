import avslattImage from '@k9-sak-web/assets/images/avslaatt.svg';
import innvilgetImage from '@k9-sak-web/assets/images/check.svg';
import { DatepickerField, RadioGroupField, RadioOption, SelectField } from '@k9-sak-web/form';
import { isAksjonspunktOpen } from '@k9-sak-web/kodeverk/src/aksjonspunktStatus';
import vilkarUtfallType from '@k9-sak-web/kodeverk/src/vilkarUtfallType';
import { FlexColumn, FlexContainer, FlexRow, Image, VerticalSpacer } from '@k9-sak-web/shared-components';
import { Aksjonspunkt, KodeverkMedNavn } from '@k9-sak-web/types';
import { hasValidDate, isRequiredMessage, required } from '@k9-sak-web/utils';
import { BodyShort } from '@navikt/ds-react';
import React, { ReactNode } from 'react';

import getPackageIntl from '../../i18n/getPackageIntl';

import styles from './vilkarResultPicker.module.css';

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
              {erVilkarOk && <BodyShort size="small">{customVilkarOppfyltText}</BodyShort>}
              {!erVilkarOk && <BodyShort size="small">{customVilkarIkkeOppfyltText}</BodyShort>}
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
  const isOpenAksjonspunkt = aksjonspunkter.some(ap => isAksjonspunktOpen(ap.status.kode));
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
