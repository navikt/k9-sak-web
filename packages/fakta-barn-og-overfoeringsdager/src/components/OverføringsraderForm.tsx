import { behandlingForm } from '@k9-sak-web/form/src/behandlingForm';
import React from 'react';
import { connect } from 'react-redux';
import { ConfigProps, FieldArray, InjectedFormProps } from 'redux-form';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import Overføringsrader from './Overføringsrader';
import { overføringerFormName } from './formNames';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const OverføringsraderFormImpl = ({ type, retning }: InjectedFormProps & OverføringsraderFormImplProps) => (
  <FieldArray name="overføringer" component={Overføringsrader} props={{ type, retning }} />
);

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

export default connect(mapStateToPropsFactory)(
  // @ts-ignore
  behandlingForm({
    enableReinitialize: true,
  })(OverføringsraderFormImpl),
);
