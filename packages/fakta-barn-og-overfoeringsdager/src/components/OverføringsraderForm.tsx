import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { FormAction } from 'redux-form/lib/actions';
import { bindActionCreators } from 'redux';
import { FieldArray, InjectedFormProps, ConfigProps, change } from 'redux-form';
import { behandlingForm, getBehandlingFormValues } from '@fpsak-frontend/form/src/behandlingForm';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { rammevedtakFormName } from './RammevedtakFaktaForm';
import RedigerOverføringsrader from './RedigerOverføringsrader';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
  readOnly: boolean;
  rediger: (redigerer: boolean) => void;
  formValues: OverføringsraderFormValues;
  changeForm?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
}

const OverføringsraderFormImpl: FunctionComponent<InjectedFormProps & OverføringsraderFormImplProps> = ({
  type,
  retning,
  readOnly,
  rediger,
  handleSubmit,
  formValues,
  changeForm,
  form,
}) => {
  const [overføringerVedRediger, setOverføringerVedRediger] = useState(null);
  const redigerKopierFormState = () => {
    rediger(true);
    setOverføringerVedRediger(formValues.overføringer);
  };
  const avbryt = () => {
    rediger(false);
    changeForm(form, 'overføringer', overføringerVedRediger);
  };

  return (
    <FieldArray
      name="overføringer"
      component={RedigerOverføringsrader}
      props={{ rediger: redigerKopierFormState, type, retning, readOnly, bekreft: handleSubmit, avbryt }}
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

interface OverføringsraderFormValues {
  overføringer: Overføring[];
}

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverføringsraderFormProps) => {
  const { type, retning, oppdaterOverføringer, initialValues } = initialOwnProps;
  const formName = `${rammevedtakFormName}-${type}-${retning}`;

  return (
    state,
    { rediger, behandlingId, behandlingVersjon }: OverføringsraderFormProps,
  ): ConfigProps<OverføringsraderFormValues> & Partial<OverføringsraderFormImplProps> => {
    const onSubmit = ({ overføringer }: OverføringsraderFormValues) => {
      oppdaterOverføringer(
        overføringer.map(overføring => ({ ...overføring, antallDager: Number(overføring.antallDager) })),
      );
      rediger(false);
    };

    // @ts-ignore
    const formValues: OverføringsraderFormValues = getBehandlingFormValues(
      formName,
      behandlingId,
      behandlingVersjon,
    )(state);

    return {
      form: formName,
      onSubmit,
      initialValues: {
        overføringer: initialValues,
      },
      rediger,
      formValues,
    };
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      changeForm: change,
    },
    dispatch,
  );

const OverføringsraderForm: FunctionComponent<OverføringsraderFormProps> = connect(
  mapStateToPropsFactory,
  mapDispatchToProps,
)(
  // @ts-ignore
  behandlingForm({
    enableReinitialize: true,
  })(OverføringsraderFormImpl),
);

export default OverføringsraderForm;
