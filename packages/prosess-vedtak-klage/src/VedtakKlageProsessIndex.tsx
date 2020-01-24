import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import Behandling from '@k9-frontend/types/src/behandlingTsType';
import AlleKodeverk from '@k9-frontend/types/src/kodeverk';
import KlageVurdering from '@k9-frontend/types/src/klage/klageVurderingTsType';
import Aksjonspunkt from '@k9-frontend/types/src/aksjonspunktTsType';
import VedtakKlageForm from './components/VedtakKlageForm';
import messages from '../i18n/nb_NO.json';

const cache = createIntlCache();

const intl = createIntl(
  {
    locale: 'nb-NO',
    messages,
  },
  cache,
);

interface VedtakKlageProsessIndexProps {
  behandling: Behandling;
  klageVurdering: KlageVurdering;
  aksjonspunkter: Aksjonspunkt[];
  submitCallback: () => void; // TODO: hva er parametre og returtype?
  // submitCallback: ({
  //   kode: apCode,
  //   begrunnelse: values.fritekstTilBrev
  // }[]) => void
  previewVedtakCallback: () => void; // TODO: hva er parametre og returtype?
  readOnly: boolean;
  alleKodeverk: AlleKodeverk;
}

const VedtakKlageProsessIndex: React.FunctionComponent<VedtakKlageProsessIndexProps> = ({
  behandling,
  klageVurdering,
  aksjonspunkter,
  submitCallback,
  previewVedtakCallback,
  readOnly,
  alleKodeverk,
}) => (
  <RawIntlProvider value={intl}>
    <VedtakKlageForm
      behandlingId={behandling.id}
      behandlingVersjon={behandling.versjon}
      behandlingsresultat={behandling.behandlingsresultat}
      behandlingPaaVent={behandling.behandlingPaaVent}
      klageVurdering={klageVurdering}
      aksjonspunkter={aksjonspunkter}
      submitCallback={submitCallback}
      previewVedtakCallback={previewVedtakCallback}
      readOnly={readOnly}
      alleKodeverk={alleKodeverk}
    />
  </RawIntlProvider>
);

export default VedtakKlageProsessIndex;
