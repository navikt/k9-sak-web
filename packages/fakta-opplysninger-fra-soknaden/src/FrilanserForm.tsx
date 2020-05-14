import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required, hasValidInteger, maxLength } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.less';
import SøknadFormValue from './types/OpplysningerFraSoknadenTypes';

interface FrilanserFormProps {
  erSelvstendigNæringsdrivende: boolean;
  startdatoValidator: (startdato: string) => void;
  readOnly: boolean;
  clearFrilansValues: () => void;
}

const FrilanserForm = ({
  erSelvstendigNæringsdrivende,
  startdatoValidator,
  readOnly,
  clearFrilansValues,
}: FrilanserFormProps) => {
  const intl = useIntl();

  React.useEffect(() => {
    return () => {
      clearFrilansValues();
    };
  }, []);

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN}
          validate={[required, hasValidDate, startdatoValidator]}
          defaultValue={null}
          readOnly={readOnly}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
          validate={[required, hasValidInteger, maxLength(5)]}
          readOnly={readOnly}
        />
      </div>
      {!erSelvstendigNæringsdrivende && (
        <div className={styles.fieldContainer}>
          <InputField
            name={SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
            validate={[hasValidInteger, maxLength(5)]}
            readOnly={readOnly}
          />
        </div>
      )}
    </>
  );
};

export default FrilanserForm;
