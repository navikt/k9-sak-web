import React from 'react';
import PropTypes from 'prop-types';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';

import messages from '../i18n/nb_NO.json';
import BehandleKlageFormKa from './components/ka/BehandleKlageFormKa';
import BehandleKlageFormNfp from './components/nfp/BehandleKlageFormNfp';
import klageVurderingPropType from './propTypes/klageVurderingPropType';
import klagevurderingBehandlingPropType from './propTypes/klagevurderingBehandlingPropType';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

const KlagevurderingProsessIndex = ({
  fagsak,
  behandling,
  klageVurdering,
  alleKodeverk,
  saveKlage,
  submitCallback,
  isReadOnly,
  previewCallback,
  readOnlySubmitButton,
  aksjonspunkter,
}) => (
  <RawIntlProvider value={intl}>
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NK) && (
        <BehandleKlageFormKa
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          språkkode={behandling.språkkode}
          klageVurdering={klageVurdering}
          saveKlage={saveKlage}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          alleKodeverk={alleKodeverk}
        />
      )}
    {Array.isArray(aksjonspunkter) &&
      aksjonspunkter.some(a => a.definisjon.kode === aksjonspunktCodes.BEHANDLE_KLAGE_NFP) && (
        <BehandleKlageFormNfp
          fagsak={fagsak}
          behandlingId={behandling.id}
          behandlingVersjon={behandling.versjon}
          språkkode={behandling.språkkode}
          klageVurdering={klageVurdering}
          saveKlage={saveKlage}
          submitCallback={submitCallback}
          readOnly={isReadOnly}
          previewCallback={previewCallback}
          readOnlySubmitButton={readOnlySubmitButton}
          alleKodeverk={alleKodeverk}
        />
      )}
  </RawIntlProvider>
);

KlagevurderingProsessIndex.propTypes = {
  fagsak: PropTypes.shape().isRequired,
  behandling: klagevurderingBehandlingPropType.isRequired,
  klageVurdering: klageVurderingPropType.isRequired,
  alleKodeverk: PropTypes.shape().isRequired,
  saveKlage: PropTypes.func.isRequired,
  submitCallback: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool.isRequired,
  previewCallback: PropTypes.func.isRequired,
  readOnlySubmitButton: PropTypes.bool.isRequired,
  aksjonspunkter: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default KlagevurderingProsessIndex;
