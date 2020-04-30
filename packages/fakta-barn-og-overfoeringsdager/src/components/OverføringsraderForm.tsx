import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps, ConfigProps } from 'redux-form';
// import { FormattedMessage } from 'react-intl';
// import { Element } from 'nav-frontend-typografi';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
// import { required, hasValidDecimalMaxNumberOfDecimals } from '@fpsak-frontend/utils';
// import { numberRegex } from '@fpsak-frontend/utils/src/validation/validatorsHelper';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { rammevedtakFormName } from './RammevedtakFaktaForm';
// import styles from './overføringsraderForm.less';
import RedigerOverføringsrader from './RedigerOverføringsrader';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
}

const OverføringsraderFormImpl: FunctionComponent<InjectedFormProps & OverføringsraderFormImplProps> = ({
  type,
  retning,
}) => {
  // const redigerer =
  return <FieldArray name="overføringer" component={RedigerOverføringsrader} props={{ type, retning }} />;
};

interface OverføringsraderFormProps {
  initialValues: Overføring[];
  type: Overføringstype;
  retning: Overføringsretning;
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterOverføringer: (overføringer: Overføring[]) => void;
}

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverføringsraderFormProps) => {
  const { type, retning, oppdaterOverføringer, initialValues } = initialOwnProps;
  const formName = `${rammevedtakFormName}-${type}-${retning}`;
  const onSubmit = (overføringer: Overføring[]) => oppdaterOverføringer(overføringer);
  return (): ConfigProps => {
    return {
      form: formName,
      onSubmit,
      initialValues: {
        overføringer: initialValues,
      },
    };
  };
};

const OverføringsraderForm: FunctionComponent<OverføringsraderFormProps> = connect(mapStateToPropsFactory)(
  // @ts-ignore
  behandlingForm({
    enableReinitialize: true,
  })(OverføringsraderFormImpl),
);

export default OverføringsraderForm;
