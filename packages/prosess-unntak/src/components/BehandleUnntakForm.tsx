import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { Undertittel } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-felles';
import behandlingResultatType from '@fpsak-frontend/kodeverk/src/behandlingResultatType';
import {
  behandlingForm,
  RadioGroupField,
  RadioOption,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { required } from '@fpsak-frontend/utils';
import { VerticalSpacer, FlexContainer, FlexRow, AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';
import FritekstTextField from './FritekstTextField';

const FORM_NAME = 'BehandleUnntakForm';

export const BehandleUnntakFormImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  readOnlySubmitButton,
  sprakkode,
  intl,
  // alleKodeverk,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FlexContainer>
      <FlexRow>
        <Undertittel>
          <FormattedMessage id="Unntak.Title" />
        </Undertittel>
      </FlexRow>
      <VerticalSpacer twentyPx />

      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Unntak.AvklarAkjsonspunkt" key={aksjonspunktCodes.MANUELL_VURDERING_VILKÅR} />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer twentyPx />

      <FritekstTextField sprakkode={sprakkode} readOnly={readOnly} intl={intl} />

      <VerticalSpacer twentyPx />

      <RadioGroupField name="behandlingResultatType" validate={[required]} direction="horizontal" readOnly={readOnly}>
        <RadioOption value={behandlingResultatType.INNVILGET} label={{ id: 'Unntak.Innvilg' }} />
        <RadioOption value={behandlingResultatType.AVSLATT} label={{ id: 'Unntak.Avslå' }} />
      </RadioGroupField>

      <BehandlingspunktSubmitButton
        formName={formProps.form}
        behandlingId={behandlingId}
        behandlingVersjon={behandlingVersjon}
        isReadOnly={readOnly}
        isSubmittable={!readOnlySubmitButton}
        isBehandlingFormSubmitting={isBehandlingFormSubmitting}
        isBehandlingFormDirty={isBehandlingFormDirty}
        hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
      />
    </FlexContainer>
  </form>
);

BehandleUnntakFormImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveUnntak: PropTypes.func.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
};

export const buildInitialValues = createSelector([ownProps => ownProps.behandlingsresultat], behandlingsresultat => ({
  fritekst: behandlingsresultat ? behandlingsresultat.fritekst : null,
  behandlingResultatType: behandlingsresultat ? behandlingsresultat.type.kode : null,
}));

export const transformValues = values => ({
  behandlingResultatType: values.behandlingResultatType,
  fritekst: values.fritekst,
  // begrunnelse: '',
  kode: aksjonspunktCodes.MANUELL_VURDERING_VILKÅR,
});

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(FORM_NAME, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'behandlingResultatType',
      'begrunnelse',
      'fritekst',
    ),
    onSubmit,
  });
};

const BehandleUnntakForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAME,
  })(BehandleUnntakFormImpl),
);

export default injectIntl(BehandleUnntakForm);
