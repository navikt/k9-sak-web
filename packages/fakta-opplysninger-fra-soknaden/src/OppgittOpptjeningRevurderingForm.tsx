import { DatepickerField } from '@fpsak-frontend/form';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  dateFormat,
  hasValidDate,
  hasValidInteger,
  hasValidText,
  ISO_DATE_FORMAT,
  maxLength,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { Behandling, SubmitCallback } from '@k9-sak-web/types';
import OpplysningerFraSøknaden from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { TabsPure } from 'nav-frontend-tabs';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, FieldArray, InjectedFormProps, untouch as reduxFormUntouch } from 'redux-form';
import { startdatoErISøknadsperiode } from './validators';
import styles from './opplysningerFraSoknadenForm.less';
import SøknadsperiodeFieldArrayComponent, {
  buildInitialValuesForSøknadsperiode,
  inntektIsValid,
  lagOppgittArbeidsforholdForSøknadsperioden,
  lagOppgittEgenNæringForSøknadsperioden,
  lagOppgittFrilansForSøknadsperioden,
  lagPeriodeForOppgittEgenNæringFørSøkerperioden,
  nyoppstartetDatoIsValid,
} from './SøknadsperiodeFieldArrayComponent';
import OppgittOpptjeningRevurderingFormValues from './types/OppgittOpptjeningRevurderingFormValues';
import SøknadFormValue from './types/SøknadFormValue';
import oppgittOpptjeningRevurderingFormName from './formName';

const fieldArrayName = SøknadFormValue.SØKNADSPERIODER;

interface Props {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
  validate: (arg1: any, arg2: any) => object;
}

const transformValues = (
  formValues: OppgittOpptjeningRevurderingFormValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  const egenNæringBruttoInntekt =
    formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019] ||
    formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];
  const skalOppgiNæringsinntektFørSøknadsperioden = formValues[SøknadFormValue.SØKNADSPERIODER].some(
    ({ selvstendigNaeringsdrivende_startdatoForSoknaden }) => !!selvstendigNaeringsdrivende_startdatoForSoknaden,
  );
  const { søknadsperioder } = formValues;

  const resultingData = {
    kode: aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
    begrunnelse: formValues.begrunnelse,
    søknadsperiodeOgOppgittOpptjeningDto: {
      førSøkerPerioden: {
        oppgittEgenNæring: skalOppgiNæringsinntektFørSøknadsperioden
          ? [
              {
                periode: lagPeriodeForOppgittEgenNæringFørSøkerperioden(formValues, opplysningerFraSøknaden),
                bruttoInntekt: {
                  verdi: +egenNæringBruttoInntekt,
                },
              },
            ]
          : null,
        oppgittFrilans: opplysningerFraSøknaden.førSøkerPerioden.oppgittFrilans,
      },
      måneder: søknadsperioder.map((currentSøknadsperiode, søknadsperiodeIndex) => {
        const opprinneligTomDato = opplysningerFraSøknaden.måneder[søknadsperiodeIndex].måned.tom;
        const { måned } = opplysningerFraSøknaden.måneder[søknadsperiodeIndex];
        return {
          måned,
          oppgittIMåned: {
            oppgittEgenNæring: lagOppgittEgenNæringForSøknadsperioden(currentSøknadsperiode, opprinneligTomDato),
            oppgittFrilans: lagOppgittFrilansForSøknadsperioden(currentSøknadsperiode, opprinneligTomDato),
            oppgittArbeidsforhold: lagOppgittArbeidsforholdForSøknadsperioden(
              måned,
              currentSøknadsperiode.inntektSomArbeidstaker,
            ),
          },
          søkerFL: currentSøknadsperiode.harSøktSomFrilanser,
          søkerSN: currentSøknadsperiode.harSøktSomSSN,
        };
      }),
    },
  };

  return resultingData;
};

const OppgittOpptjeningRevurderingForm = (props: Props & InjectedFormProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formIsEditable, setFormIsEditable] = React.useState(false);
  const intl = useIntl();

  const {
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    kanEndrePåSøknadsopplysninger,
    oppgittOpptjening,
  } = props;

  const handleSubmit = e => {
    const promise = props.handleSubmit(e);
    if (promise && promise.catch) {
      promise.catch(() => null);
    }
  };

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
          label: `${dateFormat(currentOppgittOpptjening.måned.fom)} - ${dateFormat(
            currentOppgittOpptjening.måned.tom,
          )}`,
        }))}
        onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
      />
      <div className={styles.tabContent}>
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
      </div>

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
      <div className={styles.fieldContainer}>
        <DatepickerField
          name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO}
          validate={[hasValidDate]}
          defaultValue={null}
          readOnly={formIsEditable}
          label={<Label input={{ id: 'OpplysningerFraSoknaden.NyoppstartetDato', args: {} }} intl={intl} />}
        />
      </div>
      {!formIsEditable && (
        <div className={styles.begrunnelseContainer}>
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

const validateFieldArray = (fieldArrayList, oppgittOpptjening: OpplysningerFraSøknaden) => {
  const errors = {};
  fieldArrayList.forEach((fieldArrayItem, index) => {
    const { måned } = oppgittOpptjening.måneder[index];

    const harSøktSomSSN = fieldArrayItem[SøknadFormValue.HAR_SØKT_SOM_SSN];
    const harSøktSomFrilanser = fieldArrayItem[SøknadFormValue.HAR_SØKT_SOM_FRILANSER];

    if (harSøktSomSSN) {
      const ssnInntekt = fieldArrayItem[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN];
      const ssnStartdato = fieldArrayItem[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
      const ssnInntektValidation = [required(ssnInntekt), hasValidInteger(ssnInntekt), (v => maxLength(5)(v))()];
      const ssnStartdatoValidation = [
        required(ssnStartdato),
        hasValidDate(ssnStartdato),
        maxLength(5)(ssnInntekt),
        startdatoErISøknadsperiode(ssnStartdato, måned),
      ];

      const inntektError = ssnInntektValidation.find(v => Array.isArray(v));
      if (inntektError !== undefined) {
        errors[
          `${fieldArrayName}[${index}].${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN}`
        ] = inntektError;
      }
      const startdatoError = ssnStartdatoValidation.find(v => Array.isArray(v));
      if (startdatoError !== undefined) {
        errors[
          `${fieldArrayName}[${index}].${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}`
        ] = startdatoError;
      }

      if (!harSøktSomFrilanser) {
        const frilansinntekt = fieldArrayItem[SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN];
        const frilansinntektValidation = [hasValidInteger(frilansinntekt), maxLength(5)(frilansinntekt)];
        const frilansinntektError = frilansinntektValidation.find(v => Array.isArray(v));
        if (frilansinntektError !== undefined) {
          errors[
            `${fieldArrayName}[${index}].${SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN}`
          ] = frilansinntektError;
        }
      }
    }

    if (harSøktSomFrilanser) {
      const frilansInntekt = fieldArrayItem[SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN];
      const frilansStartdato = fieldArrayItem[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
      const frilansInntektValidation = [
        required(frilansInntekt),
        hasValidInteger(frilansInntekt),
        maxLength(5)(frilansInntekt),
      ];
      const frilansStartdatoValidation = [
        required(frilansStartdato),
        hasValidDate(frilansStartdato),
        startdatoErISøknadsperiode(frilansStartdato, måned),
      ];

      const inntektError = frilansInntektValidation.find(v => Array.isArray(v));
      if (inntektError !== undefined) {
        errors[`${fieldArrayName}[${index}].${SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN}`] = inntektError;
      }
      const startdatoError = frilansStartdatoValidation.find(v => Array.isArray(v));
      if (startdatoError !== undefined) {
        errors[`${fieldArrayName}[${index}].${SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN}`] = startdatoError;
      }

      if (!harSøktSomSSN) {
        const næringsinntektIFrilansperiode =
          fieldArrayItem[SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS];
        const næringsinntektValidation = [
          hasValidInteger(næringsinntektIFrilansperiode),
          maxLength(5)(næringsinntektIFrilansperiode),
        ];
        const næringsinntektError = næringsinntektValidation.find(v => Array.isArray(v));
        if (næringsinntektError !== undefined) {
          errors[
            `${fieldArrayName}[${index}].${SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS}`
          ] = næringsinntektError;
        }
      }
    }
  });
  return errors;
};

const validateForm = (values: OppgittOpptjeningRevurderingFormValues, oppgittOpptjening: OpplysningerFraSøknaden) => {
  const nyoppstartetDato = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO];
  const inntekt2019 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
  const inntekt2020 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];

  const errors = {};

  const nyoppstartetDatoValidation = nyoppstartetDatoIsValid(nyoppstartetDato, inntekt2019, inntekt2020);
  if (nyoppstartetDatoValidation !== null) {
    errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO] = nyoppstartetDatoValidation;
  }

  const inntekt2019Validation = inntektIsValid(inntekt2019, inntekt2020);
  if (inntekt2019Validation !== null) {
    errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019] = inntekt2019Validation;
  }
  const inntekt2020Validation = inntektIsValid(inntekt2019, inntekt2020);
  if (inntekt2020Validation !== null) {
    errors[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020] = inntekt2020Validation;
  }

  let fieldArrayValidation = {};
  if (values[fieldArrayName] && oppgittOpptjening && oppgittOpptjening.måneder) {
    fieldArrayValidation = validateFieldArray(values[fieldArrayName], oppgittOpptjening);
  }

  const allErrors = { ...errors, ...fieldArrayValidation };
  return allErrors;
};

const mapStateToProps = (state, props) => {
  const { oppgittOpptjening, submitCallback } = props;
  const onSubmit = formValues => {
    return new Promise((resolve, reject) => {
      const errors = validateForm(formValues, props.oppgittOpptjening);
      if (!errors || Object.keys(errors).length === 0) {
        return resolve(submitCallback([transformValues(formValues, props.oppgittOpptjening)]));
      }
      return reject(errors);
    });
  };
  const initialValues = buildInitialValues(oppgittOpptjening);
  const validate = values => {
    const validationResult = validateForm(values, oppgittOpptjening);
    return validationResult;
  };
  return () => ({ initialValues, onSubmit, validate });
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
  })(OppgittOpptjeningRevurderingForm),
);

export default connectedComponent;
