import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required, hasValidInteger } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.less';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';

interface SelvstendigNæringsdrivendeFormProps {
  erFrilanser: boolean;
  selvstendigNæringsdrivendeInntekt2019: boolean;
  selvstendigNæringsdrivendeInntekt2020: boolean;
  startdatoValidator: (startdato: string) => void;
  readOnly: boolean;
  clearSelvstendigValues: () => void;
}

const SelvstendigNæringsdrivendeForm = ({
  erFrilanser,
  startdatoValidator,
  readOnly,
  clearSelvstendigValues,
}: SelvstendigNæringsdrivendeFormProps) => {
  const intl = useIntl();

  React.useEffect(() => {
    return () => {
      clearSelvstendigValues();
    };
  }, []);

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}
          validate={[required, hasValidDate, startdatoValidator]}
          defaultValue={null}
          readOnly={readOnly}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.inntektContainer}>
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
            validate={[hasValidInteger]}
            readOnly={readOnly}
          />
        </div>
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
            validate={[hasValidInteger]}
            readOnly={readOnly}
          />
        </div>
        <div className={styles.nyoppstartetContainer}>
          <DatepickerField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO}
            validate={[hasValidDate]}
            defaultValue={null}
            readOnly={readOnly}
            label={<Label input={{ id: 'OpplysningerFraSoknaden.NyoppstartetDato', args: {} }} intl={intl} />}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
          validate={[required, hasValidInteger]}
          readOnly={readOnly}
        />
      </div>
      {!erFrilanser && (
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN_SOM_FRILANSER}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
            validate={[hasValidInteger]}
            readOnly={readOnly}
          />
        </div>
      )}
    </>
  );
};

export default SelvstendigNæringsdrivendeForm;
