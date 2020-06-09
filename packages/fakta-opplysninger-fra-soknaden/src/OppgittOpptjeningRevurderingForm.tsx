import { DatepickerField } from '@fpsak-frontend/form';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import {
  hasValidDate,
  hasValidInteger,
  hasValidText,
  maxLength,
  minLength,
  required,
  ISO_DATE_FORMAT,
} from '@fpsak-frontend/utils';
import { Behandling, SubmitCallback } from '@k9-sak-web/types';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import classNames from 'classnames';
import { Knapp } from 'nav-frontend-knapper';
import { TabsPure } from 'nav-frontend-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray, InjectedFormProps, untouch as reduxFormUntouch } from 'redux-form';
import moment from 'moment';
import styles from './opplysningerFraSoknadenForm.less';
import SøknadsperiodeFieldArrayComponent, {
  buildInitialValuesForSøknadsperiode,
} from './SøknadsperiodeFieldArrayComponent';
import SøknadFormValue from './types/OpplysningerFraSoknadenTypes';

const fieldArrayName = SøknadFormValue.SØKNADSPERIODER;

interface Props {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
}

const OppgittOpptjeningRevurderingForm = (props: Props & InjectedFormProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formIsEditable, setFormIsEditable] = React.useState(false);
  const intl = useIntl();

  const {
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    // harApneAksjonspunkter,
    kanEndrePåSøknadsopplysninger,
    oppgittOpptjening,
    // submitCallback,
    // submittable,
    handleSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit}>
      {kanEndrePåSøknadsopplysninger && (
        <Knapp
          className={styles.formUnlockButton}
          type="hoved"
          htmlType="button"
          onClick={() => setFormIsEditable(!formIsEditable)}
        >
          {formIsEditable ? 'Lås opp skjema' : 'Lås skjema'}
        </Knapp>
      )}
      <TabsPure
        tabs={oppgittOpptjening.måneder.map((currentOppgittOpptjening, currentOppgittOpptjeningIndex) => ({
          aktiv: activeTab === currentOppgittOpptjeningIndex,
          label: `Søknadsperiode ${currentOppgittOpptjeningIndex + 1}`,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      <FieldArray
        component={SøknadsperiodeFieldArrayComponent}
        props={{
          måneder: oppgittOpptjening.måneder,
          formIsEditable,
          kanEndrePåSøknadsopplysninger,
          behandlingId,
          behandlingVersjon,
          formChange: reduxFormChange,
          formUntouch: reduxFormUntouch,
          aktivMånedIndeks: activeTab,
        }}
        name={SøknadFormValue.SØKNADSPERIODER}
      />
      <div className={styles.fieldContainer}>
        <InputField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
          validate={[hasValidInteger]}
          readOnly={formIsEditable}
        />
      </div>
      <div className={styles.fieldContainer}>
        <InputField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
          bredde="S"
          label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
          validate={[hasValidInteger]}
          readOnly={formIsEditable}
        />
      </div>
      <div className={styles.nyoppstartetContainer}>
        <DatepickerField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO}
          validate={[hasValidDate]}
          defaultValue={null}
          readOnly={formIsEditable}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.NyoppstartetDato', args: {} }} intl={intl} />}
        />
      </div>
      {!formIsEditable && (
        <div className={classNames('begrunnelseContainer')}>
          <TextAreaField
            name={SøknadFormValue.BEGRUNNELSE}
            label={{ id: 'OpplysningerFraSoknaden.Begrunnelse' }}
            validate={[required, minLength(3), maxLength(2000), hasValidText]}
            readOnly={formIsEditable}
            aria-label={intl.formatMessage({
              id: 'OpplysningerFraSoknaden.Begrunnelse',
            })}
          />
        </div>
      )}
      {kanEndrePåSøknadsopplysninger && !formIsEditable && (
        <>
          <Knapp htmlType="submit" type="hoved">
            Bekreft og fortsett
          </Knapp>
          <Knapp
            onClick={() => {
              // eslint-disable-next-line no-self-assign
              window.location = window.location;
            }}
            htmlType="button"
            style={{ marginLeft: '8px', marginTop: '2px' }}
          >
            Tilbakestill skjema (OBS! Relaster siden)
          </Knapp>
        </>
      )}
    </form>
  );
};

export const oppgittOpptjeningRevurderingFormName = 'OpplysningerFraSoknadenForm';

const transformValues = (formValues, oppgittOpptjening) => {};

const buildInitialValues = (values: OpplysningerFraSøknaden) => {
  const { førSøkerPerioden } = values;

  const næringFørSøknadsperioden =
    førSøkerPerioden?.oppgittEgenNæring.length > 0 ? førSøkerPerioden.oppgittEgenNæring : null;
  const næringsinntektFørSøknadsperioden = næringFørSøknadsperioden
    ? næringFørSøknadsperioden[0].bruttoInntekt.verdi
    : null;
  const inntektsperiodenFørSøknadsperiodeErI2019 = næringFørSøknadsperioden
    ? moment(næringFørSøknadsperioden[0].periode.tom, ISO_DATE_FORMAT).year() === 2019
    : false;
  const inntektsperiodenFørSøknadsperiodeErI2020 = næringFørSøknadsperioden
    ? moment(næringFørSøknadsperioden[0].periode.tom, ISO_DATE_FORMAT).year() === 2020
    : false;

  return {
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: inntektsperiodenFørSøknadsperiodeErI2019
      ? næringsinntektFørSøknadsperioden
      : null,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: inntektsperiodenFørSøknadsperiodeErI2020
      ? næringsinntektFørSøknadsperioden
      : null,

    [fieldArrayName]: values.måneder.map(måned => buildInitialValuesForSøknadsperiode(måned)),
  };
};

const mapStateToProps = (state, props) => {
  const { submitCallback, oppgittOpptjening } = props;
  const onSubmit = formValues => submitCallback([transformValues(formValues, oppgittOpptjening)]);
  const initialValues = buildInitialValues(oppgittOpptjening);
  return state => ({ onSubmit, initialValues });
};

const mapDispatchToProps = dispatch => ({
  ...bindActionCreators(
    {
      reduxFormChange,
      reduxFormUntouch,
    },
    dispatch,
  ),
});

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  behandlingForm({
    form: oppgittOpptjeningRevurderingFormName,
    // validate: values => {
    //   const nyoppstartetDato = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO];
    //   const inntekt2019 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
    //   const inntekt2020 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];

    //   const errors = {};

    //   const nyoppstartetDatoValidation = nyoppstartetDatoIsValid(nyoppstartetDato, inntekt2019, inntekt2020);
    //   if (nyoppstartetDatoValidation !== null) {
    //     errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO] = nyoppstartetDatoValidation;
    //   }

    //   const inntekt2019Validation = inntektIsValid(inntekt2019, inntekt2020);
    //   if (inntekt2019Validation !== null) {
    //     errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019] = inntekt2019Validation;
    //   }
    //   const inntekt2020Validation = inntektIsValid(inntekt2019, inntekt2020);
    //   if (inntekt2020Validation !== null) {
    //     errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020] = inntekt2020Validation;
    //   }

    //   return errors;
    // },
  })(OppgittOpptjeningRevurderingForm),
);

export default connectedComponent;
