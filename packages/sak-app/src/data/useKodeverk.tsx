import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import { Kodeverk, KodeverkMedNavn } from '@k9-sak-web/types';

import { K9sakApiKeys, restApiHooks } from './k9sakApi';

/**
 * Hook som henter kodeverk knyttet til behandlingstype
 */
export function useKodeverk<T = KodeverkMedNavn>(behandlingType: Kodeverk): { [key: string]: T[] } {
  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK);
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKlageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK_KLAGE);

  if (
    BehandlingType.TILBAKEKREVING === behandlingType?.kode ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType?.kode
  ) {
    return alleKodeverkTilbake;
  }
  return BehandlingType.KLAGE === behandlingType?.kode ? alleKlageKodeverk : alleKodeverkK9Sak;
}

/**
 * Hook som henter et gitt FPSAK-kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpSakKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK);
  return alleKodeverk[kodeverkType];
}

/**
 * Hook som brukes når en har behov for å slå opp navn-attributtet til et bestemt kodeverk. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpSakKodeverkMedNavn<T = KodeverkMedNavn>(kodeverkOjekt: Kodeverk, undertype?: string): T {
  const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];
  let kodeverkForType = useFpSakKodeverk<T>(kodeverkType);

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
