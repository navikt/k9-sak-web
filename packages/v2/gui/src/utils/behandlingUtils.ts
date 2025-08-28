import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';

export const erTilbakekreving = (behandlingType?: string): boolean =>
  !!behandlingType &&
  (behandlingType === BehandlingTypeK9Klage.TILBAKEKREVING ||
    behandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING);
