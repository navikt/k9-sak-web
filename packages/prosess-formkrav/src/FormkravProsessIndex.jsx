import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import messages from '../i18n/nb_NO.json';
import FormkravKlageFormNfp from './components/FormkravKlageFormNfp';
import FormkravKlageFormKa from './components/FormkravKlageFormKa';
import formkravBehandlingPropType from './propTypes/formkravBehandlingPropType';
import avsluttetBehandlingPropType from './propTypes/avsluttetBehandlingPropType';
import formkravKlageVurderingPropType from './propTypes/formkravKlageVurderingPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const FormkravProsessIndex = ({
  behandling,
  klageVurdering,
  avsluttedeBehandlinger,
  aksjonspunkter,
  submitCallback,
  isReadOnly,
  readOnlySubmitButton,
  alleKodeverk,
  parterMedKlagerett,
  valgtPartMedKlagerett,
  fagsak,
  arbeidsgiverOpplysningerPerId,
}) => (
  <RawIntlProvider value={intl}>
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_NFP) && (
        <FormkravKlageFormNfp
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          klageVurdering={klageVurdering}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          alleKodeverk={alleKodeverk}
          avsluttedeBehandlinger={avsluttedeBehandlinger}
          parterMedKlagerett={parterMedKlagerett}
          valgtPartMedKlagerett={valgtPartMedKlagerett}
          fagsakPerson={fagsak.person}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon.kode === aksjonspunktCodes.VURDERING_AV_FORMKRAV_KLAGE_KA) && (
        <FormkravKlageFormKa
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          klageVurdering={klageVurdering}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          readOnlySubmitButton={readOnlySubmitButton}
          alleKodeverk={alleKodeverk}
          avsluttedeBehandlinger={avsluttedeBehandlinger}
          parterMedKlagerett={parterMedKlagerett}
          valgtPartMedKlagerett={valgtPartMedKlagerett}
          fagsakPerson={fagsak.person}
          arbeidsgiverOpplysningerPerId={arbeidsgiverOpplysningerPerId}
        />
      )}
  </RawIntlProvider>
);

FormkravProsessIndex.propTypes = {
  behandling: formkravBehandlingPropType.isRequired,
  klageVurdering: formkravKlageVurderingPropType,
  avsluttedeBehandlinger: PropTypes.arrayOf(avsluttetBehandlingPropType).isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  parterMedKlagerett: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  valgtPartMedKlagerett: PropTypes.shape(),
  fagsak: PropTypes.shape(),
  arbeidsgiverOpplysningerPerId: PropTypes.shape(),
};

FormkravProsessIndex.defaultProps = {
  klageVurdering: {},
};

export default FormkravProsessIndex;
