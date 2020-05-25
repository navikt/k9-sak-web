import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps, ConfigProps } from 'redux-form';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { overføringerFormName } from './formNames';
import RedigerOverføringsrader from './RedigerOverføringsrader';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const OverføringsraderFormImpl: FunctionComponent<InjectedFormProps & OverføringsraderFormImplProps> = ({
  type,
  retning,
}) => {
  return <FieldArray name="overføringer" component={RedigerOverføringsrader} props={{ type, retning }} />;
};

interface OverføringsraderFormProps {
  initialValues: Overføring[];
  type: Overføringstype;
  retning: Overføringsretning;
  behandlingId: number;
  behandlingVersjon: number;
}

interface OverføringsraderFormValues {
  overføringer: Overføring[];
}

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverføringsraderFormProps) => {
  const { type, retning, initialValues } = initialOwnProps;
  const formName = overføringerFormName(type, retning);

  return (): ConfigProps<OverføringsraderFormValues> & Partial<OverføringsraderFormImplProps> => ({
    form: formName,
    initialValues: {
      overføringer: initialValues,
    },
  });
};

const OverføringsraderForm: FunctionComponent<OverføringsraderFormProps> = connect(mapStateToPropsFactory)(
  // @ts-ignore
  behandlingForm({
    enableReinitialize: true,
  })(OverføringsraderFormImpl),
);

export default OverføringsraderForm;
