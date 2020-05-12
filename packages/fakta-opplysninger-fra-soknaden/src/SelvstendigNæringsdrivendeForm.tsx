import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required, ISO_DATE_FORMAT, hasValidInteger } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import moment from 'moment';
import styles from './opplysningerFraSoknadenForm.less';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';

interface SelvstendigNæringsdrivendeFormProps {
  erFrilanser: boolean;
  selvstendigNæringsdrivendeInntekt2019: boolean;
  selvstendigNæringsdrivendeInntekt2020: boolean;
  startdatoValidator: (startdato: string) => void;
  readOnly: boolean;
}

const startdatoIsValid = (startdato, selvstendigNæringsdrivendeInntekt2019, selvstendigNæringsdrivendeInntekt2020) => {
  const startdatoObject = moment(startdato, ISO_DATE_FORMAT);
  const startdatoErI2019 = startdatoObject.year() === 2019;
  const startdatoErI2020 = startdatoObject.year() === 2020;
  if (selvstendigNæringsdrivendeInntekt2019 && !startdatoErI2019) {
    return [{ id: 'ValidationMessage.InvalidDate' }];
  }
  if (selvstendigNæringsdrivendeInntekt2020 && !startdatoErI2020) {
    return [{ id: 'ValidationMessage.InvalidDate' }];
  }
  return null;
};

const inntektIsValid = (selvstendigNæringsdrivendeInntekt2019, selvstendigNæringsdrivendeInntekt2020) => {
  if (selvstendigNæringsdrivendeInntekt2019 && selvstendigNæringsdrivendeInntekt2020) {
    return [{ id: 'ValidationMessage.InvalidIncome' }];
  }
  if (selvstendigNæringsdrivendeInntekt2019 === undefined && selvstendigNæringsdrivendeInntekt2020 === undefined) {
    return [{ id: 'ValidationMessage.InvalidIncome' }];
  }
  return null;
};

const SelvstendigNæringsdrivendeForm = ({
  erFrilanser,
  selvstendigNæringsdrivendeInntekt2019,
  selvstendigNæringsdrivendeInntekt2020,
  startdatoValidator,
  readOnly,
}: SelvstendigNæringsdrivendeFormProps) => {
  const intl = useIntl();

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}
          validate={[
            required,
            hasValidDate,
            startdato =>
              startdatoIsValid(startdato, selvstendigNæringsdrivendeInntekt2019, selvstendigNæringsdrivendeInntekt2020),
            startdatoValidator,
          ]}
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
            validate={[hasValidInteger, inntekt => inntektIsValid(inntekt, selvstendigNæringsdrivendeInntekt2020)]}
            readOnly={readOnly}
          />
        </div>
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
            validate={[hasValidInteger, inntekt => inntektIsValid(selvstendigNæringsdrivendeInntekt2019, inntekt)]}
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
