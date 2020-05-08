import { behandlingForm, DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { hasValidDate, required } from '@fpsak-frontend/utils';
import { SubmitCallback } from '@k9-sak-web/types';
import { Checkbox } from 'nav-frontend-skjema';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import styles from './opplysningerFraSoknadenForm.less';

const mock = {
  søknadId: '100-abc',
  søknadsperiode: '2020-04-01/2020-04-30',
  versjon: '1.0.0',
  mottattDato: '2020-04-20T07:15:36.124Z',
  søker: {
    norskIdentitetsnummer: '12345678901',
  },
  inntekter: {
    frilanser: {
      inntekterSøknadsperiode: {
        '2020-04-01/2020-04-21': {
          beløp: '100000.00',
        },
      },
    },
    selvstendig: {
      inntekterFør: {
        '../2020-02-21': {
          beløp: '100000.00',
        },
        '2020-02-22/2020-03-12': {
          beløp: '100000.00',
        },
      },
      inntekterSøknadsperiode: {
        '2020-04-05/2020-04-16': {
          beløp: '0.00',
        },
        '2020-04-17/2020-04-30': {
          beløp: '10000.00',
        },
      },
    },
  },
  språk: 'nb',
};

interface OpplysningerFraSoknadenFormProps {
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
}

interface InitialValues {
  erSelvstendigNæringsdrivende: boolean;
  erFrilanser: boolean;
}

interface StateProps {
  initialValues: InitialValues;
}

const formName = 'OpplysningerFraSoknadenForm';

const OpplysningerFraSoknadenForm = (props: OpplysningerFraSoknadenFormProps & InjectedFormProps & StateProps) => {
  const intl = useIntl();
  const { handleSubmit, initialValues, behandlingId, behandlingVersjon, submittable } = props;
  const [erSelvstendigNæringsdrivende, setErSelvstendigNæringsdrivende] = React.useState(
    initialValues.erSelvstendigNæringsdrivende,
  );
  const [erFrilanser, setErFrilanser] = React.useState(initialValues.erFrilanser);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={styles.formContainer}>
          <Checkbox
            name="erSelvstendigNæringsdrivende"
            label="Selvstendig næringsdrivende"
            disabled={false} // TODO (Hallvard): endre til readOnly
            onChange={() => setErSelvstendigNæringsdrivende(!erSelvstendigNæringsdrivende)}
            checked={erSelvstendigNæringsdrivende}
          />
          {erSelvstendigNæringsdrivende && (
            <>
              <div className={styles.fieldContainer}>
                <DatepickerField
                  name="startdatoForSoknadenSelvstendig"
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
                    name="inntekt2019"
                    bredde="S"
                    label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
                    validate={[required]}
                  />
                </div>
                <div className={styles.fieldContainer}>
                  <InputField
                    name="inntekt2020"
                    bredde="S"
                    label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
                    validate={[required]}
                  />
                </div>
              </div>
              <div className={styles.fieldContainer}>
                <InputField
                  name="inntektISoknadsperiodenSelvstendig"
                  bredde="S"
                  label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
                  validate={[required]}
                />
              </div>
              {erFrilanser && (
                <div className={styles.fieldContainer}>
                  <InputField
                    name="inntektISoknadsperiodenFrilanser"
                    bredde="S"
                    label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
                    validate={[required]}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className={styles.formContainer}>
          <Checkbox
            name="erFrilanser"
            label="Frilanser"
            disabled={false} // TODO (Hallvard): endre til readOnly
            onChange={() => setErFrilanser(!erFrilanser)}
            checked={erFrilanser}
          />
          {erFrilanser && (
            <>
              <div className={styles.fieldContainer}>
                <DatepickerField
                  name="startdatoForSoknadenFrilanser"
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
              <div className={styles.fieldContainer}>
                <InputField
                  name="inntektISoknadsperiodenFrilanser"
                  bredde="S"
                  label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenFrilanser' }}
                  validate={[required]}
                />
              </div>
              {erSelvstendigNæringsdrivende && (
                <div className={styles.fieldContainer}>
                  <InputField
                    name="inntektISoknadsperiodenSelvstendig"
                    bredde="S"
                    label={{ id: 'OpplysningerFraSoknaden.InntektISoknadsperiodenSelvstendig' }}
                    validate={[required]}
                  />
                </div>
              )}
            </>
          )}
        </div>
        <FaktaSubmitButton
          buttonTextId="SubmitButton.ConfirmInformation"
          formName={formName}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={false} // TODO (Hallvard) sett til readOnly
          hasOpenAksjonspunkter={false}
        />
      </form>
    </div>
  );
};

const transformValues = values => values;

const buildInitialValues = values => {
  const { inntekter } = values;
  return {
    erSelvstendigNæringsdrivende: !!inntekter.selvstendig,
    erFrilanser: !!inntekter.frilanser,
    // startdatoSoknadSelvstendigNaeringsdrivende: !!inntekter.selvstendig ? values
  };
};

const mapStateToProps = (_, props: OpplysningerFraSoknadenFormProps) => {
  const { submitCallback } = props;
  const onSubmit = values => submitCallback([transformValues(values)]);

  return () => ({
    onSubmit,
    initialValues: buildInitialValues(mock),
  });
};

const connectedComponent = connect(mapStateToProps)(
  behandlingForm({
    form: formName,
  })(OpplysningerFraSoknadenForm),
);

export default connectedComponent;
