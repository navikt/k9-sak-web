import { DatepickerField } from '@k9-sak-web/form';
import InputField from '@k9-sak-web/form/src/InputField';
import { Label } from '@k9-sak-web/form/src/Label';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.module.css';
import SøknadFormValue from './types/SøknadFormValue';

interface SelvstendigNæringsdrivendeFormProps {
  erFrilanser: boolean;
  readOnly: boolean;
  clearSelvstendigValues: () => void;
  fieldArrayId: string;
}

const SelvstendigNæringsdrivendeForm = ({
  erFrilanser,
  readOnly,
  clearSelvstendigValues,
  fieldArrayId,
}: SelvstendigNæringsdrivendeFormProps) => {
  const intl = useIntl();

  React.useEffect(
    () => () => {
      clearSelvstendigValues();
    },
    [],
  );

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={`${fieldArrayId}.${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}`}
          readOnly={readOnly}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={`${fieldArrayId}.${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN}`}
          htmlSize={14}
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
          readOnly={readOnly}
        />
      </div>
      {!erFrilanser && (
        <div className={styles.fieldContainer}>
          <InputField
            name={`${fieldArrayId}.${SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN}`}
            htmlSize={14}
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
            readOnly={readOnly}
          />
        </div>
      )}
    </>
  );
};

export default SelvstendigNæringsdrivendeForm;
