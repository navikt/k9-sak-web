import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { AktivitetspengerApi } from '../../aktivitetspenger-prosess/AktivitetspengerApi';

export const sendTilBeslutter = async (api: AktivitetspengerApi, behandling: BehandlingDto) => {
  const payload = {
    '@type': AksjonspunktDefinisjon.LOKALKONTOR_FORESLÅR_VILKÅR,
    begrunnelse: 'Send til beslutter',
  };

  await api.bekreftAksjonspunkt(behandling.uuid, behandling.versjon, [payload]);
};
