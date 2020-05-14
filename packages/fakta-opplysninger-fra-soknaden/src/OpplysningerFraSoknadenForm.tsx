import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { Label } from '@fpsak-frontend/form/src/Label';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { hasValidText, ISO_DATE_FORMAT, maxLength, minLength, required } from '@fpsak-frontend/utils';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import { OpplysningerFraSøknaden, SubmitCallback } from '@k9-sak-web/types';
import classnames from 'classnames/bind';
import moment from 'moment';
import { Checkbox } from 'nav-frontend-skjema';
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
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';

const classNames = classnames.bind(styles);

const startdatoErISøknadsperiode = (startdato, søknadsperiode) => {
  const søknadsperiodeFom = moment(søknadsperiode.fom, ISO_DATE_FORMAT);
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
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN,
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019,
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020,
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO,
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN,
  OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN_SOM_FRILANSER,
];

const frilansFields = [
  OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN,
  OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN,
  OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN_SOM_SELVSTENDIG_NÆRINGSDRIVENDE,
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
  } = props;
  const { søknadsperiode } = initialValues;
  const [erSelvstendigNæringsdrivende, setErSelvstendigNæringsdrivende] = React.useState(
    initialValues.erSelvstendigNæringsdrivende,
  );
  const [erFrilanser, setErFrilanser] = React.useState(initialValues.erFrilanser);
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

  const skalViseSSNSeksjonen = kanEndrePåSøknadsopplysninger || erSelvstendigNæringsdrivende;
  const skalViseFrilansSeksjonen = kanEndrePåSøknadsopplysninger || erFrilanser;

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
            'formContainer--showBorder': erSelvstendigNæringsdrivende,
            'formContainer--hidden': !skalViseSSNSeksjonen,
          })}
        >
          {skjemaErLåst ? (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.selvstendigNæringsdrivende" />
            </Element>
          ) : (
            <Checkbox
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.selvstendigNæringsdrivende', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              onChange={() => setErSelvstendigNæringsdrivende(!erSelvstendigNæringsdrivende)}
              checked={erSelvstendigNæringsdrivende}
            />
          )}
          {erSelvstendigNæringsdrivende && (
            <SelvstendigNæringsdrivendeForm
              erFrilanser={erFrilanser}
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
            'formContainer--showBorder': erFrilanser,
            'formContainer--hidden': !skalViseFrilansSeksjonen,
          })}
        >
          {erFrilanser && skjemaErLåst && (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.frilanser" />
            </Element>
          )}
          {!skjemaErLåst && (
            <Checkbox
              label={
                <Label
                  input={{ id: 'OpplysningerFraSoknaden.frilanser', args: {} }}
                  typographyElement={Element}
                  intl={intl}
                />
              }
              onChange={() => setErFrilanser(!erFrilanser)}
              checked={erFrilanser}
            />
          )}
          {erFrilanser && (
            <FrilanserForm
              erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende}
              startdatoValidator={startdato => startdatoErISøknadsperiode(startdato, søknadsperiode)}
              readOnly={skjemaErLåst}
              clearFrilansValues={clearFrilansValues}
            />
          )}
        </div>
        {(erFrilanser || erSelvstendigNæringsdrivende) && (
          <div className={classNames('begrunnelseContainer')}>
            <TextAreaField
              name={OpplysningerFraSoknadenValues.BEGRUNNELSE}
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
            {(erSelvstendigNæringsdrivende || erFrilanser) && (
              <Knapp htmlType="submit" type="hoved">
                Bekreft og fortsett
              </Knapp>
            )}
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

interface TransformValues {
  [OpplysningerFraSoknadenValues.BEGRUNNELSE]: string;
  [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN_SOM_SELVSTENDIG_NÆRINGSDRIVENDE]: string;
  [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: string;
  [OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN_SOM_FRILANSER]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO]: string;
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

const getOppgittEgenNæringISøkerperioden = (
  values: TransformValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  if (values.selvstendigNaeringsdrivende_inntektISoknadsperioden) {
    return [
      byggPeriodeMedInntekt(
        values.selvstendigNaeringsdrivende_startdatoForSoknaden,
        opplysningerFraSøknaden.periodeFraSøknad.tom,
        values.selvstendigNaeringsdrivende_inntektISoknadsperioden,
      ),
    ];
  }

  if (values.frilanser_inntektISoknadsperiodenSomSelvstendig) {
    return [
      byggPeriodeMedInntekt(
        values.frilanser_startdatoForSoknaden,
        opplysningerFraSøknaden.periodeFraSøknad.tom,
        values.frilanser_inntektISoknadsperiodenSomSelvstendig,
      ),
    ];
  }

  return null;
};

const getOppgittFrilansISøkerperioden = (values: TransformValues, opplysningerFraSøknaden: OpplysningerFraSøknaden) => {
  const frilansInntektISøknadsperioden = values.frilanser_inntektISoknadsperioden
    ? `${values.frilanser_inntektISoknadsperioden}`.trim()
    : null;
  if (frilansInntektISøknadsperioden) {
    return {
      oppgittFrilansoppdrag: [
        byggPeriodeMedInntekt(
          values.frilanser_startdatoForSoknaden,
          opplysningerFraSøknaden.periodeFraSøknad.tom,
          values.frilanser_inntektISoknadsperioden,
        ),
      ],
    };
  }

  const ssnInntektISøknadsperioden = values.selvstendigNaeringsdrivende_inntektISoknadsperiodenSomFrilanser
    ? `${values.selvstendigNaeringsdrivende_inntektISoknadsperiodenSomFrilanser}`.trim()
    : null;
  if (ssnInntektISøknadsperioden) {
    return {
      oppgittFrilansoppdrag: [
        byggPeriodeMedInntekt(
          values.selvstendigNaeringsdrivende_startdatoForSoknaden,
          opplysningerFraSøknaden.periodeFraSøknad.tom,
          values.selvstendigNaeringsdrivende_inntektISoknadsperiodenSomFrilanser,
        ),
      ],
    };
  }
  return null;
};

const getPeriodeForOppgittEgenNæringFørSøkerperioden = (
  values: TransformValues,
  opplysningerFraSøknaden: OpplysningerFraSøknaden,
) => {
  const inntekt2019 = values[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
  const næringFørSøknadsperioden = opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring;
  const inntektsperiodeFørSøknadsperioden = næringFørSøknadsperioden[0].periode;

  const { fom, tom } = inntektsperiodeFørSøknadsperioden;
  const opprinneligInntektsperiodeErI2019 = moment(fom, ISO_DATE_FORMAT).year() === 2019;
  const { selvstendigNaeringsdrivende_nyoppstartetDato } = values;

  const periode: any = {};
  if (inntekt2019) {
    if (opprinneligInntektsperiodeErI2019) {
      periode.fom = selvstendigNaeringsdrivende_nyoppstartetDato || fom;
      periode.tom = tom;
    } else {
      periode.fom = selvstendigNaeringsdrivende_nyoppstartetDato || '2019-01-01';
      periode.tom = '2019-12-31';
    }
  } else {
    // eslint-disable-next-line no-lonely-if
    if (opprinneligInntektsperiodeErI2019) {
      periode.fom = selvstendigNaeringsdrivende_nyoppstartetDato || '2020-01-01';
      periode.tom = '2020-02-29';
    } else {
      periode.fom = selvstendigNaeringsdrivende_nyoppstartetDato || fom;
      periode.tom = tom;
    }
  }

  return periode;
};

const transformValues = (values: TransformValues, opplysningerFraSøknaden: OpplysningerFraSøknaden) => {
  const egenNæringBruttoInntekt =
    values.selvstendigNaeringsdrivende_inntekt2019 || values.selvstendigNaeringsdrivende_inntekt2020;
  const skalOppgiNæringsinntektFørSøknadsperioden =
    opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring?.length > 0 ||
    values.selvstendigNaeringsdrivende_nyoppstartetDato;

  const resultingData = {
    kode: aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
    begrunnelse: values.begrunnelse,
    søknadsperiodeOgOppgittOpptjeningDto: {
      førSøkerPerioden: {
        oppgittEgenNæring: skalOppgiNæringsinntektFørSøknadsperioden
          ? [
              {
                periode: getPeriodeForOppgittEgenNæringFørSøkerperioden(values, opplysningerFraSøknaden),
                bruttoInntekt: {
                  verdi: +egenNæringBruttoInntekt,
                },
              },
            ]
          : null,
        oppgittFrilans: opplysningerFraSøknaden.førSøkerPerioden.oppgittFrilans,
      },
      iSøkerPerioden: {
        oppgittEgenNæring: getOppgittEgenNæringISøkerperioden(values, opplysningerFraSøknaden),
        oppgittFrilans: getOppgittFrilansISøkerperioden(values, opplysningerFraSøknaden),
      },
      periodeFraSøknad: opplysningerFraSøknaden.periodeFraSøknad,
      søkerYtelseForFrilans: !!values.frilanser_inntektISoknadsperioden,
      søkerYtelseForNæring: !!values.selvstendigNaeringsdrivende_inntektISoknadsperioden,
    },
  };

  return resultingData;
};

const buildInitialValues = (values: OpplysningerFraSøknaden) => {
  const { søkerYtelseForNæring, søkerYtelseForFrilans, periodeFraSøknad, førSøkerPerioden, iSøkerPerioden } = values;

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
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: næringStartdato,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: næringBruttoinntekt,
    [OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN]: frilansoppdragStartdato,
    [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: frilansoppdragBruttoinntekt,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: inntektsperiodenFørSøknadsperiodeErI2019
      ? næringsinntektFørSøknadsperioden
      : null,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: inntektsperiodenFørSøknadsperiodeErI2020
      ? næringsinntektFørSøknadsperioden
      : null,
  };
};

const mapStateToProps = (_, props: OpplysningerFraSoknadenFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon, opplysningerFraSøknaden, ...otherProps } = props;
  const onSubmit = (values: TransformValues) => submitCallback([transformValues(values, opplysningerFraSøknaden)]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues(opplysningerFraSøknaden),
    selvstendigNæringsdrivendeInntekt2019: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]),
    selvstendigNæringsdrivendeInntekt2020: !!behandlingFormValueSelector(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state, [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]),
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
  const inntekt2019 = selvstendigNæringsdrivendeInntekt2019 ? `${selvstendigNæringsdrivendeInntekt2019}`.trim() : null;
  const inntekt2020 = selvstendigNæringsdrivendeInntekt2020 ? `${selvstendigNæringsdrivendeInntekt2020}`.trim() : null;
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
      const nyoppstartetDato = values[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO];
      const inntekt2019 = values[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019];
      const inntekt2020 = values[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020];

      const errors = {};

      const nyoppstartetDatoValidation = nyoppstartetDatoIsValid(nyoppstartetDato, inntekt2019, inntekt2020);
      if (nyoppstartetDatoValidation !== null) {
        errors[
          OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO
        ] = nyoppstartetDatoValidation;
      }

      const inntekt2019Validation = inntektIsValid(inntekt2019, inntekt2020);
      if (inntekt2019Validation !== null) {
        errors[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019] = inntekt2019Validation;
      }
      const inntekt2020Validation = inntektIsValid(inntekt2019, inntekt2020);
      if (inntekt2020Validation !== null) {
        errors[OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020] = inntekt2020Validation;
      }

      return errors;
    },
  })(OpplysningerFraSoknadenForm),
);

export default connectedComponent;
