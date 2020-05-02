import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps, ConfigProps } from 'redux-form';
import { behandlingForm } from '@fpsak-frontend/form/src/behandlingForm';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { rammevedtakFormName } from './RammevedtakFaktaForm';
import RedigerOverføringsrader from './RedigerOverføringsrader';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
  readOnly: boolean;
  rediger: VoidFunction;
}

const OverføringsraderFormImpl: FunctionComponent<InjectedFormProps & OverføringsraderFormImplProps> = ({
  type,
  retning,
  readOnly,
  rediger,
  handleSubmit,
}) => {
  return (
    <FieldArray
      name="overføringer"
      component={RedigerOverføringsrader}
      props={{ rediger, type, retning, readOnly, bekreft: handleSubmit }}
    />
  );
};

interface OverføringsraderFormProps {
  initialValues: Overføring[];
  type: Overføringstype;
  retning: Overføringsretning;
  behandlingId: number;
  behandlingVersjon: number;
  oppdaterOverføringer: (overføringer: Overføring[]) => void;
  readOnly: boolean;
  rediger(redigerer: boolean): void;
}

interface OverføringsraderForm {
  overføringer: Overføring[];
}

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverføringsraderFormProps) => {
  const { type, retning, oppdaterOverføringer, initialValues } = initialOwnProps;
  const formName = `${rammevedtakFormName}-${type}-${retning}`;
  return (state, { rediger }: OverføringsraderFormProps): ConfigProps & Partial<OverføringsraderFormImplProps> => {
    const onSubmit = ({ overføringer }: OverføringsraderForm) => {
      oppdaterOverføringer(
        overføringer.map(overføring => ({ ...overføring, antallDager: Number(overføring.antallDager) })),
      );
      rediger(false);
    };
    return {
      form: formName,
      onSubmit,
      initialValues: {
        overføringer: initialValues,
      },
      rediger: () => rediger(true),
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
