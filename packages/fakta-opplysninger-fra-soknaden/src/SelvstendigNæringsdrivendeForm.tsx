import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.less';

interface SelvstendigNæringsdrivendeFormProps {
  erFrilanser: boolean;
}

const SelvstendigNæringsdrivendeForm = ({ erFrilanser }: SelvstendigNæringsdrivendeFormProps) => {
  const intl = useIntl();

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name="selvstendigNaeringsdrivende_startdatoForSoknaden"
          validate={[required, hasValidDate]}
          defaultValue={null}
          readOnly={false} // TODO (Hallvard): endre til readOnly
          label={
            <Label
              input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }}
              // typographyElement={Element}
              intl={intl}
            />
          }
        />
      </div>
      <div className={styles.inntektContainer}>
        <div className={styles.fieldContainer}>
          <InputField
            name="selvstendigNaeringsdrivende_inntekt2019"
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
            validate={[required]}
          />
        </div>
        <div className={styles.fieldContainer}>
          <InputField
            name="selvstendigNaeringsdrivende_inntekt2020"
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
            validate={[required]}
          />
        </div>
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name="selvstendigNaeringsdrivende_inntektISoknadsperioden"
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
          validate={[required]}
        />
      </div>
      {erFrilanser && (
        <div className={styles.fieldContainer}>
          <InputField
            name="selvstendigNaeringsdrivende_inntektISoknadsperiodenSomFrilanser"
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
