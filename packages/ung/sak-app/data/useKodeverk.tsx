import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';
import { UngSakApiKeys, restApiHooks } from './ungsakApi';

/**
 * Hook som henter kodeverk knyttet til behandlingstype
 */
export function useKodeverk<T = KodeverkMedNavn>(behandlingType: Kodeverk): { [key: string]: T[] } {
  const alleKodeverkUngSak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(UngSakApiKeys.KODEVERK);
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(
    UngSakApiKeys.KODEVERK_TILBAKE,
  );

  if (
    BehandlingType.TILBAKEKREVING === behandlingType?.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType?.kode
  ) {
    return alleKodeverkTilbake;
  }

  return alleKodeverkUngSak;
}

/**
 * Hook som henter et gitt FPSAK-kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useUngSakKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(UngSakApiKeys.KODEVERK);
  return alleKodeverk[kodeverkType];
}

/**
 * Hook som brukes når en har behov for å slå opp navn-attributtet til et bestemt kodeverk. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useUngSakKodeverkMedNavn<T = KodeverkMedNavn>(kodeverkOjekt: Kodeverk, undertype?: string): T {
  const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];
  let kodeverkForType = useUngSakKodeverk<T>(kodeverkType);

  if (!kodeverkForType || kodeverkForType.length === 0) {
    throw Error(`Det finnes ingen kodeverk for type ${kodeverkType} med kode ${kodeverkOjekt.kode}`);
  }

  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  // @ts-expect-error Migrert frå ts-ignore, uvisst kvifor denne trengs
  const kodeverk = kodeverkForType.find(k => k.kode === kodeverkOjekt.kode);
  return kodeverk;
}

/**
 * Hook som brukes når en har behov for en funksjon som slår opp kodeverknavn. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useGetKodeverkFn() {
  const alleUngSakKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    UngSakApiKeys.KODEVERK,
  );

  return (kodeverkOjekt: Kodeverk) => {
    const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];

    const kodeverkForType = alleUngSakKodeverk[kodeverkType];

    if (!kodeverkForType || kodeverkForType.length === 0) {
      throw Error(`Det finnes ingen kodeverk for type ${kodeverkType} med kode ${kodeverkOjekt.kode}`);
    }
    const kodeverk = kodeverkForType.find(k => k.kode === kodeverkOjekt.kode);
    return kodeverk;
  };
}
