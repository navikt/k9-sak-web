import { DatepickerField } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import TextAreaField from '@fpsak-frontend/form/src/TextAreaField';
import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  ISO_DATE_FORMAT,
  dateFormat,
  hasValidDate,
  hasValidDecimalMaxNumberOfDecimals,
  hasValidText,
  maxLength,
  maxValue,
  minLength,
  required,
} from '@fpsak-frontend/utils';
import { Aksjonspunkt, Behandling, SubmitCallback } from '@k9-sak-web/types';
import OpplysningerFraSøknaden, { Måned } from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import moment from 'moment';
import { Knapp } from 'nav-frontend-knapper';
import { TabsPure } from 'nav-frontend-tabs';
import React from 'react';
import { useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { FieldArray, InjectedFormProps, change as reduxFormChange, untouch as reduxFormUntouch } from 'redux-form';
import SøknadsperiodeFieldArrayComponent, {
  buildInitialValuesForSøknadsperiode,
  inntektIsValid,
  lagOppgittArbeidsforholdForSøknadsperioden,
  lagOppgittEgenNæringForSøknadsperioden,
  lagOppgittFrilansForSøknadsperioden,
  lagPeriodeForOppgittEgenNæringFørSøkerperioden,
  nyoppstartetDatoIsValid,
} from './SøknadsperiodeFieldArrayComponent';
import oppgittOpptjeningRevurderingFormName from './formName';
import styles from './opplysningerFraSoknadenForm.module.css';
import OppgittOpptjeningRevurderingFormValues from './types/OppgittOpptjeningRevurderingFormValues';
import SøknadFormValue from './types/SøknadFormValue';
import { startdatoErISøknadsperiode } from './validators';

const fieldArrayName = SøknadFormValue.SØKNADSPERIODER;

interface Props {
  readOnly: boolean;
  behandling: Behandling;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  harApneAksjonspunkter: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  oppgittOpptjening: OpplysningerFraSøknaden;
  validate: (arg1: any, arg2: any) => any;
}

const transformValues = (
  formValues: OppgittOpptjeningRevurderingFormValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  const egenNæringBruttoInntekt =
    formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019] ||
    formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];
  const skalOppgiNæringsinntektFørSøknadsperioden = formValues[SøknadFormValue.SØKNADSPERIODER].some(
    // eslint-disable-next-line camelcase
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

interface StateProps {
  harSøktSomSSN: boolean;
}

const OppgittOpptjeningRevurderingForm = (props: Partial<Props> & InjectedFormProps & StateProps) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const [formIsEditable, setFormIsEditable] = React.useState(false);
  const intl = useIntl();

  const {
    behandling: { id: behandlingId, versjon: behandlingVersjon },
    kanEndrePåSøknadsopplysninger,
    oppgittOpptjening,
    harSøktSomSSN,
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
      <div className={styles.tabsContainer}>
        <TabsPure
          tabs={oppgittOpptjening.måneder.map((currentOppgittOpptjening, currentOppgittOpptjeningIndex) => ({
            aktiv: activeTab === currentOppgittOpptjeningIndex,
            label: `${dateFormat(currentOppgittOpptjening.måned.fom)} - ${dateFormat(
              currentOppgittOpptjening.måned.tom,
            )}`,
          }))}
          onChange={(e, clickedIndex) => setActiveTab(clickedIndex)}
        />
      </div>
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
      {harSøktSomSSN && (
        <>
          <div className={styles.fieldContainer}>
            <InputField
              name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019}
              bredde="S"
              label={{ id: 'OpplysningerFraSoknaden.Inntekt2019' }}
              readOnly={formIsEditable}
            />
          </div>
          <div className={styles.fieldContainer}>
            <InputField
              name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020}
              bredde="S"
              label={{ id: 'OpplysningerFraSoknaden.Inntekt2020' }}
              readOnly={formIsEditable}
            />
          </div>
          <div className={styles.fieldContainer}>
            <DatepickerField
              name={SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO}
              readOnly={formIsEditable}
              label={<Label input={{ id: 'OpplysningerFraSoknaden.NyoppstartetDato', args: {} }} intl={intl} />}
            />
          </div>
        </>
      )}
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

const buildInitialValues = (values: OpplysningerFraSøknaden, aksjonspunkter: Aksjonspunkt[]) => {
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

  const aksjonspunkt = aksjonspunkter.find(
    ap => ap.definisjon.kode === aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
  );

  return {
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: inntektsperiodenFørSøknadsperiodeErI2019
      ? næringsinntektFørSøknadsperioden
      : null,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: inntektsperiodenFørSøknadsperiodeErI2020
      ? næringsinntektFørSøknadsperioden
      : null,
    [fieldArrayName]: values.måneder.map(måned => buildInitialValuesForSøknadsperiode(måned)),
    [SøknadFormValue.BEGRUNNELSE]: aksjonspunkt ? aksjonspunkt.begrunnelse : null,
  };
};

const validateSSNForm = (formData, måned: Måned) => {
  const errors = {};
  const ssnInntekt = formData[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN];
  const ssnStartdato = formData[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
  const ssnInntektValidation = [
    required(ssnInntekt),
    maxValue(999999)(ssnInntekt),
    hasValidDecimalMaxNumberOfDecimals(2)(ssnInntekt),
    maxLength(9)(ssnInntekt),
  ];
  const ssnStartdatoValidation = [
    required(ssnStartdato),
    hasValidDate(ssnStartdato),
    maxLength(9)(ssnInntekt),
    startdatoErISøknadsperiode(ssnStartdato, måned.måned),
  ];

  const inntektError = ssnInntektValidation.find(v => Array.isArray(v));
  if (inntektError !== undefined) {
    errors[`${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN}`] = inntektError;
  }
  const startdatoError = ssnStartdatoValidation.find(v => Array.isArray(v));
  if (startdatoError !== undefined) {
    errors[`${SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN}`] = startdatoError;
  }

  const harSøktSomFrilanser = formData[SøknadFormValue.HAR_SØKT_SOM_FRILANSER];
  if (!harSøktSomFrilanser) {
    const frilansinntekt = formData[SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN];
    const frilansinntektValidation = [
      hasValidDecimalMaxNumberOfDecimals(2)(frilansinntekt),
      maxValue(999999)(frilansinntekt),
      maxLength(9)(frilansinntekt),
    ];
    if (måned.søkerFL) {
      frilansinntektValidation.push(required(frilansinntekt));
    }
    const frilansinntektError = frilansinntektValidation.find(v => Array.isArray(v));
    if (frilansinntektError !== undefined) {
      errors[`${SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN}`] = frilansinntektError;
    }
  }

  return errors;
};

const validateFrilanserForm = (formData, måned: Måned) => {
  const errors = {};
  const frilansInntekt = formData[SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN];
  const frilansStartdato = formData[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
  const frilansInntektValidation = [
    required(frilansInntekt),
    hasValidDecimalMaxNumberOfDecimals(2)(frilansInntekt),
    maxValue(999999)(frilansInntekt),
    maxLength(9)(frilansInntekt),
  ];
  const frilansStartdatoValidation = [
    required(frilansStartdato),
    hasValidDate(frilansStartdato),
    startdatoErISøknadsperiode(frilansStartdato, måned.måned),
  ];

  const inntektError = frilansInntektValidation.find(v => Array.isArray(v));
  if (inntektError !== undefined) {
    errors[`${SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN}`] = inntektError;
  }
  const startdatoError = frilansStartdatoValidation.find(v => Array.isArray(v));
  if (startdatoError !== undefined) {
    errors[`${SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN}`] = startdatoError;
  }

  const harSøktSomSSN = formData[SøknadFormValue.HAR_SØKT_SOM_SSN];
  if (!harSøktSomSSN) {
    const næringsinntektIFrilansperiode = formData[SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS];
    const næringsinntektValidation = [
      hasValidDecimalMaxNumberOfDecimals(2)(næringsinntektIFrilansperiode),
      maxValue(999999)(næringsinntektIFrilansperiode),
      maxLength(9)(næringsinntektIFrilansperiode),
    ];
    if (måned.søkerSN) {
      næringsinntektValidation.push(required(næringsinntektIFrilansperiode));
    }
    const næringsinntektError = næringsinntektValidation.find(v => Array.isArray(v));
    if (næringsinntektError !== undefined) {
      errors[`${SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS}`] = næringsinntektError;
    }
  }

  return errors;
};

const validateArbeidstakerInntekt = inntekt => {
  const inntektValidation = [
    hasValidDecimalMaxNumberOfDecimals(2)(inntekt),
    maxValue(999999)(inntekt),
    maxLength(9)(inntekt),
  ];
  const inntektError = inntektValidation.find(v => Array.isArray(v));
  if (inntektError !== undefined) {
    return {
      [`${SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER}`]: inntektError,
    };
  }
  return {};
};

const validateFieldArray = (fieldArrayList, oppgittOpptjening: OpplysningerFraSøknaden) => {
  const errors = {};
  errors[SøknadFormValue.SØKNADSPERIODER] = fieldArrayList.map((fieldArrayItem, index) => {
    let arrayErrors = {};
    const måned = oppgittOpptjening.måneder[index];

    const harSøktSomSSN = fieldArrayItem[SøknadFormValue.HAR_SØKT_SOM_SSN];
    if (harSøktSomSSN) {
      const snErrors = validateSSNForm(fieldArrayItem, måned);
      arrayErrors = {
        ...arrayErrors,
        ...snErrors,
      };
    }

    const harSøktSomFrilanser = fieldArrayItem[SøknadFormValue.HAR_SØKT_SOM_FRILANSER];
    if (harSøktSomFrilanser) {
      const frilansErrors = validateFrilanserForm(fieldArrayItem, måned);
      arrayErrors = {
        ...arrayErrors,
        ...frilansErrors,
      };
    }

    const arbeidstakerInntekt = fieldArrayItem[SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER];
    if (arbeidstakerInntekt) {
      arrayErrors = {
        ...arrayErrors,
        ...validateArbeidstakerInntekt(arbeidstakerInntekt),
      };
    }
    return arrayErrors;
  });
  if (errors[SøknadFormValue.SØKNADSPERIODER].some(e => Object.keys(e).length > 0)) {
    return errors;
  }
  return {};
};

const validateForm = (values: OppgittOpptjeningRevurderingFormValues, oppgittOpptjening: OpplysningerFraSøknaden) => {
  const nyoppstartetDato = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO];
  const inntekt2019 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
  const inntekt2020 = values[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];
  const harSøktSomSSN = values?.søknadsperioder?.some(søknadsperiode => søknadsperiode.harSøktSomSSN);

  const errors = {};

  if (harSøktSomSSN) {
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
  }

  let fieldArrayValidation = {};
  if (values[fieldArrayName] && oppgittOpptjening && oppgittOpptjening.måneder) {
    fieldArrayValidation = validateFieldArray(values[fieldArrayName], oppgittOpptjening);
  }

  const allErrors = { ...errors, ...fieldArrayValidation };
  return allErrors;
};

const mapStateToProps = (_, props) => {
  const { submitCallback, oppgittOpptjening, behandlingId, behandlingVersjon, aksjonspunkter } = props;
  const onSubmit = formValues =>
    // For å håndtere validering for deler av formen som ligger i andre måneder enn den som rendres
    new Promise((resolve, reject) => {
      const errors = validateForm(formValues, props.oppgittOpptjening);
      if (!errors || Object.keys(errors).length === 0) {
        resolve(submitCallback([transformValues(formValues, props.oppgittOpptjening)]));
      }
      reject(errors);
    });
  const initialValues = buildInitialValues(oppgittOpptjening, aksjonspunkter);
  const validate = values => {
    const validationResult = validateForm(values, oppgittOpptjening);
    return validationResult;
  };
  return state => {
    const søknadsperiodeFormValues = behandlingFormValueSelector(
      'OpplysningerFraSoknadenForm',
      behandlingId,
      behandlingVersjon,
    )(state, [SøknadFormValue.SØKNADSPERIODER]);
    const harSøktSomSSN = søknadsperiodeFormValues?.some(søknadsperiode => søknadsperiode.harSøktSomSSN);

    return { onSubmit, validate, initialValues, harSøktSomSSN };
  };
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
