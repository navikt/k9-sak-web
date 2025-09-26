import { FailingK9SakKodeverkoppslag, K9SakKodeverkoppslag } from './K9SakKodeverkoppslag.js';
import { useQuery } from '@tanstack/react-query';
import { FailingK9KlageKodeverkoppslag, K9KlageKodeverkoppslag } from './K9KlageKodeverkoppslag.js';
import { kodeverk_alleKodeverdierSomObjekt as k9klage_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9klage/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as k9sak_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9sak/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as k9tilbake_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/k9tilbake/generated/sdk.js';
import { FailingK9TilbakeKodeverkoppslag, K9TilbakeKodeverkoppslag } from './K9TilbakeKodeverkoppslag.js';

export interface K9Kodeverkoppslag {
  readonly isPending: boolean;
  readonly k9sak: K9SakKodeverkoppslag;
  readonly k9klage: K9KlageKodeverkoppslag;
  readonly k9tilbake: K9TilbakeKodeverkoppslag;
}

// Bruk context istadenfor denne hook. `useContext(K9KodeverkoppslagContext)`
export const useK9Kodeverkoppslag = (hentKlageKodeverk: boolean, hentTilbakeKodeverk: boolean): K9Kodeverkoppslag => {
  const k9sakQuery = useQuery({
    queryKey: ['k9sak-kodeverkoppslag'],
    queryFn: async () => (await k9sak_kodeverk_alleKodeverdierSomObjekt()).data,
  });
  const k9klageQuery = useQuery({
    queryKey: ['k9klage-kodeverkoppslag'],
    queryFn: async () => {
      const res = await k9klage_kodeverk_alleKodeverdierSomObjekt();
      return res.data;
    },
    enabled: hentKlageKodeverk,
  });
  const k9tilbakeQuery = useQuery({
    queryKey: ['k9tilbake-kodeverkoppslag'],
    queryFn: async () => {
      const res = await k9tilbake_kodeverk_alleKodeverdierSomObjekt();
      return res.data;
    },
    enabled: hentTilbakeKodeverk,
  });

  const isPending =
    k9sakQuery.isPending ||
    (hentKlageKodeverk && k9klageQuery.isPending) ||
    (hentTilbakeKodeverk && k9tilbakeQuery.isPending);

  if (isPending) {
    return {
      isPending,
      k9sak: new FailingK9SakKodeverkoppslag(),
      k9klage: new FailingK9KlageKodeverkoppslag(),
      k9tilbake: new FailingK9TilbakeKodeverkoppslag(),
    };
  }
  if (k9sakQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${k9sakQuery.error}`, { cause: k9sakQuery.error });
  }
  if (k9klageQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${k9klageQuery.error}`, { cause: k9klageQuery.error });
  }
  if (k9tilbakeQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${k9tilbakeQuery.error}`, { cause: k9tilbakeQuery.error });
  }
  return {
    isPending,
    k9sak: new K9SakKodeverkoppslag(k9sakQuery.data),
    k9klage: k9klageQuery.isPending
      ? new FailingK9KlageKodeverkoppslag()
      : new K9KlageKodeverkoppslag(k9klageQuery.data),
    k9tilbake: k9tilbakeQuery.isPending
      ? new FailingK9TilbakeKodeverkoppslag()
      : new K9TilbakeKodeverkoppslag(k9tilbakeQuery.data),
  };
};
