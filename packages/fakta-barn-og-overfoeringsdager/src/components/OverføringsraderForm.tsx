import React from 'react';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps, ConfigProps } from 'redux-form';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { overføringerFormName } from './formNames';
import Overføringsrader from './Overføringsrader';

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
  // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
  behandlingForm({
    enableReinitialize: true,
  })(OverføringsraderFormImpl),
);
