import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.module.css';
import SøknadFormValue from './types/SøknadFormValue';

interface FrilanserFormProps {
  erSelvstendigNæringsdrivende: boolean;
  readOnly: boolean;
  clearFrilansValues: () => void;
  fieldArrayId: string;
}

const FrilanserForm = ({
  erSelvstendigNæringsdrivende,
  readOnly,
  clearFrilansValues,
  fieldArrayId,
}: FrilanserFormProps) => {
  const intl = useIntl();

  React.useEffect(
    () => () => {
      clearFrilansValues();
    },
    [],
  );

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={`${fieldArrayId}.${SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN}`}
          readOnly={readOnly}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={`${fieldArrayId}.${SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN}`}
          htmlSize={14}
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
          readOnly={readOnly}
        />
      </div>
      {!erSelvstendigNæringsdrivende && (
        <div className={styles.fieldContainer}>
          <InputField
            name={`${fieldArrayId}.${SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS}`}
            htmlSize={14}
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
            readOnly={readOnly}
          />
        </div>
      )}
    </>
  );
};

export default FrilanserForm;
