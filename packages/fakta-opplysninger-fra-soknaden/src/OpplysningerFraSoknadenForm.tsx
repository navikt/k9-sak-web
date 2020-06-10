import {
  behandlingForm,
  behandlingFormValueSelector,
  getBehandlingFormPrefix,
  CheckboxField,
} from '@fpsak-frontend/form';
import { Label } from '@fpsak-frontend/form/src/Label';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { hasValidText, ISO_DATE_FORMAT, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import { OpplysningerFraSøknaden, SubmitCallback } from '@k9-sak-web/types';
import classnames from 'classnames/bind';
import moment from 'moment';
import { Element } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { change as reduxFormChange, InjectedFormProps, untouch as reduxFormUntouch } from 'redux-form';
import { Knapp } from 'nav-frontend-knapper';
import TextAreaField from '../../form/src/TextAreaField';
import FrilanserForm from './FrilanserForm';
import styles from './opplysningerFraSoknadenForm.less';
import SelvstendigNæringsdrivendeForm from './SelvstendigNæringsdrivendeForm';
import SøknadFormValue from './types/OpplysningerFraSoknadenTypes';

const classNames = classnames.bind(styles);

const fomDatoBegrensning = søknadsperiodeFom => {
  const march30th = moment('2020-03-30', ISO_DATE_FORMAT);
  if (søknadsperiodeFom.isBefore(march30th)) {
    return march30th;
  }
  return søknadsperiodeFom;
};

const startdatoErISøknadsperiode = (startdato, søknadsperiode) => {
  const søknadsperiodeFom = fomDatoBegrensning(moment(søknadsperiode.fom, ISO_DATE_FORMAT));
  const søknadsperiodeTom = moment(søknadsperiode.tom, ISO_DATE_FORMAT);
  const startdatoMoment = moment(startdato, ISO_DATE_FORMAT);
  if (startdatoMoment.isSameOrAfter(søknadsperiodeFom) && startdatoMoment.isSameOrBefore(søknadsperiodeTom)) {
    return null;
  }
  return [
    { id: 'ValidationMessage.InvalidStartdato' },
    { fom: søknadsperiodeFom.format(DDMMYYYY_DATE_FORMAT), tom: søknadsperiodeTom.format(DDMMYYYY_DATE_FORMAT) },
  ];
};

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

interface OpplysningerFraSoknadenFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  harApneAksjonspunkter: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
  kanEndrePåSøknadsopplysninger: boolean;
  opplysningerFraSøknaden: OpplysningerFraSøknaden;
}

interface InitialValues {
  erSelvstendigNæringsdrivende: boolean;
  erFrilanser: boolean;
  søknadsperiode: { fom: string; tom: string };
}

interface StateProps {
  initialValues: InitialValues;
  selvstendigNæringsdrivendeInntekt2019: boolean;
  selvstendigNæringsdrivendeInntekt2020: boolean;
  harSøktSomFrilanser: boolean;
  harSøktSomSSN: boolean;
  reduxFormChange: (formName: string, fieldName: string, value: any) => void;
  reduxFormUntouch: (formName: string, fieldName: string) => void;
  behandlingFormPrefix: string;
}

const formName = 'OpplysningerFraSoknadenForm';

const OpplysningerFraSoknadenForm = (props: OpplysningerFraSoknadenFormProps & InjectedFormProps & StateProps) => {
  const intl = useIntl();
  const {
    handleSubmit,
    initialValues,
    selvstendigNæringsdrivendeInntekt2019,
    selvstendigNæringsdrivendeInntekt2020,
    kanEndrePåSøknadsopplysninger,
    reduxFormChange: formChange,
    reduxFormUntouch: formUntouch,
    behandlingFormPrefix,
    harSøktSomFrilanser,
    harSøktSomSSN,
  } = props;
  const { søknadsperiode } = initialValues;
  const [skjemaErLåst, setSkjemaErLåst] = React.useState(true);
  const formSelector = `${behandlingFormPrefix}.${formName}`;

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

  const skalViseSSNSeksjonen = kanEndrePåSøknadsopplysninger || harSøktSomSSN;
  const skalViseFrilansSeksjonen = kanEndrePåSøknadsopplysninger || harSøktSomFrilanser;

  return (
    <div>
      {kanEndrePåSøknadsopplysninger && (
        <Knapp
          className={styles.formUnlockButton}
          type="hoved"
          htmlType="button"
          onClick={() => setSkjemaErLåst(!skjemaErLåst)}
        >
          {skjemaErLåst ? 'Lås opp skjema' : 'Lås skjema'}
        </Knapp>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className={classNames('formContainer', {
            'formContainer--showBorder': harSøktSomSSN,
            'formContainer--hidden': !skalViseSSNSeksjonen,
          })}
        >
          {harSøktSomSSN && skjemaErLåst && (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.selvstendigNæringsdrivende" />
            </Element>
          )}
          {!skjemaErLåst && (
            <CheckboxField
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.selvstendigNæringsdrivende', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              name={SøknadFormValue.HAR_SØKT_SOM_SSN}
            />
          )}
          {harSøktSomSSN && (
            <SelvstendigNæringsdrivendeForm
              erFrilanser={harSøktSomFrilanser}
              selvstendigNæringsdrivendeInntekt2019={selvstendigNæringsdrivendeInntekt2019}
              selvstendigNæringsdrivendeInntekt2020={selvstendigNæringsdrivendeInntekt2020}
              startdatoValidator={startdato => startdatoErISøknadsperiode(startdato, søknadsperiode)}
              readOnly={skjemaErLåst}
              clearSelvstendigValues={clearSelvstendigValues}
            />
          )}
        </div>
        <div
          className={classNames('formContainer', {
            'formContainer--showBorder': harSøktSomFrilanser,
            'formContainer--hidden': !skalViseFrilansSeksjonen,
          })}
        >
          {harSøktSomFrilanser && skjemaErLåst && (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.frilanser" />
            </Element>
          )}
          {!skjemaErLåst && (
            <CheckboxField
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.frilanser', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              name={SøknadFormValue.HAR_SØKT_SOM_FRILANSER}
            />
          )}
          {harSøktSomFrilanser && (
            <FrilanserForm
              erSelvstendigNæringsdrivende={harSøktSomSSN}
              startdatoValidator={startdato => startdatoErISøknadsperiode(startdato, søknadsperiode)}
              readOnly={skjemaErLåst}
              clearFrilansValues={clearFrilansValues}
            />
          )}
        </div>
        {!skjemaErLåst && (
          <div className={classNames('begrunnelseContainer')}>
            <TextAreaField
              name={SøknadFormValue.BEGRUNNELSE}
              label={{ id: 'OpplysningerFraSoknaden.Begrunnelse' }}
              validate={[required, minLength(3), maxLength(2000), hasValidText]}
              readOnly={skjemaErLåst}
              aria-label={intl.formatMessage({
                id: 'OpplysningerFraSoknaden.Begrunnelse',
              })}
            />
          </div>
        )}
        {kanEndrePåSøknadsopplysninger && !skjemaErLåst && (
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
    </div>
  );
};

interface OpplysningerFraSøknadenFormValues {
  [SøknadFormValue.BEGRUNNELSE]: string;
  [SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN]: string;
  [SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: string;
  [SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: string;
  [SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: string;
  [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO]: string;
  [SøknadFormValue.HAR_SØKT_SOM_FRILANSER]: boolean;
  [SøknadFormValue.HAR_SØKT_SOM_SSN]: boolean;
}

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

const getFormValueSafely = (propertyName: SøknadFormValue, formValues: OpplysningerFraSøknadenFormValues) => {
  const formValue = formValues[propertyName];
  return getValueSafely(formValue);
};

const lagOppgittEgenNæringForSøknadsperioden = (
  formValues: OpplysningerFraSøknadenFormValues,
  opprinneligeSøknadsopplysninger: OpplysningerFraSøknaden,
) => {
  const opprinneligTomDato = opprinneligeSøknadsopplysninger.periodeFraSøknad.tom;

  const næringsinntekt = getFormValueSafely(
    SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN,
    formValues,
  );
  if (næringsinntekt !== null) {
    const fomDato = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
    return [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, næringsinntekt)];
  }

  const næringsinntektISøknadsperiodeForFrilans = getFormValueSafely(
    SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS,
    formValues,
  );
  if (næringsinntektISøknadsperiodeForFrilans !== null) {
    const fomDato = formValues[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
    return [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, næringsinntektISøknadsperiodeForFrilans)];
  }

  return null;
};

const lagOppgittFrilansForSøknadsperioden = (formValues, opprinneligeSøknadsopplysninger: OpplysningerFraSøknaden) => {
  const opprinneligTomDato = opprinneligeSøknadsopplysninger.periodeFraSøknad.tom;

  const frilansinntekt = getFormValueSafely(SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN, formValues);
  if (frilansinntekt !== null) {
    const fomDato = formValues[SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN];
    return { oppgittFrilansoppdrag: [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, frilansinntekt)] };
  }

  const frilansinntektISøknadsperiodeForSSN = getFormValueSafely(
    SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN,
    formValues,
  );
  if (frilansinntektISøknadsperiodeForSSN !== null) {
    const fomDato = formValues[SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN];
    return {
      oppgittFrilansoppdrag: [byggPeriodeMedInntekt(fomDato, opprinneligTomDato, frilansinntektISøknadsperiodeForSSN)],
    };
  }

  return null;
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

const lagPeriodeForOppgittEgenNæringFørSøkerperioden = (
  formValues: OpplysningerFraSøknadenFormValues,
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

const transformValues = (
  formValues: OpplysningerFraSøknadenFormValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  const egenNæringBruttoInntekt =
    formValues.selvstendigNaeringsdrivende_inntekt2019 || formValues.selvstendigNaeringsdrivende_inntekt2020;
  const skalOppgiNæringsinntektFørSøknadsperioden = !!formValues.selvstendigNaeringsdrivende_startdatoForSoknaden;
  const søkerYtelseForFrilans = formValues[SøknadFormValue.HAR_SØKT_SOM_FRILANSER];
  const søkerYtelseForNæring = formValues[SøknadFormValue.HAR_SØKT_SOM_SSN];

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
      iSøkerPerioden: {
        oppgittEgenNæring: lagOppgittEgenNæringForSøknadsperioden(formValues, opplysningerFraSøknaden),
        oppgittFrilans: lagOppgittFrilansForSøknadsperioden(formValues, opplysningerFraSøknaden),
      },
      periodeFraSøknad: opplysningerFraSøknaden.periodeFraSøknad,
      søkerYtelseForFrilans,
      søkerYtelseForNæring,
    },
  };

  return resultingData;
};

const buildInitialValues = (values: OpplysningerFraSøknaden) => {
  const { søkerYtelseForFrilans, søkerYtelseForNæring, periodeFraSøknad, førSøkerPerioden, iSøkerPerioden } = values;

  const frilansoppdrag = iSøkerPerioden?.oppgittFrilans?.oppgittFrilansoppdrag;
  const harFrilansoppdrag = frilansoppdrag && frilansoppdrag.length > 0;
  const frilansoppdragStartdato = harFrilansoppdrag ? frilansoppdrag[0].periode.fom : null;
  const frilansoppdragBruttoinntekt = harFrilansoppdrag ? frilansoppdrag[0].bruttoInntekt.verdi : null;

  const næring = iSøkerPerioden?.oppgittEgenNæring;
  const harNæring = næring && næring.length > 0;
  const næringStartdato = harNæring ? næring[0].periode.fom : null;
  const næringBruttoinntekt = harNæring ? næring[0].bruttoInntekt.verdi : null;

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
    erSelvstendigNæringsdrivende: søkerYtelseForNæring,
    erFrilanser: søkerYtelseForFrilans,
    søknadsperiode: periodeFraSøknad,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: næringStartdato,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: næringBruttoinntekt,
    [SøknadFormValue.FRILANSER_STARTDATO_FOR_SØKNADEN]: frilansoppdragStartdato,
    [SøknadFormValue.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: frilansoppdragBruttoinntekt,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: inntektsperiodenFørSøknadsperiodeErI2019
      ? næringsinntektFørSøknadsperioden
      : null,
    [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: inntektsperiodenFørSøknadsperiodeErI2020
      ? næringsinntektFørSøknadsperioden
      : null,
    [SøknadFormValue.FRILANSINNTEKT_I_SØKNADSPERIODE_FOR_SSN]:
      !søkerYtelseForFrilans && frilansoppdragBruttoinntekt ? frilansoppdragBruttoinntekt : null,
    [SøknadFormValue.NÆRINGSINNTEKT_I_SØKNADSPERIODE_FOR_FRILANS]:
      !søkerYtelseForNæring && næringBruttoinntekt ? næringBruttoinntekt : null,
    [SøknadFormValue.HAR_SØKT_SOM_FRILANSER]: søkerYtelseForFrilans || false,
    [SøknadFormValue.HAR_SØKT_SOM_SSN]: søkerYtelseForNæring || false,
  };
};

const mapStateToProps = (_, props: OpplysningerFraSoknadenFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon, opplysningerFraSøknaden, ...otherProps } = props;
  const onSubmit = (formValues: OpplysningerFraSøknadenFormValues) => {
    const values = transformValues(formValues, opplysningerFraSøknaden);
    submitCallback([values]);
  };

  return state => ({
    onSubmit,
    initialValues: buildInitialValues(opplysningerFraSøknaden),
    selvstendigNæringsdrivendeInntekt2019: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]),
    selvstendigNæringsdrivendeInntekt2020: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [SøknadFormValue.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]),
    harSøktSomSSN: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [SøknadFormValue.HAR_SØKT_SOM_SSN]),
    harSøktSomFrilanser: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [SøknadFormValue.HAR_SØKT_SOM_FRILANSER]),
    behandlingFormPrefix: getBehandlingFormPrefix(behandlingId, behandlingVersjon),
    ...otherProps,
  });
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

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  behandlingForm({
    form: formName,
    validate: values => {
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

      return errors;
    },
  })(OpplysningerFraSoknadenForm),
);

export default connectedComponent;
