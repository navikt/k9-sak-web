import { behandlingForm, behandlingFormValueSelector } from '@fpsak-frontend/form';
import { FaktaSubmitButton } from '@fpsak-frontend/fp-felles';
import { SubmitCallback } from '@k9-sak-web/types';
import { Checkbox } from 'nav-frontend-skjema';
import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedFormProps } from 'redux-form';
import classnames from 'classnames/bind';
import { useIntl } from 'react-intl';
import { Label } from '@fpsak-frontend/form/src/Label';
import { Element } from 'nav-frontend-typografi';
import { required, minLength, maxLength, hasValidText, ISO_DATE_FORMAT } from '@fpsak-frontend/utils';
import moment from 'moment';
import { DDMMYYYY_DATE_FORMAT } from '@fpsak-frontend/utils/src/formats';
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
  } = props;
  const { søknadsperiode } = initialValues;
  const [erSelvstendigNæringsdrivende, setErSelvstendigNæringsdrivende] = React.useState(
    initialValues.erSelvstendigNæringsdrivende,
  );
  const [erFrilanser, setErFrilanser] = React.useState(initialValues.erFrilanser);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className={classNames('formContainer', { showBorder: erSelvstendigNæringsdrivende })}>
          <Checkbox
            label={
              <Label
                input={{ id: 'OpplysningerFraSoknaden.selvstendigNæringsdrivende', args: {} }}
                typographyElement={Element}
                intl={intl}
              />
            }
            disabled={false} // TODO (Hallvard): endre til readOnly
            onChange={() => setErSelvstendigNæringsdrivende(!erSelvstendigNæringsdrivende)}
            checked={erSelvstendigNæringsdrivende}
          />
          {erSelvstendigNæringsdrivende && (
            <SelvstendigNæringsdrivendeForm
              erFrilanser={erFrilanser}
              selvstendigNæringsdrivendeInntekt2019={selvstendigNæringsdrivendeInntekt2019}
              selvstendigNæringsdrivendeInntekt2020={selvstendigNæringsdrivendeInntekt2020}
              startdatoValidator={startdato => startdatoErISøknadsperiode(startdato, søknadsperiode)}
            />
          )}
        </div>
        <div className={classNames('formContainer', { showBorder: erFrilanser })}>
          <Checkbox
            label={
              <Label
                input={{ id: 'OpplysningerFraSoknaden.frilanser', args: {} }}
                typographyElement={Element}
                intl={intl}
              />
            }
            disabled={false} // TODO (Hallvard): endre til readOnly
            onChange={() => setErFrilanser(!erFrilanser)}
            checked={erFrilanser}
          />
          {erFrilanser && (
            <FrilanserForm
              erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende}
              startdatoValidator={startdato => startdatoErISøknadsperiode(startdato, søknadsperiode)}
            />
          )}
        </div>
        {(erFrilanser || erSelvstendigNæringsdrivende) && (
          <div className={classNames('begrunnelseContainer')}>
            <TextAreaField
              name={OpplysningerFraSoknadenValues.BEGRUNNELSE}
              label={{ id: 'OpplysningerFraSoknaden.Begrunnelse' }}
              validate={[required, minLength(3), maxLength(2000), hasValidText]}
              readOnly={false} // TODO (Hallvard): endre til readOnly
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
          isReadOnly={false} // TODO (Hallvard) sett til readOnly
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

const transformValues = (values: TransformValues) => ({ kode: '', begrunnelse: values.begrunnelse });

const buildInitialValues = values => {
  const { oppgittOpptjening, periodeFraSøknad } = values;
  return {
    erSelvstendigNæringsdrivende: !!oppgittOpptjening?.oppgittEgenNæring,
    erFrilanser: !!oppgittOpptjening?.oppgittFrilans,
    søknadsperiode: periodeFraSøknad,
    // startdatoSoknadSelvstendigNaeringsdrivende: !!inntekter.selvstendig ? values
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
