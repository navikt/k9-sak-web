import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { FaktaBegrunnelseTextField, FaktaSubmitButton } from '@k9-sak-web/fakta-felles';
import { behandlingForm } from '@fpsak-frontend/form';
import { AksjonspunktHelpTextTemp, VerticalSpacer } from '@fpsak-frontend/shared-components';

import { decodeHtmlEntity } from '@fpsak-frontend/utils';
import { Normaltekst } from 'nav-frontend-typografi';
import vergeAksjonspunkterPropType from '../propTypes/vergeAksjonspunkterPropType';

/**
 * RegistrereVergeInfoPanel
 *
 * Presentasjonskomponent. Har ansvar for å sette opp formen for att registrere verge.
 */
export const RegistrereVergeInfoPanelImpl = ({
  intl,
  hasOpenAksjonspunkter,
  submittable,
  readOnly,
  initialValues,
  aksjonspunkt,
  behandlingId,
  behandlingVersjon,
  ...formProps
}) => {
  if (!aksjonspunkt) {
    return null;
  }
  return (
    <>
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={hasOpenAksjonspunkter}>
        {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.CheckInformation' })]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer twentyPx />
      <Normaltekst>
        {[intl.formatMessage({ id: 'RegistrereVergeInfoPanel.HjelpeTekst' })]}
      </Normaltekst>
      <form onSubmit={formProps.handleSubmit}>
        <VerticalSpacer twentyPx />
        <FaktaBegrunnelseTextField
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasBegrunnelse={!!initialValues.begrunnelse}
          label={intl.formatMessage({ id: 'RegistrereVergeInfoPanel.Begrunnelse' })}
        />
        <VerticalSpacer twentyPx />
        <FaktaSubmitButton
          formName={formProps.form}
          behandlingId={behandlingId}
          behandlingVersjon={behandlingVersjon}
          isSubmittable={submittable}
          isReadOnly={readOnly}
          hasOpenAksjonspunkter={hasOpenAksjonspunkter}
          doNotCheckForRequiredFields
        />
      </form>
    </>
  );
};

RegistrereVergeInfoPanelImpl.propTypes = {
  intl: PropTypes.shape().isRequired,
  hasOpenAksjonspunkter: PropTypes.bool.isRequired,
  submittable: PropTypes.bool,
  readOnly: PropTypes.bool.isRequired,
  aksjonspunkt: vergeAksjonspunkterPropType.isRequired,
  initialValues: PropTypes.shape(),
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
};

RegistrereVergeInfoPanelImpl.defaultProps = {
  initialValues: {},
  submittable: true,
};

const buildInitialValues = createSelector(
  [ownProps => ownProps.verge, ownProps => ownProps.aksjonspunkter],
  (verge, aksjonspunkter) => ({
    begrunnelse:
      verge && verge.begrunnelse
        ? decodeHtmlEntity(verge.begrunnelse)
        : FaktaBegrunnelseTextField.buildInitialValues(
          aksjonspunkter.filter(ap => ap.definisjon === aksjonspunktCodes.AVKLAR_VERGE)[0],
        ).begrunnelse,
  }),
);

const transformValues = values => ({ begrunnelse: values.begrunnelse, kode: aksjonspunktCodes.AVKLAR_VERGE });

const FORM_NAVN = 'RegistrereVergeInfoPanel';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    aksjonspunkt: ownProps.aksjonspunkter[0],
    initialValues: buildInitialValues(ownProps),
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: FORM_NAVN,
  })(injectIntl(RegistrereVergeInfoPanelImpl)),
);
