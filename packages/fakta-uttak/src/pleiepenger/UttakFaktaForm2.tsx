import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { FieldArray, InjectedFormProps, change as reduxFormChange } from 'redux-form';
import { bindActionCreators } from 'redux';
import { FormAction } from 'redux-form/lib/actions';
import Hovedknapp from 'nav-frontend-knapper/lib/hovedknapp';

import {
  behandlingForm,
  getBehandlingFormPrefix,
  behandlingFormValueSelector,
} from '@fpsak-frontend/fp-felles/src/behandlingForm';
import { createSelector } from 'reselect';
import { useIntl } from 'react-intl';
import VerticalSpacer from '@fpsak-frontend/shared-components/src/VerticalSpacer';
import { Arbeidsgiver as ArbeidsgiverType } from './UttakFaktaIndex2';
import Arbeidsgiver from './Arbeidsgiver';
import { beregnNyePerioder } from './uttakUtils';

export const uttakFaktaFormName = 'UttakFaktaForm';

interface UttakFaktaFormProps {
  arbeidsgivere: ArbeidsgiverType[];
  behandlingId: number;
  behandlingVersjon: number;
  submitCallback: (values: ArbeidsgiverType[]) => void;
  behandlingFormPrefix?: string;
  reduxFormChange?: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
}

const UttakFaktaForm: FunctionComponent<UttakFaktaFormProps & InjectedFormProps> = ({
  handleSubmit,
  arbeidsgivere,
  behandlingFormPrefix,
  reduxFormChange: formChange,
  behandlingVersjon,
  behandlingId,
  ...formProps
}) => {
  const intl = useIntl();
  const { pristine } = formProps;

  const oppdaterPerioder = (arbeidsgiversOrgNr, arbeidsforholdIndex, nyPeriode) => {
    const oppdatert = arbeidsgivere.map(arbeidsgiver => {
      if (arbeidsgiver.organisasjonsnummer === arbeidsgiversOrgNr) {
        return {
          ...arbeidsgiver,
          arbeidsforhold: arbeidsgiver.arbeidsforhold.map((arbeidsforhold, index) => {
            if (index === arbeidsforholdIndex) {
              return {
                ...arbeidsforhold,
                perioder: beregnNyePerioder(arbeidsforhold.perioder, nyPeriode),
              };
            }
            return arbeidsforhold;
          }),
        };
      }
      return arbeidsgiver;
    });
    formChange(`${behandlingFormPrefix}.${uttakFaktaFormName}`, 'arbeidsgivere', oppdatert);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FieldArray
        name="arbeidsgivere"
        component={Arbeidsgiver}
        props={{ oppdaterPerioder, behandlingVersjon, behandlingId }}
      />
      {!pristine && (
        <>
          <VerticalSpacer twentyPx />
          <Hovedknapp onClick={handleSubmit}>
            {intl.formatMessage({ id: 'SubmitButton.ConfirmInformation' })}
          </Hovedknapp>
        </>
      )}
    </form>
  );
};

interface FormProps {
  initialValues: {
    arbeidsgivere: ArbeidsgiverType[];
  };
  behandlingFormPrefix: string;
  onSubmit: (values: any) => any;
}

const arbeidsgivereSelector = createSelector(
  [
    (state, ownProps) =>
      behandlingFormValueSelector(
        uttakFaktaFormName,
        ownProps.behandlingId,
        ownProps.behandlingVersjon,
      )(state, 'arbeidsgivere'),
  ],
  arbeidsgivere => arbeidsgivere,
);

const mapStateToPropsFactory = (
  _initialState,
  initialOwnProps: UttakFaktaFormProps,
): ((state, ownProps) => FormProps) => {
  const { behandlingId, behandlingVersjon, arbeidsgivere, submitCallback } = initialOwnProps;
  const onSubmit = (values: ArbeidsgiverType[]) => submitCallback(values);
  const initialValues = { arbeidsgivere };

  return (state, ownProps) => {
    const behandlingFormPrefix = getBehandlingFormPrefix(behandlingId, behandlingVersjon);

    return {
      initialValues,
      behandlingFormPrefix,
      onSubmit,
      arbeidsgivere: arbeidsgivereSelector(state, ownProps),
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
    form: uttakFaktaFormName,
    enableReinitialize: true,
  })(UttakFaktaForm),
);
