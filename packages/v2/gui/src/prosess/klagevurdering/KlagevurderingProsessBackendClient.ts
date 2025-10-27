import { noNavK9Klage_hentValgbareKlagehjemler } from '@k9-sak-web/backend/ungsak/generated/sdk.js';

export default class KlagevurderingProsessBackendClient {
  async hentValgbareKlagehjemler() {
    return (await noNavK9Klage_hentValgbareKlagehjemler()).data;
  }
}
