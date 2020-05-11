import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.less';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';

interface SelvstendigNæringsdrivendeFormProps {
  erFrilanser: boolean;
}

const SelvstendigNæringsdrivendeForm = ({ erFrilanser }: SelvstendigNæringsdrivendeFormProps) => {
  const intl = useIntl();

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}
          validate={[required, hasValidDate]}
          defaultValue={null}
          readOnly={false} // TODO (Hallvard): endre til readOnly
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.inntektContainer}>
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
            validate={[required]}
          />
        </div>
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
            validate={[required]}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
          validate={[required]}
        />
      </div>
      {erFrilanser && (
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN_SOM_FRILANSER}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
            validate={[required]}
          />
        </div>
      )}
    </>
  );
};

export default SelvstendigNæringsdrivendeForm;
