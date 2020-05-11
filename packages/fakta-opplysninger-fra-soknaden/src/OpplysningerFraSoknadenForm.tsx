import { behandlingForm } from '@fpsak-frontend/form';
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
import { required, minLength, maxLength, hasValidText } from '@fpsak-frontend/utils';
import FrilanserForm from './FrilanserForm';
import styles from './opplysningerFraSoknadenForm.less';
import SelvstendigNæringsdrivendeForm from './SelvstendigNæringsdrivendeForm';
import OpplysningerFraSoknadenValues from './types/OpplysningerFraSoknadenTypes';
import TextAreaField from '../../form/src/TextAreaField';

const classNames = classnames.bind(styles);

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
  harApneAksjonspunkter: boolean;
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
  const { handleSubmit, initialValues, behandlingId, behandlingVersjon, submittable, harApneAksjonspunkter } = props;
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
          {erSelvstendigNæringsdrivende && <SelvstendigNæringsdrivendeForm erFrilanser={erFrilanser} />}
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
          {erFrilanser && <FrilanserForm erSelvstendigNæringsdrivende={erSelvstendigNæringsdrivende} />}
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
  const { inntekter } = values;
  return {
    erSelvstendigNæringsdrivende: !!inntekter.selvstendig,
    erFrilanser: !!inntekter.frilanser,
    // startdatoSoknadSelvstendigNaeringsdrivende: !!inntekter.selvstendig ? values
  };
};

const mapStateToProps = (_, props: OpplysningerFraSoknadenFormProps) => {
  const { submitCallback } = props;
  const onSubmit = (values: TransformValues) => submitCallback([transformValues(values)]);

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
