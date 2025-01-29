import type { FagsakYtelsesTypeKodeverk } from '@k9-sak-web/backend/k9sak/kodeverk/FagsakYtelsesType.ts';
import type { FagsakStatusKodeverk } from '@k9-sak-web/backend/k9sak/kodeverk/behandling/FagsakStatus.ts';

/**
 * Blir brukt for å sende nødvendig info om sak ned til subkomponenter.
 *
 * Er eit subsett av Fagsak type frå types/src/fagsakTsType.ts, henta inn her så vi kan
 * definere det som trengs å sendast inn i props til nye v2/ komponenter.
 *
 * Denne fila bør kanskje flyttast til ein anna katalog etterkvart.
 */
export type Fagsak = Readonly<{
  saksnummer: string;
  sakstype: FagsakYtelsesTypeKodeverk;

  status: FagsakStatusKodeverk;
  person: {
    aktørId?: string;
  };
}>;
