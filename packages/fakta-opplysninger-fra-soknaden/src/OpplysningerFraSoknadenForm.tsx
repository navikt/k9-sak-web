import { behandlingForm, behandlingFormValueSelector, getBehandlingFormPrefix } from '@fpsak-frontend/form';
import { Label } from '@fpsak-frontend/form/src/Label';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
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
    behandlingId,
    behandlingVersjon,
    submittable,
    harApneAksjonspunkter,
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
  const [erSkjemaetLåst, setErSkjemaetLåst] = React.useState(true);
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
      {kanEndrePåSøknadsopplysninger && erSkjemaetLåst && (
        <Knapp className={styles.formUnlockButton} type="hoved" onClick={() => setErSkjemaetLåst(!erSkjemaetLåst)}>
          Lås opp
        </Knapp>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className={classNames('formContainer', {
            'formContainer--showBorder': erSelvstendigNæringsdrivende,
            'formContainer--hidden': !skalViseSSNSeksjonen,
          })}
        >
          {erSkjemaetLåst ? (
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
              readOnly={erSkjemaetLåst}
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
          {erSkjemaetLåst ? (
            <Element>
              <FormattedMessage id="OpplysningerFraSoknaden.frilanser" />
            </Element>
          ) : (
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
              readOnly={erSkjemaetLåst}
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
              readOnly={erSkjemaetLåst}
              aria-label={intl.formatMessage({
                id: 'OpplysningerFraSoknaden.Begrunnelse',
              })}
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-self-assign
            window.location = window.location;
          }}
        >
          Avbryt (relaster siden)
        </button>
        <FaktaSubmitButton
          buttonTextId="SubmitButton.ConfirmInformation"
          formName={formName}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={erSkjemaetLåst}
          hasOpenAksjonspunkter={harApneAksjonspunkter}
        />
      </form>
    </div>
  );
};

interface TransformValues {
  [OpplysningerFraSoknadenValues.BEGRUNNELSE]: string;
  [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN_SOM_SELVSTENDIG_NÆRINGSDRIVENDE]: number;
  [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]: number;
  [OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: number;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: number;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN_SOM_FRILANSER]: number;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]: number;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]: string;
  [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_NYOPPSTARTET_DATO]: string;
}

const byggPeriodeMedInntekt = (startdato, sluttdato, inntekt) => ({
  periode: {
    fom: startdato,
    tom: sluttdato,
  },
  bruttoInntekt: {
    verdi: inntekt,
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
  if (values.frilanser_inntektISoknadsperioden) {
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
  if (values.selvstendigNaeringsdrivende_inntektISoknadsperiodenSomFrilanser) {
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
  if (values.selvstendigNaeringsdrivende_nyoppstartetDato) {
    const erNyOppstartetI2019 =
      moment(values.selvstendigNaeringsdrivende_nyoppstartetDato, ISO_DATE_FORMAT).year() === 2019;
    return {
      fom: values.selvstendigNaeringsdrivende_nyoppstartetDato,
      tom: erNyOppstartetI2019 ? '2019-12-31' : '2020-02-29',
    };
  }
  return { ...opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring[0].periode };
};

const transformValues = (values: TransformValues, opplysningerFraSøknaden: OpplysningerFraSøknaden) => {
  const egenNæringBruttoInntekt =
    values.selvstendigNaeringsdrivende_inntekt2019 || values.selvstendigNaeringsdrivende_inntekt2020;
  const skalOppgiNæringsinntektFørSøknadsperioden =
    opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring?.length > 0 ||
    values.selvstendigNaeringsdrivende_nyoppstartetDato;

  return {
    kode: aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
    begrunnelse: values.begrunnelse,
    søknadsperiodeOgOppgittOpptjeningDto: {
      førSøkerPerioden: {
        oppgittEgenNæring: skalOppgiNæringsinntektFørSøknadsperioden
          ? [
              {
                periode: getPeriodeForOppgittEgenNæringFørSøkerperioden(values, opplysningerFraSøknaden),
                bruttoInntekt: {
                  verdi: egenNæringBruttoInntekt,
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
};

const buildInitialValues = (values: OpplysningerFraSøknaden) => {
  const { søkerYtelseForNæring, søkerYtelseForFrilans, periodeFraSøknad, førSøkerPerioden, iSøkerPerioden } = values;

  const frilansoppdrag = iSøkerPerioden?.oppgittFrilans?.oppgittFrilansoppdrag;
  const frilansoppdragStartdato = frilansoppdrag ? frilansoppdrag[0].periode.fom : null;
  const frilansoppdragBruttoinntekt = frilansoppdrag ? frilansoppdrag[0].bruttoInntekt.verdi : null;

  const næring = iSøkerPerioden?.oppgittEgenNæring;
  const næringStartdato = næring ? næring[0].periode.fom : null;
  const næringBruttoinntekt = næring ? næring[0].bruttoInntekt.verdi : null;

  const næringFørSøknadsperioden = førSøkerPerioden?.oppgittEgenNæring;
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

const connectedComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  behandlingForm({
    form: formName,
  })(OpplysningerFraSoknadenForm),
);

export default connectedComponent;
