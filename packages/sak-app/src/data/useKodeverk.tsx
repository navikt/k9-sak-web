import { KodeverkMedNavn, Kodeverk } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { K9sakApiKeys, restApiHooks } from './k9sakApi';

/**
 * Hook som henter kodeverk knyttet til behandlingstype
 */
export function useKodeverk<T = KodeverkMedNavn>(behandlingType: string): { [key: string]: T[] } {
  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK);
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKlageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK_KLAGE);

  if (
    BehandlingType.TILBAKEKREVING === behandlingType ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType
  ) {
    return alleKodeverkTilbake;
  }
  return BehandlingType.KLAGE === behandlingType ? alleKlageKodeverk : alleKodeverkK9Sak;
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
 * Hook som henter et gitt FPTILBAKE-kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpTilbakeKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: T[] }>(K9sakApiKeys.KODEVERK_TILBAKE);
  return alleKodeverk ? alleKodeverk[kodeverkType] : undefined;
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

  // @ts-ignore Fiks dette
  const kodeverk = kodeverkForType.find(k => k.kode === kodeverkOjekt.kode);
  return kodeverk;
}

/**
 * Hook som brukes når en har behov for en funksjon som slår opp kodeverknavn. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useGetKodeverkFn() {
  const alleK9SakKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK,
  );
  const alleTilbakeKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_TILBAKE,
  );
  const alleKlageKodeverk = restApiHooks.useGlobalStateRestApiData<{ [key: string]: KodeverkMedNavn[] }>(
    K9sakApiKeys.KODEVERK_KLAGE,
  );

  return (
    kodeverkOjekt: Kodeverk,
    behandlingType: Kodeverk = { kode: BehandlingType.FORSTEGANGSSOKNAD, kodeverk: 'DUMMY' },
  ) => {
    const kodeverkType = kodeverkTyper[kodeverkOjekt.kodeverk];

    let kodeverkForType = alleK9SakKodeverk[kodeverkType];
    if (
      behandlingType.kode === BehandlingType.TILBAKEKREVING ||
      behandlingType.kode === BehandlingType.TILBAKEKREVING_REVURDERING
    ) {
      kodeverkForType = alleTilbakeKodeverk[kodeverkType];
    } else if (behandlingType.kode === BehandlingType.KLAGE) {
      kodeverkForType = alleKlageKodeverk[kodeverkType];
    }

    if (!kodeverkForType || kodeverkForType.length === 0) {
      throw Error(`Det finnes ingen kodeverk for type ${kodeverkType} med kode ${kodeverkOjekt.kode}`);
    }
    const kodeverk = kodeverkForType.find(k => k.kode === kodeverkOjekt.kode);
    return kodeverk;
  };
}
