import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import { behandlingForm } from '@fpsak-frontend/form';
import { safeJSONParse } from '@fpsak-frontend/utils';

import FormkravKlageForm, { getPaklagdVedtak, IKKE_PAKLAGD_VEDTAK } from './FormkravKlageForm';
import { erTilbakekreving, påklagdTilbakekrevingInfo } from './FormkravKlageFormNfp';

/**
 * FormkravKlageFormKA
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (KA).
 */
export const FormkravKlageFormKa = ({
  behandlingId,
  behandlingVersjon,
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  alleKodeverk,
  personopplysninger,
  arbeidsgiverOpplysningerPerId,
  avsluttedeBehandlinger,
  parterMedKlagerett,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FormkravKlageForm
      behandlingId={behandlingId}
      behandlingVersjon={behandlingVersjon}
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA}
      formProps={formProps}
      alleKodeverk={alleKodeverk}
      personopplysninger={personopplysninger}
      arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
      avsluttedeBehandlinger={avsluttedeBehandlinger}
      parterMedKlagerett={parterMedKlagerett}
      skalKunneVelgeKlagepart={false}
    />
  </form>
);

FormkravKlageFormKa.propTypes = {
  behandlingId: PropTypes.number.isRequired,
  behandlingVersjon: PropTypes.number.isRequired,
  personopplysninger: PropTypes.shape().isRequired,
  arbeidsgiverOpplysningerPerId: PropTypes.shape().isRequired,
  parterMedKlagerett: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

FormkravKlageFormKa.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

export const transformValues = (values, avsluttedeBehandlinger) => ({
  erKlagerPart: values.erKlagerPart,
  erFristOverholdt: values.erFristOverholdt,
  erKonkret: values.erKonkret,
  erSignert: values.erSignert,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA,
  vedtak: values.vedtak === IKKE_PAKLAGD_VEDTAK ? null : values.vedtak,
  erTilbakekreving: erTilbakekreving(avsluttedeBehandlinger, values.vedtak),
  tilbakekrevingInfo: påklagdTilbakekrevingInfo(avsluttedeBehandlinger, values.vedtak),
  valgtKlagePart: safeJSONParse(values.valgtPartMedKlagerett),
});

const formName = 'FormkravKlageFormKa';

const buildInitialValues = createSelector(
  [
    ownProps => ownProps.klageVurdering,
    ownProps => ownProps.avsluttedeBehandlinger,
    ownProps => ownProps.valgtPartMedKlagerett,
  ],
  (klageVurdering, avsluttedeBehandlinger, valgtPartMedKlagerett) => {
    const klageFormkavResultatKa = klageVurdering ? klageVurdering.klageFormkravResultatKA : null;
    return {
      vedtak: klageFormkavResultatKa ? getPaklagdVedtak(klageFormkavResultatKa, avsluttedeBehandlinger) : null,
      begrunnelse: klageFormkavResultatKa ? klageFormkavResultatKa.begrunnelse : null,
      erKlagerPart: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagerPart : null,
      erKonkret: klageFormkavResultatKa ? klageFormkavResultatKa.erKlageKonkret : null,
      erFristOverholdt: klageFormkavResultatKa ? klageFormkavResultatKa.erKlagefirstOverholdt : null,
      erSignert: klageFormkavResultatKa ? klageFormkavResultatKa.erSignert : null,
      valgtPartMedKlagerett: JSON.stringify(valgtPartMedKlagerett),
    };
  },
);

const mapStateToPropsFactory = (initialState, initialOwnProps) => {
  const onSubmit = values =>
    initialOwnProps.submitCallback([transformValues(values, initialOwnProps.avsluttedeBehandlinger)]);
  return (state, ownProps) => ({
    parterMedKlagerett: ownProps.parterMedKlagerett,
    initialValues: buildInitialValues(ownProps),
    readOnly: ownProps.readOnly,
    onSubmit,
  });
};

export default connect(mapStateToPropsFactory)(
  behandlingForm({
    form: formName,
  })(FormkravKlageFormKa),
);
