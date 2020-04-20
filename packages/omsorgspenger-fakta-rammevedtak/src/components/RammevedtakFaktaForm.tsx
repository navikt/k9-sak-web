import React, { FunctionComponent } from 'react';
import { FieldArray, InjectedFormProps } from 'redux-form';
import { connect } from 'react-redux';
import { behandlingForm, getBehandlingFormPrefix } from '@fpsak-frontend/form/src/behandlingForm';
import Barn from '../types/Barn';
import FormValues from '../types/FormValues';
import BarnInput from './BarnInput';

interface RammevedtakFaktaFormProps {
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: any) => void;
  readOnly?: boolean;
}

const rammevedtakFormName = 'rammevedtakFormName';

const AlleBarn = ({ fields }) =>
  fields.map(field => <BarnInput barn={field} namePrefix={field} key={field.fødselsnummer} />);

const RammevedtakFaktaForm: FunctionComponent<RammevedtakFaktaFormProps & InjectedFormProps> = () => {
  return (
    <>
      <FieldArray name="barn" component={AlleBarn} />
    </>
  );
};

const mapStateToPropsFactory = (_initialState, initialOwnProps: RammevedtakFaktaFormProps) => {
  const { submitCallback } = initialOwnProps;
  const onSubmit = values => submitCallback(values);

  const testBarn: Barn[] = [
    {
      fødselsnummer: '12122055555',
      erFosterbarn: true,
    },
    {
      fødselsnummer: '03032066666',
      erKroniskSykt: true,
      midlertidigAleneomsorg: true,
    },
  ];

  // TODO: Ta inn dto og map om her. Så får man dto inn og ut
  const initialValues: FormValues = {
    barn: testBarn,
    overføringer: [],
  };

  return (state, { behandlingId, behandlingVersjon }: RammevedtakFaktaFormProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

    return {
      initialValues,
      behandlingFormPrefix,
      onSubmit,
    };
  };
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: rammevedtakFormName,
    enableReinitialize: true,
  })(RammevedtakFaktaForm),
);
