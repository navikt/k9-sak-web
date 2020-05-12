import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { SubmitCallback, OpplysningerFraSøknaden } from '@k9-sak-web/types';
import { Checkbox } from 'nav-frontend-skjema';
import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import classnames from 'classnames/bind';
import { useIntl, FormattedMessage } from 'react-intl';
import { Label } from '@fpsak-frontend/form/src/Label';
import { Element } from 'nav-frontend-typografi';
import { required, minLength, maxLength, hasValidText, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FrilanserForm from './FrilanserForm';
import styles from './opplysningerFraSoknadenForm.less';
import SelvstendigNæringsdrivendeForm from './SelvstendigNæringsdrivendeForm';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';
import TextAreaField from '../../form/src/TextAreaField';

const classNames = classnames.bind(styles);

const mock = {};

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

interface OpplysningerFraSoknadenFormProps {
  readOnly: boolean;
  behandlingId: number;
  behandlingVersjon: number;
  harApneAksjonspunkter: boolean;
  submitCallback: (props: SubmitCallback[]) => void;
  submittable: boolean;
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
    readOnly,
  } = props;
  const { søknadsperiode } = initialValues;
  const [erSelvstendigNæringsdrivende, setErSelvstendigNæringsdrivende] = React.useState(
    initialValues.erSelvstendigNæringsdrivende,
  );
  const [erFrilanser, setErFrilanser] = React.useState(initialValues.erFrilanser);
  const [erSkjemaetLåst, setErSkjemaetLåst] = React.useState(true);

  return (
    <div>
      {!readOnly && erSkjemaetLåst && (
        <button type="button" onClick={() => setErSkjemaetLåst(false)}>
          Lås opp
        </button>
      )}
      <form onSubmit={handleSubmit}>
        <div className={classNames('formContainer', { showBorder: erSelvstendigNæringsdrivende })}>
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
            />
          )}
        </div>
        <div className={classNames('formContainer', { showBorder: erFrilanser })}>
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
}

const transformValues = (values: TransformValues, opplysningerFraSøknaden: OpplysningerFraSøknaden) => ({
  kode: aksjonspunktCodes.OVERSTYRING_FRISINN_OPPGITT_OPPTJENING,
  begrunnelse: values.begrunnelse,
  oppgittOpptjening: {
    førSøkerPerioden: {
      oppgittEgenNæring: [
        {
          periode: {
            ...opplysningerFraSøknaden.førSøkerPerioden.oppgittEgenNæring[0].periode,
          },
          bruttoInntekt: {
            verdi: values.selvstendigNaeringsdrivende_inntekt2019 || values.selvstendigNaeringsdrivende_inntekt2020,
          },
        },
      ],
      oppgittFrilans: {
        ...opplysningerFraSøknaden.førSøkerPerioden.oppgittFrilans,
      },
    },
    iSøkerPerioden: {
      oppgittEgenNæring: [
        {
          periode: {
            fom: values.selvstendigNaeringsdrivende_startdatoForSoknaden,
            tom: moment(values.selvstendigNaeringsdrivende_startdatoForSoknaden, ISO_DATE_FORMAT)
              .endOf('month')
              .format(ISO_DATE_FORMAT),
          },
          bruttoInntekt: {
            verdi: values.selvstendigNaeringsdrivende_inntektISoknadsperioden,
          },
        },
      ],
      oppgittFrilans: {
        oppgittFrilansoppdrag: [
          {
            periode: {
              fom: values.frilanser_startdatoForSoknaden,
              tom: moment(values.frilanser_startdatoForSoknaden, ISO_DATE_FORMAT)
                .endOf('month')
                .format(ISO_DATE_FORMAT),
            },
            bruttoInntekt: {
              verdi: values.frilanser_inntektISoknadsperioden,
            },
          },
        ],
      },
    },
    periodeFraSøknad: { ...opplysningerFraSøknaden.periodeFraSøknad },
    søkerYtelseForFrilans: !!values.frilanser_inntektISoknadsperioden,
    søkerYtelseForNæring: !!values.selvstendigNaeringsdrivende_inntektISoknadsperioden,
  },
});

const buildInitialValues = (values: OpplysningerFraSøknaden) => {
  const { søkerYtelseForNæring, søkerYtelseForFrilans, periodeFraSøknad, førSøkerPerioden, iSøkerPerioden } = values;
  const erInntektsperiodenFørKorona2019 =
    moment(førSøkerPerioden?.oppgittEgenNæring[0].periode.tom, ISO_DATE_FORMAT).year() === 2019;
  const erInntektsperiodenFørKorona2020 =
    moment(førSøkerPerioden?.oppgittEgenNæring[0].periode.tom, ISO_DATE_FORMAT).year() === 2020;
  return {
    erSelvstendigNæringsdrivende: søkerYtelseForNæring,
    erFrilanser: søkerYtelseForFrilans,
    søknadsperiode: periodeFraSøknad,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_STARTDATO_FOR_SØKNADEN]:
      iSøkerPerioden?.oppgittEgenNæring[0].periode.fom,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_I_SØKNADSPERIODEN]:
      iSøkerPerioden?.oppgittEgenNæring[0].bruttoInntekt.verdi,
    [OpplysningerFraSoknadenValues.FRILANSER_STARTDATO_FOR_SØKNADEN]:
      iSøkerPerioden?.oppgittFrilans.oppgittFrilansoppdrag[0].periode.fom,
    [OpplysningerFraSoknadenValues.FRILANSER_INNTEKT_I_SØKNADSPERIODEN]:
      iSøkerPerioden?.oppgittFrilans.oppgittFrilansoppdrag[0].bruttoInntekt.verdi,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2019]: erInntektsperiodenFørKorona2019
      ? førSøkerPerioden.oppgittEgenNæring[0].bruttoInntekt.verdi
      : null,
    [OpplysningerFraSoknadenValues.SELVSTENDIG_NÆRINGSDRIVENDE_INNTEKT_2020]: erInntektsperiodenFørKorona2020
      ? førSøkerPerioden.oppgittEgenNæring[0].bruttoInntekt.verdi
      : null,
  };
};

const mapStateToProps = (_, props: OpplysningerFraSoknadenFormProps) => {
  const { submitCallback, behandlingId, behandlingVersjon } = props;
  const onSubmit = (values: TransformValues) => submitCallback([transformValues(values)]);

  return state => ({
    onSubmit,
    initialValues: buildInitialValues(mock),
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
  });
};

const connectedComponent = connect(mapStateToProps)(
  behandlingForm({
    form: formName,
  })(OpplysningerFraSoknadenForm),
);

export default connectedComponent;
