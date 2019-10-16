import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import {
  behandlingForm, FaktaBegrunnelseTextField, FaktaEkspandertpanel, withDefaultToggling, faktaPanelCodes, FaktaSubmitButton,
  behandlingFormValueSelector,
} from '@fpsak-frontend/fp-felles';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, VerticalSpacer } from '@fpsak-frontend/shared-components';

import vergeAksjonspunkterPropType from '../propTypes/vergeAksjonspunkterPropType';
import RegistrereVergeFaktaForm from './RegistrereVergeFaktaForm';

/**
 * RegistrereVergeInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.
 */
export const RegistrereVergeInfoPanelImpl = ({
  intl,
  openInfoPanels,
  toggleInfoPanelCallback,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  initialValues,
  vergetyper,
  aksjonspunkt,
  behandlingId,
  behandlingVersjon,
  alleMerknaderFraBeslutter,
  valgtVergeType,
  ...formProps
}) => {
  if (!aksjonspunkt) {
    return null;
  }
  return (
    <FaktaEkspandertpanel
      title={intl.formatMessage({ id: 'RegistrereVergeInfoPanel.Info' })}
      hasOpenAksjonspunkter={hasOpenAksjonspunkter}
      isInfoPanelOpen={openInfoPanels.includes(faktaPanelCodes.VERGE)}
      toggleInfoPanelCallback={toggleInfoPanelCallback}
      faktaId={faktaPanelCodes.VERGE}
      readOnly={readOnly}
    >
      <AksjonspunktHelpText isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.CheckInformation' })]}
      </AksjonspunktHelpText>
      <form onSubmit={formProps.handleSubmit}>
        <RegistrereVergeFaktaForm
          readOnly={readOnly}
          intl={intl}
          vergetyper={vergetyper}
          valgtVergeType={valgtVergeType}
          alleMerknaderFraBeslutter={alleMerknaderFraBeslutter}
        />
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField isDirty={formProps.dirty} isSubmittable={submittable} isReadOnly={readOnly} hasBegrunnelse={!!initialValues.begrunnelse} />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable && !!valgtVergeType}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          doNotCheckForRequiredFields
        />
      </form>
    </FaktaEkspandertpanel>
  );
};

RegistrereVergeInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  openInfoPanels: PropTypes.arrayOf(PropTypes.string).isRequired,
  toggleInfoPanelCallback: PropTypes.func.isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: vergeAksjonspunkterPropType.isRequired,
  vergetyper: PropTypes.arrayOf(PropTypes.shape({
    kode: PropTypes.string,
    name: PropTypes.string,
  })).isRequired,
  initialValues: PropTypes.shape(),
  alleMerknaderFraBeslutter: PropTypes.shape({
    notAccepted: PropTypes.bool,
  }).isRequired,
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  valgtVergeType: PropTypes.string,
};

RegistrereVergeInfoPanelImpl.defaultProps = {
  initialValues: {},
  submittable: true,
  valgtVergeType: undefined,
};

const buildInitialValues = createSelector([
  (ownProps) => ownProps.verge,
  (ownProps) => ownProps.aksjonspunkter], (verge, aksjonspunkter) => ({
  ...FaktaBegrunnelseTextField.buildInitialValues(aksjonspunkter.filter((ap) => ap.definisjon.kode === aksjonspunktCodes.AVKLAR_VERGE)[0]),
  ...RegistrereVergeFaktaForm.buildInitialValues(verge || {}),
}));

const transformValues = (values) => ({
  ...RegistrereVergeFaktaForm.transformValues(values),
  ...{ begrunnelse: values.begrunnelse },
});

const FORM_NAVN = 'RegistrereVergeInfoPanel';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = (values) => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    valgtVergeType: behandlingFormValueSelector(FORM_NAVN, ownProps.behandlingId, ownProps.behandlingVersjon)(state, 'vergeType'),
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(ownProps),
    vergetyper: ownProps.alleKodeverk[kodeverkTyper.VERGE_TYPE],
    onSubmit,
  });
};

const vergeAksjonspunkter = [aksjonspunktCodes.AVKLAR_VERGE];

export default withDefaultToggling(faktaPanelCodes.VERGE, vergeAksjonspunkter)(
  connect(mapStateToPropsFactory)(behandlingForm({
    form: FORM_NAVN,
  })(injectIntl(RegistrereVergeInfoPanelImpl))),
);
