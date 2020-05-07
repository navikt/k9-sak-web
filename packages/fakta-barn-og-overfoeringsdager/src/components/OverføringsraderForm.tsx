import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { FormAction } from 'redux-form/lib/actions';
import { bindActionCreators } from 'redux';
import { FieldArray, InjectedFormProps, ConfigProps, change } from 'redux-form';
import { behandlingForm, getBehandlingFormValues } from '@fpsak-frontend/form/src/behandlingForm';
import Overføring, { Overføringsretning, Overføringstype } from '../types/Overføring';
import { overføringerFormName } from './formNames';
import RedigerOverføringsrader from './RedigerOverføringsrader';

interface OverføringsraderFormImplProps {
  type: Overføringstype;
  retning: Overføringsretning;
  redigerer: boolean;
  rediger: (redigerer: boolean) => void;
  formValues: OverføringsraderFormValues;
  changeForm?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  readOnly: boolean;
}

const OverføringsraderFormImpl: FunctionComponent<InjectedFormProps & OverføringsraderFormImplProps> = ({
  type,
  retning,
  redigerer,
  rediger,
  handleSubmit,
  formValues,
  changeForm,
  form,
  readOnly,
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
      props={{ rediger: redigerKopierFormState, type, retning, redigerer, bekreft: handleSubmit, avbryt, readOnly }}
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
  redigerer: boolean;
  rediger(redigerer: boolean): void;
  readOnly: boolean;
}

interface OverføringsraderFormValues {
  overføringer: Overføring[];
}

const mapStateToPropsFactory = (_initialState, initialOwnProps: OverføringsraderFormProps) => {
  const { type, retning, oppdaterOverføringer, initialValues } = initialOwnProps;
  const formName = overføringerFormName(type, retning);

  return (
    state,
    { rediger, behandlingId, behandlingVersjon, readOnly }: OverføringsraderFormProps,
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
      readOnly,
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
