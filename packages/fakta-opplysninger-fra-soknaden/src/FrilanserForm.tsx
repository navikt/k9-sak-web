import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import * as React from 'react';
import { useIntl } from 'react-intl';
import styles from './opplysningerFraSoknadenForm.less';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';

interface FrilanserFormProps {
  erSelvstendigNæringsdrivende: boolean;
}

const FrilanserForm = ({ erSelvstendigNæringsdrivende }: FrilanserFormProps) => {
  const intl = useIntl();

  return (
    <>
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN}
          validate={[required, hasValidDate]}
          defaultValue={null}
          readOnly={false} // TODO (Hallvard): endre til readOnly
          label={<Label input={{ id: 'OpplysningerFraSoknaden.startdatoForSoknanden', args: {} }} intl={intl} />}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
          validate={[required]}
        />
      </div>
      {erSelvstendigNæringsdrivende && (
        <div className={styles.fieldContainer}>
          <InputField
            name={OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN_SOM_SELVSTENDIG_NÆRINGSDRIVENDE}
            bredde="S"
            label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
            validate={[required]}
          />
        </div>
      )}
    </>
  );
};

export default FrilanserForm;
