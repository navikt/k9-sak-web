import {
  behandlingForm,
  behandlingFormValueSelector,
  hasBehandlingFormErrorsOfType,
  isBehandlingFormDirty,
  isBehandlingFormSubmitting,
} from '@fpsak-frontend/form';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import klageVurderingType from '@fpsak-frontend/kodeverk/src/klageVurdering';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { AksjonspunktHelpText, FadingPanel, VerticalSpacer } from '@fpsak-frontend/shared-components';
import { ProsessStegSubmitButton } from '@k9-sak-web/prosess-felles';
import { HGrid, Heading } from '@navikt/ds-react';
import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { formPropTypes } from 'redux-form';
import { createSelector } from 'reselect';

import FritekstBrevTextField from '../felles/FritekstKlageBrevTextField';
import TempSaveAndPreviewKlageLink from '../felles/TempSaveAndPreviewKlageLink';
import TempsaveKlageButton from '../felles/TempsaveKlageButton';
import KlageVurderingRadioOptionsKa from './KlageVurderingRadioOptionsKa';

import styles from './behandleKlageFormKa.module.css';

/**
 * BehandleklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for behandling av klage (KA).
 */
export const BehandleKlageFormKaImpl = ({
  behandlingId,
  behandlingVersjon,
  readOnly,
  handleSubmit,
  saveKlage,
  valgtPartMedKlagerett,
  previewCallback,
  readOnlySubmitButton,
  sprakkode,
  formValues,
  intl,
  alleKodeverk,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FadingPanel>
      <Heading size="small" level="2">
        {intl.formatMessage({ id: 'Klage.ResolveKlage.Title' })}
      </Heading>
      <VerticalSpacer fourPx />
      <AksjonspunktHelpText isAksjonspunktOpen={!readOnlySubmitButton}>
        {[<FormattedMessage id="Klage.ResolveKlage.HelpText" key={aksjonspunktCodes.BEHANDLE_KLAGE_NK} />]}
      </AksjonspunktHelpText>
      <VerticalSpacer sixteenPx />
      <KlageVurderingRadioOptionsKa
        readOnly={readOnly}
        klageVurdering={formValues.klageVurdering}
        aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
        intl={intl}
        medholdReasons={alleKodeverk[kodeverkTyper.KLAGE_MEDHOLD_ARSAK]}
      />
      <div className={styles.confirmVilkarForm}>
        <VerticalSpacer sixteenPx />
        <FritekstBrevTextField sprakkode={sprakkode} readOnly={readOnly} intl={intl} />
        <VerticalSpacer sixteenPx />
        <HGrid gap="1" columns={{ xs: '8fr 2fr 2fr' }}>
          <div className="relative">
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
                  aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
                  previewCallback={previewCallback}
                />
              )}
          </div>
          <div>
            <TempsaveKlageButton
              formValues={formValues}
              saveKlage={saveKlage}
              readOnly={readOnly}
              aksjonspunktCode={aksjonspunktCodes.BEHANDLE_KLAGE_NK}
            />
          </div>
        </HGrid>
      </div>
    </FadingPanel>
  </form>
);

BehandleKlageFormKaImpl.propTypes = {
  previewCallback: PropTypes.func.isRequired,
  saveKlage: PropTypes.func.isRequired,
  formValues: PropTypes.shape(),
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

BehandleKlageFormKaImpl.defaultProps = {
  formValues: {},
  readOnly: true,
  readOnlySubmitButton: true,
};

export const buildInitialValues = createSelector(
  [ownProps => ownProps.klageVurdering.klageVurderingResultatNK],
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
  kode: aksjonspunktCodes.BEHANDLE_KLAGE_NK,
});

const formName = 'BehandleKlageKaForm';

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values => initialOwnProps.submitCallback([transformValues(values)]);
  return (state, ownProps) => ({
    initialValues: buildInitialValues(ownProps),
    formValues: behandlingFormValueSelector(formName, ownProps.behandlingId, ownProps.behandlingVersjon)(
      state,
      'begrunnelse',
      'fritekstTilBrev',
      'klageVurdering',
      'klageVurderingOmgjoer',
      'klageMedholdArsak',
    ),
    onSubmit,
  });
};

const BehandleKlageFormKa = connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(BehandleKlageFormKaImpl),
);

export default injectIntl(BehandleKlageFormKa);
