import { useQuery } from '@tanstack/react-query';
import { kodeverk_alleKodeverdierSomObjekt as ungsak_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/ungsak/generated/sdk.js';
import { kodeverk_alleKodeverdierSomObjekt as ungtilbake_kodeverk_alleKodeverdierSomObjekt } from '@k9-sak-web/backend/ungtilbake/generated/sdk.js';
import { FailingUngSakKodeverkoppslag, UngSakKodeverkoppslag } from "./UngSakKodeverkoppslag.js";
import { FailingUngTilbakeKodeverkoppslag, UngTilbakeKodeverkoppslag } from "./UngTilbakeKodeverkoppslag.js";

export interface UngKodeverkoppslag {
  readonly isPending: boolean;
  readonly ungSak: UngSakKodeverkoppslag;
  readonly ungTilbake: UngTilbakeKodeverkoppslag;
}

// Bruk context istadenfor denne hook. `useContext(UngKodeverkoppslagContext)`
export const useUngKodeverkoppslag = (hentTilbakeKodeverk: boolean): UngKodeverkoppslag => {
  const ungSakQuery = useQuery({
    queryKey: ['ungSak-kodeverkoppslag'],
    queryFn: async () => (await ungsak_kodeverk_alleKodeverdierSomObjekt()).data,
  });
  const ungTilbakeQuery = useQuery({
    queryKey: ['ungTilbake-kodeverkoppslag'],
    queryFn: async () => {
      const res = await ungtilbake_kodeverk_alleKodeverdierSomObjekt();
      return res.data;
    },
    enabled: hentTilbakeKodeverk,
  });

  const isPending =
    ungSakQuery.isPending ||
    (hentTilbakeKodeverk && ungTilbakeQuery.isPending);

  if (isPending) {
    return {
      isPending,
      ungSak: new FailingUngSakKodeverkoppslag(),
      ungTilbake: new FailingUngTilbakeKodeverkoppslag(),
    };
  }
  if (ungSakQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${ungSakQuery.error}`, { cause: ungSakQuery.error });
  }
  if (ungTilbakeQuery.isError) {
    throw new Error(`Feil ved henting av kodeverk oppslag: ${ungTilbakeQuery.error}`, { cause: ungTilbakeQuery.error });
  }
  return {
    isPending,
    ungSak: new UngSakKodeverkoppslag(ungSakQuery.data),
    ungTilbake: ungTilbakeQuery.isPending
      ? new FailingUngTilbakeKodeverkoppslag()
      : new UngTilbakeKodeverkoppslag(ungTilbakeQuery.data),
  };
};
