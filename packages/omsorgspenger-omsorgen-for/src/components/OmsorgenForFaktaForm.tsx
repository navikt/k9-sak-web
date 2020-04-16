import * as React from 'react';
import { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {
  behandlingForm,
  getBehandlingFormPrefix,
  getBehandlingFormValues,
} from '@fpsak-frontend/form/src/behandlingForm';
import { InjectedFormProps, change as reduxFormChange } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormAction } from 'redux-form/lib/actions';
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
}

const OmsorgenForFaktaForm: FunctionComponent<OmsorgenForFaktaFormProps & InjectedFormProps> = ({
  handleSubmit,
  formValues,
  behandlingFormPrefix,
  reduxFormChange: formChange,
}) => {
  const { søkerDelerAdresseMedBarn, harFosterbarn, harAvtaltDeltBosted } = formValues;
  const delerAdresseJa = søkerDelerAdresseMedBarn === true;
  const delerAdressNei = søkerDelerAdresseMedBarn === false;
  const fosterbarnNei = delerAdressNei && harFosterbarn === false;
  const avtaltDeltBostedNei = fosterbarnNei && harAvtaltDeltBosted === false;

  const nullstillFelt = feltnavn => formChange(`${behandlingFormPrefix}.${omsorgenForFormName}`, feltnavn, null);

  return (
    <form onSubmit={handleSubmit}>
      <Spørsmål
        vis
        feltnavn={søkerDelerAdresseMedBarnName}
        labeldId="OmsorgenFor.DelerSøkerAdresseMedBarn"
        nullstillFelt={nullstillFelt}
      />
      <Spørsmål
        vis={delerAdresseJa}
        feltnavn={fåttOverførtDagerName}
        labeldId="OmsorgenFor.FåttOverførtDager"
        nullstillFelt={nullstillFelt}
      />
      <Spørsmål
        vis={delerAdressNei}
        feltnavn={harFosterbarnName}
        labeldId="OmsorgenFor.HarFosterbarn"
        nullstillFelt={nullstillFelt}
      />
      <Spørsmål
        vis={fosterbarnNei}
        feltnavn={harAvtaltDeltBostedName}
        labeldId="OmsorgenFor.HarAvtaltDeltBosted"
        nullstillFelt={nullstillFelt}
      />
      <Spørsmål
        vis={avtaltDeltBostedNei}
        feltnavn={fåttOverførtDagerName}
        labeldId="OmsorgenFor.FåttOverførtDager"
        nullstillFelt={nullstillFelt}
      />
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

// TODO: fjern intl hvis det ikke brukes
export default connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  behandlingForm({
    form: omsorgenForFormName,
    enableReinitialize: true,
  })(OmsorgenForFaktaForm),
);
