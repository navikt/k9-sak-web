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
  clearSelvstendigValues: () => void;
}

const nyoppstartetDatoIsValid = (
  nyoppstartetDato,
  selvstendigNæringsdrivendeInntekt2019,
  selvstendigNæringsdrivendeInntekt2020,
) => {
  if (!nyoppstartetDato) {
    return null;
  }
  const nyoppstartetDatoObject = moment(nyoppstartetDato, ISO_DATE_FORMAT);
  const nyoppstartetDatoErI2019 = nyoppstartetDatoObject.year() === 2019;
  const nyoppstartetDatoErI2020 = nyoppstartetDatoObject.year() === 2020;

  if (selvstendigNæringsdrivendeInntekt2019 && !nyoppstartetDatoErI2019) {
    return [{ id: 'ValidationMessage.InvalidNyoppstartetDate' }];
  }
  if (selvstendigNæringsdrivendeInntekt2020 && !nyoppstartetDatoErI2020) {
    return [{ id: 'ValidationMessage.InvalidNyoppstartetDate' }];
  }
  if (selvstendigNæringsdrivendeInntekt2020 && nyoppstartetDatoErI2020) {
    if (nyoppstartetDatoObject.isAfter('2020-02-29')) {
      return [{ id: 'ValidationMessage.InvalidNyoppstartetDateSoknadsperiode' }];
    }
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
            validate={[
              hasValidDate,
              nyoppstartetDato =>
                nyoppstartetDatoIsValid(
                  nyoppstartetDato,
                  selvstendigNæringsdrivendeInntekt2019,
                  selvstendigNæringsdrivendeInntekt2020,
                ),
            ]}
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
