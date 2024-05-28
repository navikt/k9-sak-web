import type { Språkkode } from '@k9-sak-web/backend/k9sak/kodeverk/Språkkode.ts';
import type { BehandlingTypeKodeverk } from '@k9-sak-web/backend/combined/kodeverk/behandling/BehandlingType.ts';

/**
 * Blir brukt for å sende nødvendig info om behandling ned til subkomponenter.
 *
 * Er eit subsett av BehandlingAppKontekst type frå types/src/behandlingAppKontekstTsType.ts, henta inn her så vi kan
 * definere det som trengs å sendast inn i props til nye v2/ komponenter.
 *
 * Denne fila bør kanskje flyttast til ein anna katalog etterkvart.
 */
export type BehandlingInfo = Readonly<{
  id: number;
  uuid: string;
  sprakkode: Språkkode;

  type: BehandlingTypeKodeverk;
}>;
