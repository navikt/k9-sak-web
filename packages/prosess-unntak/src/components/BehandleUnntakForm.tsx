import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import PropTypes from 'prop-types';
import { Hovedknapp } from 'nav-frontend-knapper';
import { Undertittel } from 'nav-frontend-typografi';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { BehandlingspunktSubmitButton } from '@fpsak-frontend/fp-felles';
import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import { VerticalSpacer, FlexContainer, FlexRow, AksjonspunktHelpTextTemp } from '@fpsak-frontend/shared-components';

import FritekstBrevTextField from './FritekstBrevTextField';
import TempSaveAndPreviewLink from './TempSaveAndPreviewLink';
import TempsaveButton from './TempsaveButton';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (KA).
 */
export const BehandleUnntakFormImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  saveUnntak,
  previewCallback,
  readOnlySubmitButton,
  sprakkode,
  formValues,
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
      <VerticalSpacer fourPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Unntak.HelpText" key={aksjonspunktCodes.BEHANDLE_KLAGE_NK} />]}
      </AksjonspunktHelpTextTemp>

      <FritekstBrevTextField sprakkode={sprakkode} readOnly={readOnly} intl={intl} />

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

      {!readOnly && formValues.fritekstTilBrev && formValues.fritekstTilBrev.length > 2 && (
        <TempSaveAndPreviewLink
          formValues={formValues}
          saveUnntak={saveUnntak}
          // readOnly={readOnly}
          aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
          previewCallback={previewCallback}
        />
      )}

      <TempsaveButton
        formValues={formValues}
        saveUnntak={saveUnntak}
        // readOnly={readOnly}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
      />
      <VerticalSpacer twentyPx />

      <FlexRow>
        <Hovedknapp mini htmlType="button" onClick={() => {}}>
          Innvilg og fortsett
        </Hovedknapp>
        <Hovedknapp mini htmlType="button" onClick={() => {}}>
          Avslå og fortsett
        </Hovedknapp>
      </FlexRow>
    </FlexContainer>
  </form>
);

BehandleUnntakFormImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveUnntak: PropTypes.func.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
};

BehandleUnntakFormImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

export const buildInitialValues = createSelector([ownProps => ownProps.unntakVurdering], unntakResultat => ({
  begrunnelse: unntakResultat ? unntakResultat.begrunnelse : null,
  fritekstTilBrev: unntakResultat ? unntakResultat.fritekstTilBrev : null,
}));

export const transformValues = values => ({
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
});

const formName = 'BehandleUnntakForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'begrunnelse',
      'fritekstTilBrev',
    ),
    onSubmit,
  });
};

const BehandleUnntakForm = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(BehandleUnntakFormImpl),
);

export default injectIntl(BehandleUnntakForm);
