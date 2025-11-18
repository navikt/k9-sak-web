import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';

export const erTilbakekreving = (behandlingType?: string): boolean =>
  !!behandlingType &&
  (behandlingType === BehandlingTypeK9Klage.TILBAKEKREVING ||
    behandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING);

export const erKlage = (behandlingType?: string): boolean =>
  !!behandlingType && behandlingType === BehandlingTypeK9Klage.KLAGE;

export const finnKodeverkTypeForBehandlingType = (
  behandlingType?: string,
): 'kodeverkTilbake' | 'kodeverkKlage' | 'kodeverk' => {
  if (erTilbakekreving(behandlingType)) {
    return 'kodeverkTilbake';
  }
  if (erKlage(behandlingType)) {
    return 'kodeverkKlage';
  }
  return 'kodeverk';
};
