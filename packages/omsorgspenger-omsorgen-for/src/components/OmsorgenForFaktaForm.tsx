import * as React from 'react';
import { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import AlertStripe from 'nav-frontend-alertstriper';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';
import { InjectedFormProps, change as reduxFormChange } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormAction } from 'redux-form/lib/actions';
import { AksjonspunktHelpTextTemp, FlexRow, VerticalSpacer } from '@fpsak-frontend/shared-components/index';
import { FormattedMessage } from 'react-intl';
import Spørsmål from './Spørsmål';

const omsorgenForFormName = 'OmsorgenForFaktaForm';
const søkerDelerAdresseMedBarnName = 'søkerDelerAdresseMedBarn';
const fåttOverførtDagerName = 'fåttOverførtDager';
const harFosterbarnName = 'harFosterbarn';
const harAvtaltDeltBostedName = 'harAvtaltDeltBosted';

interface FormValues {
  [søkerDelerAdresseMedBarnName]?: boolean;
  [fåttOverførtDagerName]?: boolean;
  [harFosterbarnName]?: boolean;
  [harAvtaltDeltBostedName]?: boolean;
}

interface OmsorgenForFaktaFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  behandlingFormPrefix?: string;
  submitCallback: (values: any[]) => void;
  formValues?: FormValues;
  reduxFormChange?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  readOnly?: boolean;
}

const OmsorgenForFaktaForm: FunctionComponent<OmsorgenForFaktaFormProps & InjectedFormProps> = ({
  handleSubmit,
  formValues,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  readOnly,
}) => {
  const { søkerDelerAdresseMedBarn, harFosterbarn, harAvtaltDeltBosted, fåttOverførtDager } = formValues;
  const delerAdresseJa = søkerDelerAdresseMedBarn === true;
  const delerAdressNei = søkerDelerAdresseMedBarn === false;
  const fosterbarnNei = delerAdressNei && harFosterbarn === false;
  const avtaltDeltBostedNei = fosterbarnNei && harAvtaltDeltBosted === false;

  const nullstillFelt = feltnavn => formChange(`${behandlingFormPrefix}.${omsorgenForFormName}`, feltnavn, null);

  const omsorgenForGodkjent = harFosterbarn || fåttOverførtDager || harAvtaltDeltBosted;
  const omsorgenForIkkeGodkjent = fåttOverførtDager === false;

  return (
    <form onSubmit={handleSubmit}>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen>
        {[<FormattedMessage id="OmsorgenFor.Aksjonspunkt" key="OmsorgenFor.Aksjonspunkt" />]}
      </AksjonspunktHelpTextTemp>
      <Spørsmål
        vis
        feltnavn={søkerDelerAdresseMedBarnName}
        labeldId="OmsorgenFor.DelerSøkerAdresseMedBarn"
        nullstillFelt={nullstillFelt}
        readOnly={readOnly}
        value={søkerDelerAdresseMedBarn}
      />
      <Spørsmål
        vis={delerAdresseJa}
        feltnavn={fåttOverførtDagerName}
        labeldId="OmsorgenFor.FåttOverførtDager"
        nullstillFelt={nullstillFelt}
        readOnly={readOnly}
      />
      <Spørsmål
        vis={delerAdressNei}
        feltnavn={harFosterbarnName}
        labeldId="OmsorgenFor.HarFosterbarn"
        nullstillFelt={nullstillFelt}
        readOnly={readOnly}
      />
      <Spørsmål
        vis={fosterbarnNei}
        feltnavn={harAvtaltDeltBostedName}
        labeldId="OmsorgenFor.HarAvtaltDeltBosted"
        nullstillFelt={nullstillFelt}
        readOnly={readOnly}
      />
      <Spørsmål
        vis={avtaltDeltBostedNei}
        feltnavn={fåttOverførtDagerName}
        labeldId="OmsorgenFor.FåttOverførtDager"
        nullstillFelt={nullstillFelt}
        readOnly={readOnly}
      />
      {(omsorgenForGodkjent || omsorgenForIkkeGodkjent) && (
        <>
          <VerticalSpacer sixteenPx />
          <AlertStripe type={omsorgenForGodkjent ? 'suksess' : 'feil'} form="inline">
            <FormattedMessage id={omsorgenForGodkjent ? 'OmsorgenFor.Oppfylt' : 'OmsorgenFor.IkkeOppfylt'} />
          </AlertStripe>
          <VerticalSpacer sixteenPx />
          <FlexRow justifyCenter>
            <Hovedknapp onClick={handleSubmit} disabled={readOnly}>
              <FormattedMessage id="SubmitButton.SendInn" />
            </Hovedknapp>
          </FlexRow>
        </>
      )}
    </form>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: OmsorgenForFaktaFormProps) => {
  const { submitCallback } = initialOwnProps;
  const onSubmit = values => submitCallback(values);

  return (state, { behandlingId, behandlingVersjon }: OmsorgenForFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);
    const formValues = getBehandlingFormValues(omsorgenForFormName, behandlingId, behandlingVersjon)(state) || {};

    return {
      initialValues: {},
      behandlingFormPrefix,
      onSubmit,
      formValues,
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      reduxFormChange,
    },
    dispatch,
  );

export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: omsorgenForFormName,
    enableReinitialize: true,
  })(OmsorgenForFaktaForm),
);
