import { K9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { FailingK9KlageKodeverkoppslag, K9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { kodeverk_alleKodeverdierSomObjekt as k9klage_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as k9sak_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as k9tilbake_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import type { foreldrepenger_tilbakekreving_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse as k9tilbakeKodeverkResponse } from '@k9-sak-web/backend/k9tilbake/generated/types.js';
import type { k9_klage_web_app_tjenester_kodeverk_dto_AlleKodeverdierSomObjektResponse as k9klageKodeverkResponse } from '@k9-sak-web/backend/k9klage/generated/types.js';
import { FailingK9TilbakeKodeverkoppslag, K9TilbakeKodeverkoppslag } from './K9TilbakeKodeverkoppslag.js';

export interface K9Kodeverkoppslag {
  readonly k9sak: K9SakKodeverkoppslag;
  readonly k9klage: K9KlageKodeverkoppslag;
  readonly k9tilbake: K9TilbakeKodeverkoppslag;
}

const k9SakQueryOptions = queryOptions({
  queryKey: ['k9sak-kodeverkoppslag'],
  queryFn: async () => (await k9sak_kodeverk_alleKodeverdierSomObjekt()).data,
  staleTime: Infinity,
  select: data => {
    return new K9SakKodeverkoppslag(data);
  },
});

const k9KlageQueryOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: ['k9klage-kodeverkoppslag', enabled],
    queryFn: async (): Promise<k9klageKodeverkResponse | null> =>
      enabled ? (await k9klage_kodeverk_alleKodeverdierSomObjekt()).data : null,
    staleTime: Infinity,
    select: data => (data != null ? new K9KlageKodeverkoppslag(data) : new FailingK9KlageKodeverkoppslag()),
    placeholderData: null,
  });

const k9TilbakeQueryOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: ['k9tilbake-kodeverkoppslag', enabled],
    queryFn: async (): Promise<k9tilbakeKodeverkResponse | null> =>
      enabled ? (await k9tilbake_kodeverk_alleKodeverdierSomObjekt()).data : null,
    staleTime: Infinity,
    select: data => (data != null ? new K9TilbakeKodeverkoppslag(data) : new FailingK9TilbakeKodeverkoppslag()),
    placeholderData: null,
  });

export const kodeverkOppslagQueryOptions = {
  k9sak: k9SakQueryOptions,
  k9klage: k9KlageQueryOptions,
  k9tilbake: k9TilbakeQueryOptions,
};

// Bruk context istadenfor denne hook. `useContext(K9KodeverkoppslagContext)`
export const useK9Kodeverkoppslag = (hentKlageKodeverk: boolean, hentTilbakeKodeverk: boolean): K9Kodeverkoppslag => {
  const { data: k9sak } = useSuspenseQuery(k9SakQueryOptions);
  const { data: k9klage } = useSuspenseQuery(k9KlageQueryOptions(hentKlageKodeverk));
  const { data: k9tilbake } = useSuspenseQuery(k9TilbakeQueryOptions(hentTilbakeKodeverk));

  return {
    k9sak,
    k9klage,
    k9tilbake,
  };
};
