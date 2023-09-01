import { behandlingFormValueSelector, CheckboxField, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import InputField from '@fpsak-frontend/form/src/InputField';
import { Label } from '@fpsak-frontend/form/src/Label';
import { ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import { OpplysningerFraSøknaden, SubmitCallback } from '@k9-sak-web/types';
import { Måned, Periode } from '@k9-sak-web/types/src/opplysningerFraSoknaden';
import classnames from 'classnames/bind';
import moment from 'moment';
import { Element } from 'nav-frontend-typografi';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { WrappedFieldArrayProps } from 'redux-form';
import oppgittOpptjeningRevurderingFormName from './formName';
import FrilanserForm from './FrilanserForm';
import styles from './opplysningerFraSoknadenForm.module.css';
import SelvstendigNæringsdrivendeForm from './SelvstendigNæringsdrivendeForm';
import OppgittOpptjeningRevurderingFormValues from './types/OppgittOpptjeningRevurderingFormValues';
import SøknadFormValue from './types/SøknadFormValue';
import SøknadsperiodeFormValues from './types/SøknadsperiodeFormValues';

const classNames = classnames.bind(styles);
const formName = oppgittOpptjeningRevurderingFormName;

const selvstendigNæringsdrivendeFields = [
  SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN,
  SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019,
  SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020,
  SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO,
  SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN,
  SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS,
];

const frilansFields = [
  SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN,
  SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN,
  SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN,
];

const erBeløpSatt = beløp => beløp || beløp === 0;

export const buildInitialValuesForSøknadsperiode = (values: Måned) => {
  const { søkerFL, søkerSN, oppgittIMåned } = values;

  const frilansoppdrag = oppgittIMåned?.oppgittFrilans?.oppgittFrilansoppdrag;
  const harFrilansoppdrag = frilansoppdrag && frilansoppdrag.length > 0;
  const frilansoppdragStartdato = harFrilansoppdrag ? frilansoppdrag[0].periode.fom : null;
  const frilansoppdragBruttoinntekt = harFrilansoppdrag ? frilansoppdrag[0].bruttoInntekt.verdi : null;

  const næring = oppgittIMåned?.oppgittEgenNæring;
  const harNæring = næring && næring.length > 0;
  const næringStartdato = harNæring ? næring[0].periode.fom : null;
  const næringBruttoinntekt = harNæring ? næring[0].bruttoInntekt.verdi : null;

  const arbeidsforhold = oppgittIMåned?.oppgittArbeidsforhold;
  const harArbeidsforhold = arbeidsforhold && arbeidsforhold.length > 0;
  const arbeidsforholdBruttoinntekt = harArbeidsforhold ? arbeidsforhold[0].inntekt.verdi : null;

  return {
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: næringStartdato,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: næringBruttoinntekt,
    [SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN]: frilansoppdragStartdato,
    [SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: frilansoppdragBruttoinntekt,

    [SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN]:
      !søkerFL && erBeløpSatt(frilansoppdragBruttoinntekt) ? frilansoppdragBruttoinntekt : null,
    [SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS]:
      !søkerSN && erBeløpSatt(næringBruttoinntekt) ? næringBruttoinntekt : null,
    [SøknadFormValue.HAR_SØKT_SOM_FRILANSER]: søkerFL || false,
    [SøknadFormValue.HAR_SØKT_SOM_SSN]: søkerSN || false,
    [SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER]: arbeidsforholdBruttoinntekt,
  };
};

interface SøknadsperiodeFieldArrayComponentProps {
  behandlingId: number;
  behandlingVersjon: number;
  harApneAksjonspunkter: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  opplysningerFraSøknaden: OpplysningerFraSøknaden;
  formIsEditable: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  aktivMånedIndeks: number;
  måneder: Måned[];
}

interface InitialValues {
  søknadsperiode: { fom: string; tom: string };
}

interface StateProps {
  initialValues: InitialValues;
  selvstendigNæringsdrivendeInntekt2019: boolean;
  selvstendigNæringsdrivendeInntekt2020: boolean;
  harSøktSomFrilanser: boolean;
  harSøktSomSSN: boolean;
  formChange: (formName: string, fieldName: string, value: any) => void;
  formUntouch: (formName: string, fieldName: string) => void;
  behandlingFormPrefix: string;
  søknadsperiodeFormValues: SøknadsperiodeFormValues;
}

const SøknadsperiodeFieldArrayComponent = (
  props: SøknadsperiodeFieldArrayComponentProps & StateProps & WrappedFieldArrayProps,
) => {
  const intl = useIntl();
  const {
    kanEndrePåSøknadsopplysninger,
    formChange,
    formUntouch,
    behandlingFormPrefix,
    formIsEditable,
    fields,
    aktivMånedIndeks,
    søknadsperiodeFormValues,
    måneder,
  } = props;
  const formSelector = `${behandlingFormPrefix}.${formName}`;
  const { harSøktSomSSN, harSøktSomFrilanser } = søknadsperiodeFormValues;
  const resetFormField = field => {
    formChange(formSelector, field, null);
    formUntouch(formSelector, field);
  };

  const clearSelvstendigValues = () => {
    selvstendigNæringsdrivendeFields.forEach(field => resetFormField(field));
  };

  const clearFrilansValues = () => {
    frilansFields.forEach(field => resetFormField(field));
  };

  return fields.map((field, fieldArrayIndex) => {
    const skalViseSSNSeksjonen = kanEndrePåSøknadsopplysninger || harSøktSomSSN;
    const skalViseFrilansSeksjonen = kanEndrePåSøknadsopplysninger || harSøktSomFrilanser;
    const { måned } = måneder[fieldArrayIndex];
    const startdatoForPeriodenErEtterApril = moment(måned.fom).isAfter('2020-04-30');

    return (
      <div style={{ display: fieldArrayIndex !== aktivMånedIndeks ? 'none' : 'block' }} key={field}>
        <div
          className={classNames('formContainer', 'formContainer--showBorder', {
            'formContainer--hidden': !skalViseSSNSeksjonen,
          })}
        >
          {harSøktSomSSN && formIsEditable && (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.selvstendigNæringsdrivende" />
            </Element>
          )}
          {!formIsEditable && (
            <CheckboxField
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.selvstendigNæringsdrivende', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              name={`${field}.${SøknadFormValue.HAR_SØKT_SOM_SSN}`}
            />
          )}
          {harSøktSomSSN && (
            <SelvstendigNæringsdrivendeForm
              erFrilanser={harSøktSomFrilanser}
              readOnly={formIsEditable}
              clearSelvstendigValues={clearSelvstendigValues}
              fieldArrayId={field}
            />
          )}
        </div>
        <div
          className={classNames('formContainer', {
            'formContainer--hidden': !skalViseFrilansSeksjonen,
            'formContainer--showBorder': startdatoForPeriodenErEtterApril,
          })}
        >
          {harSøktSomFrilanser && formIsEditable && (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.frilanser" />
            </Element>
          )}
          {!formIsEditable && (
            <CheckboxField
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.frilanser', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              name={`${field}.${SøknadFormValue.HAR_SØKT_SOM_FRILANSER}`}
            />
          )}
          {harSøktSomFrilanser && (
            <FrilanserForm
              erSelvstendigNæringsdrivende={harSøktSomSSN}
              readOnly={formIsEditable}
              clearFrilansValues={clearFrilansValues}
              fieldArrayId={field}
            />
          )}
        </div>
        {startdatoForPeriodenErEtterApril && (
          <div className={classNames('formContainer')}>
            <div className={styles.fieldContainer}>
              <InputField
                name={`${field}.${SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER}`}
                bredde="S"
                label={{ id: 'OpplysningerFraSoknaden.inntektSomArbeidstaker' }}
                readOnly={formIsEditable}
              />
            </div>
          </div>
        )}
      </div>
    );
  });
};

const byggPeriodeMedInntekt = (startdato, sluttdato, inntekt) => ({
  periode: {
    fom: startdato,
    tom: sluttdato,
  },
  bruttoInntekt: {
    verdi: +inntekt,
  },
});

const getValueSafely = value => {
  if (value || value === 0) {
    return `${value}`.trim();
  }
  return null;
};

const getFormValueSafely = (propertyName: SøknadFormValue, formValues: Partial<SøknadsperiodeFormValues>) => {
  const formValue = formValues[propertyName];
  return getValueSafely(formValue);
};

export const lagOppgittEgenNæringForSøknadsperioden = (
  formValues: SøknadsperiodeFormValues,
  opprinneligTomDato: string,
) => {
  const harSøktSomSN = formValues[SøknadFormValue.HAR_SØKT_SOM_SSN] === true;

  const næringsinntekt = getFormValueSafely(
    SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN,
    formValues,
  );
  if (næringsinntekt !== null && harSøktSomSN) {
    const fomDato = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
    return [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, næringsinntekt)];
  }

  const næringsinntektISøknadsperiodeForFrilans = getFormValueSafely(
    SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS,
    formValues,
  );
  if (næringsinntektISøknadsperiodeForFrilans !== null && !harSøktSomSN) {
    const fomDato = formValues[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
    return [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, næringsinntektISøknadsperiodeForFrilans)];
  }

  return null;
};

export const lagOppgittFrilansForSøknadsperioden = (formValues, opprinneligTomDato: string) => {
  const harSøktSomFL = formValues[SøknadFormValue.HAR_SØKT_SOM_FRILANSER] === true;

  const frilansinntekt = getFormValueSafely(SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN, formValues);
  if (frilansinntekt !== null && harSøktSomFL) {
    const fomDato = formValues[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
    return { oppgittFrilansoppdrag: [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, frilansinntekt)] };
  }

  const frilansinntektISøknadsperiodeForSSN = getFormValueSafely(
    SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN,
    formValues,
  );
  if (frilansinntektISøknadsperiodeForSSN !== null && !harSøktSomFL) {
    const fomDato = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
    return {
      oppgittFrilansoppdrag: [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, frilansinntektISøknadsperiodeForSSN)],
    };
  }

  return null;
};

export const lagOppgittArbeidsforholdForSøknadsperioden = (måned: Periode, inntekt: string) => {
  const arbeidsinntekt = getFormValueSafely(SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER, {
    [SøknadFormValue.INNTEKT_SOM_ARBEIDSTAKER]: inntekt,
  });
  if (arbeidsinntekt !== null) {
    return [
      {
        periode: måned,
        inntekt: {
          verdi: +arbeidsinntekt,
        },
      },
    ];
  }

  return [];
};

// eslint-disable-next-line consistent-return
const finnOpprinneligPeriodeMedOppgittNæringsinntektFørSøknadsperioden = næringFørSøknadsperioden => {
  const harOppgittNæringsinntektFørSøknadsperioden = næringFørSøknadsperioden && næringFørSøknadsperioden.length > 0;
  if (harOppgittNæringsinntektFørSøknadsperioden) {
    const inntektsperiodeFørSøknadsperioden = næringFørSøknadsperioden[0].periode;
    const { fom, tom } = inntektsperiodeFørSøknadsperioden;
    return {
      fom,
      tom,
    };
  }
};

export const lagPeriodeForOppgittEgenNæringFørSøkerperioden = (
  formValues: OppgittOpptjeningRevurderingFormValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  const næringFørSøknadsperioden = opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring;
  const opprinneligPeriode = finnOpprinneligPeriodeMedOppgittNæringsinntektFørSøknadsperioden(næringFørSøknadsperioden);

  const fom = opprinneligPeriode?.fom;
  const tom = opprinneligPeriode?.tom;
  const opprinneligInntektsperiodeErI2019 = moment(fom, ISO_DATE_FORMAT).year() === 2019;
  const opprinneligInntektsperiodeErI2020 = moment(fom, ISO_DATE_FORMAT).year() === 2020;

  const periode: any = {};
  const inntekt2019 = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
  const nyoppstartetDato = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO];
  if (inntekt2019) {
    if (opprinneligInntektsperiodeErI2019) {
      periode.fom = nyoppstartetDato || fom || '2019-01-01';
      periode.tom = tom || '2019-12-31';
    } else {
      periode.fom = nyoppstartetDato || '2019-01-01';
      periode.tom = '2019-12-31';
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (opprinneligInntektsperiodeErI2020) {
      periode.fom = nyoppstartetDato || fom || '2020-01-01';
      periode.tom = tom || '2020-02-29';
    } else {
      periode.fom = nyoppstartetDato || '2020-01-01';
      periode.tom = '2020-02-29';
    }
  }

  return periode;
};

const mapStateToProps = (state, props: SøknadsperiodeFieldArrayComponentProps) => {
  const { behandlingId, behandlingVersjon, aktivMånedIndeks } = props;

  const søknadsperiodeFormValues = behandlingFormValueSelector(
    'OpplysningerFraSoknadenForm',
    behandlingId,
    behandlingVersjon,
  )(state, [SøknadFormValue.SØKNADSPERIODER])[aktivMånedIndeks];

  return {
    søknadsperiodeFormValues,
    behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
  };
};

export const nyoppstartetDatoIsValid = (
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

export const inntektIsValid = (selvstendigNæringsdrivendeInntekt2019, selvstendigNæringsdrivendeInntekt2020) => {
  const inntekt2019 = getValueSafely(selvstendigNæringsdrivendeInntekt2019);
  const inntekt2020 = getValueSafely(selvstendigNæringsdrivendeInntekt2020);
  if (inntekt2019 && inntekt2020) {
    return [{ id: 'ValidationMessage.InvalidIncome' }];
  }
  if (!inntekt2019 && !inntekt2020) {
    return [{ id: 'ValidationMessage.MissingIncome' }];
  }
  return null;
};

// @ts-ignore Fiks denne!
const connectedComponent = connect(mapStateToProps)(SøknadsperiodeFieldArrayComponent);

export default connectedComponent;
