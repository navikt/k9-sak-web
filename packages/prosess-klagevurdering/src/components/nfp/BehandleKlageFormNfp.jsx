import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';
import { Column, Row } from 'nav-frontend-grid';
import { Undertittel } from 'nav-frontend-typografi';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import { AksjonspunktHelpTextTemp, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ProsessStegSubmitButton, ProsessStegBegrunnelseTextField } from '@k9-sak-web/prosess-felles';
import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';

import KlageVurderingRadioOptionsNfp from './KlageVurderingRadioOptionsNfp';
import FritekstBrevTextField from '../felles/FritekstKlageBrevTextField';
import TempSaveAndPreviewKlageLink from '../felles/TempSaveAndPreviewKlageLink';
import TempsaveKlageButton from '../felles/TempsaveKlageButton';

import styles from './behandleKlageFormNfp.less';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (NFP).
 */
export const BehandleKlageFormNfpImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  valgtPartMedKlagerett,
  previewCallback,
  saveKlage,
  readOnlySubmitButton,
  sprakkode,
  formValues,
  intl,
  alleKodeverk,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Undertittel>{intl.formatMessage({ id: 'Klage.ResolveKlage.Title' })}</Undertittel>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpTextTemp isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.ResolveKlage.HelpText" key={aksjonspunktCodes.BEHANDLE_KLAGE_NFP} />]}
      </AksjonspunktHelpTextTemp>
      <VerticalSpacer sixteenPx />
      <KlageVurderingRadioOptionsNfp
        readOnly={readOnly}
        klageVurdering={formValues.klageVurdering}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
        intl={intl}
        medholdReasons={alleKodeverk[kodeverkTyper.KLAGE_MEDHOLD_ARSAK]}
      />
      <div className={styles.confirmVilkarForm}>
        <ProsessStegBegrunnelseTextField
          readOnly={readOnly}
          maxLength={100000}
          textCode="BehandleKlageFormNfp.BegrunnelseForKlage"
        />
        <VerticalSpacer sixteenPx />
        <FritekstBrevTextField sprakkode={sprakkode} readOnly={readOnly} intl={intl} />
        <VerticalSpacer sixteenPx />
        <Row>
          <Column xs="8">
            <ProsessStegSubmitButton
              formName={formProps.form}
              behandlingId={behandlingId}
              behandlingVersjon={behandlingVersjon}
              isReadOnly={readOnly}
              isSubmittable={!readOnlySubmitButton}
              isBehandlingFormSubmitting={isBehandlingFormSubmitting}
              isBehandlingFormDirty={isBehandlingFormDirty}
              hasBehandlingFormErrorsOfType={hasBehandlingFormErrorsOfType}
            />
            {!readOnly &&
              formValues.klageVurdering &&
              formValues.fritekstTilBrev &&
              formValues.fritekstTilBrev.length > 2 && (
                <TempSaveAndPreviewKlageLink
                  formValues={formValues}
                  saveKlage={saveKlage}
                  readOnly={readOnly}
                  valgtPartMedKlagerett={valgtPartMedKlagerett}
                  aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
                  previewCallback={previewCallback}
                />
              )}
          </Column>
          <Column xs="2">
            <TempsaveKlageButton
              formValues={formValues}
              saveKlage={saveKlage}
              readOnly={readOnly}
              aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NFP}
            />
          </Column>
        </Row>
      </div>
    </FadingPanel>
  </form>
);

BehandleKlageFormNfpImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

BehandleKlageFormNfpImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

export const buildInitialValues = createSelector(
  [ownProps => ownProps.klageVurdering.klageVurderingResultatNFP],
  klageVurderingResultat => ({
    klageMedholdArsak: klageVurderingResultat ? klageVurderingResultat.klageMedholdArsak : null,
    klageVurderingOmgjoer: klageVurderingResultat ? klageVurderingResultat.klageVurderingOmgjoer : null,
    klageVurdering: klageVurderingResultat ? klageVurderingResultat.klageVurdering : null,
    begrunnelse: klageVurderingResultat ? klageVurderingResultat.begrunnelse : null,
    fritekstTilBrev: klageVurderingResultat ? klageVurderingResultat.fritekstTilBrev : null,
  }),
);

export const transformValues = values => ({
  klageMedholdArsak:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ||
    values.klageVurdering === klageVurderingType.OPPHEVE_YTELSESVEDTAK
      ? values.klageMedholdArsak
      : null,
  klageVurderingOmgjoer:
    values.klageVurdering === klageVurderingType.MEDHOLD_I_KLAGE ? values.klageVurderingOmgjoer : null,
  klageVurdering: values.klageVurdering,
  fritekstTilBrev: values.fritekstTilBrev,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.BEHANDLE_KLAGE_NFP,
});

const formName = 'BehandleKlageNfpForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'klageVurdering',
      'begrunnelse',
      'fritekstTilBrev',
      'klageMedholdArsak',
      'klageVurderingOmgjoer',
    ),
    readOnly: ownProps.readOnly,
    onSubmit,
  });
};

const BehandleKlageFormNfp = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(BehandleKlageFormNfpImpl),
);

export default injectIntl(BehandleKlageFormNfp);
