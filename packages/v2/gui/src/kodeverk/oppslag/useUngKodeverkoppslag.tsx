import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';
import { kodeverk_alleKodeverdierSomObjekt as ungsak_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as ungtilbake_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import { UngSakKodeverkoppslag } from './UngSakKodeverkoppslag.js';
import { FailingUngTilbakeKodeverkoppslag, UngTilbakeKodeverkoppslag } from './UngTilbakeKodeverkoppslag.js';

export interface UngKodeverkoppslag {
  readonly ungSak: UngSakKodeverkoppslag;
  readonly ungTilbake: UngTilbakeKodeverkoppslag;
}

const ungSakQueryOptions = queryOptions({
  queryKey: ['ungSak-kodeverkoppslag'],
  queryFn: async () => (await ungsak_kodeverk_alleKodeverdierSomObjekt()).data,
  staleTime: Infinity,
  select: data => new UngSakKodeverkoppslag(data),
});

const ungTilbakeQueryOptions = (enabled: boolean) =>
  queryOptions({
    queryKey: ['ungTilbake-kodeverkoppslag', enabled],
    queryFn: async () => (enabled ? (await ungtilbake_kodeverk_alleKodeverdierSomObjekt()).data : null),
    staleTime: Infinity,
    select: data => (data != null ? new UngTilbakeKodeverkoppslag(data) : new FailingUngTilbakeKodeverkoppslag()),
    placeholderData: null,
  });

// Bruk context istadenfor denne hook. `use(UngKodeverkoppslagContext)`
export const useUngKodeverkoppslag = (hentTilbakeKodeverk: boolean): UngKodeverkoppslag => {
  const { data: ungSak } = useSuspenseQuery(ungSakQueryOptions);
  const { data: ungTilbake } = useSuspenseQuery(ungTilbakeQueryOptions(hentTilbakeKodeverk));

  return {
    ungSak,
    ungTilbake,
  };
};
