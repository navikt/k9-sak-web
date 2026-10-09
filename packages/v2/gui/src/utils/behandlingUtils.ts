import { BehandlingType } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.js';
import type { BehandlingDto } from '@k9-sak-web/backend/combined/kontrakt/behandling/BehandlingDto.js';
import { behandlingType as BehandlingTypeK9Klage } from '@k9-sak-web/backend/k9klage/kodeverk/behandling/BehandlingType.js';
import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';

export const erTilbakekreving = (behandlingType?: string): boolean =>
  !!behandlingType &&
  (behandlingType === BehandlingTypeK9Klage.TILBAKEKREVING ||
    behandlingType === BehandlingTypeK9Klage.REVURDERING_TILBAKEKREVING);

export const erKlage = (behandlingType?: string): boolean =>
  !!behandlingType && behandlingType === BehandlingTypeK9Klage.KLAGE;

export const erAktivitetspengerOpphørsbehandling = (behandling: {
  type?: BehandlingDto['type'];
  behandlingÅrsaker?: BehandlingDto['behandlingÅrsaker'];
}): boolean => {
  if (behandling.type === BehandlingType.REVURDERING) {
    const opphørsårsaker = [BehandlingÅrsakType.ENDRET_BOSTED, BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE];
    return !!behandling.behandlingÅrsaker?.some(årsak => opphørsårsaker.some(å => å === årsak.behandlingArsakType));
  }
  return false;
};

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
