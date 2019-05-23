import React from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { formPropTypes } from 'redux-form';
import PropTypes from 'prop-types';

import { getSelectedBehandlingspunktAksjonspunkter } from 'behandlingKlage/src/behandlingsprosess/behandlingsprosessKlageSelectors';
import { getBehandlingKlageFormkravResultatNFP, isKlageBehandlingInKA } from 'behandlingKlage/src/selectors/klageBehandlingSelectors';
import { behandlingForm } from 'behandlingKlage/src/behandlingForm';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import FormkravKlageForm, { getPaKlagdVedtak, IKKE_PA_KLAGD_VEDTAK } from './FormkravKlageForm';

/**
 * FormkravklageformNfp
 *
 * Presentasjonskomponent. Setter opp aksjonspunktet for formkrav klage (NFP).
 */
export const FormkravKlageFormNfpImpl = ({
  handleSubmit,
  readOnly,
  readOnlySubmitButton,
  aksjonspunktCode,
  ...formProps
}) => (
  <form onSubmit={handleSubmit}>
    <FormkravKlageForm
      readOnly={readOnly}
      readOnlySubmitButton={readOnlySubmitButton}
      aksjonspunktCode={aksjonspunktCode}
      formProps={formProps}
    />
  </form>
);

FormkravKlageFormNfpImpl.propTypes = {
  aksjonspunktCode: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  readOnlySubmitButton: PropTypes.bool,
  ...formPropTypes,
};

FormkravKlageFormNfpImpl.defaultProps = {
  readOnly: true,
  readOnlySubmitButton: true,
};

const transformValues = (values, aksjonspunktCode) => ({
  erKlagerPart: values.erKlagerPart,
  erFristOverholdt: values.erFristOverholdt,
  erKonkret: values.erKonkret,
  erSignert: values.erSignert,
  begrunnelse: values.begrunnelse,
  kode: aksjonspunktCode,
  vedtak: values.vedtak === IKKE_PA_KLAGD_VEDTAK ? null : values.vedtak,
});

const formName = 'FormkravKlageFormNfp';

const buildInitialValues = createSelector(
  [getBehandlingKlageFormkravResultatNFP],
  (klageFormkavResultatNFP) => {
    const klageFormkavResultatNfp = klageFormkavResultatNFP || null;
    return {
      vedtak: klageFormkavResultatNfp ? getPaKlagdVedtak(klageFormkavResultatNfp) : null,
      begrunnelse: klageFormkavResultatNfp ? klageFormkavResultatNfp.begrunnelse : null,
      erKlagerPart: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagerPart : null,
      erKonkret: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlageKonkret : null,
      erFristOverholdt: klageFormkavResultatNfp ? klageFormkavResultatNfp.erKlagefirstOverholdt : null,
      erSignert: klageFormkavResultatNfp ? klageFormkavResultatNfp.erSignert : null,
    };
  },
);

const mapStateToPropsFactory = (initialState, ownProps) => {
  const aksjonspunktCode = getSelectedBehandlingspunktAksjonspunkter(initialState)[0].definisjon.kode;
  const onSubmit = values => ownProps.submitCallback([transformValues(values, aksjonspunktCode)]);
  return state => ({
    aksjonspunktCode,
    initialValues: buildInitialValues(state),
    readOnly: ownProps.readOnly || isKlageBehandlingInKA(state),
    onSubmit,
  });
};

const FormkravKlageFormNfp = connect(mapStateToPropsFactory)(behandlingForm({
  form: formName,
})(FormkravKlageFormNfpImpl));

FormkravKlageFormNfp.supports = apCodes => apCodes.includes(aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP);

export default FormkravKlageFormNfp;
