import { KodeverkMedNavn, Kodeverk, AlleKodeverk } from '@k9-sak-web/types';
import kodeverkTyper from '@fpsak-frontend/kodeverk/src/kodeverkTyper';
import BehandlingType from '@fpsak-frontend/kodeverk/src/behandlingType';

import { K9sakApiKeys, restApiHooks } from './k9sakApi';
import KodeverkType from '@fpsak-frontend/kodeverk/src/kodeverkTyper';

/**
 * Hook som henter kodeverk knyttet til behandlingstype
 */
export function useKodeverk(behandlingType: string) {
  const alleKodeverkK9Sak = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.KODEVERK);
  const alleKodeverkTilbake = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.KODEVERK_TILBAKE);
  const alleKlageKodeverk = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.KODEVERK_KLAGE);

  if (
    BehandlingType.TILBAKEKREVING === behandlingType ||
    BehandlingType.TILBAKEKREVING_REVURDERING === behandlingType
  ) {
    return alleKodeverkTilbake;
  }
  return behandlingType === BehandlingType.KLAGE ? alleKlageKodeverk : alleKodeverkK9Sak;
}

/**
 * Hook som henter et gitt FPSAK-kodeverk fra respons som allerede er hentet fra backend. For å kunne bruke denne
 * må @see useGlobalStateRestApi først brukes for å hente data fra backend
 */
export function useFpSakKodeverk<T = KodeverkMedNavn>(kodeverkType: string): T[] {
  const alleKodeverk = restApiHooks.useGlobalStateRestApiData(K9sakApiKeys.KODEVERK);
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
export function useFpSakKodeverkMedNavn(kode: string, kodeverk: KodeverkType, undertype?: string) {
  let kodeverkForType = useFpSakKodeverk<KodeverkMedNavn>(kodeverk);

  if (!kodeverkForType || kodeverkForType.length === 0) {
    throw Error(`Det finnes ingen kodeverk for type ${kodeverk} med kode ${kode}`);
  }

  if (undertype) {
    kodeverkForType = kodeverkForType[undertype];
  }

  return kodeverkForType.find(k => k.kode === kode);
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
    kode: string,
    kodeverk: KodeverkType,
    behandlingType: string = BehandlingType.FORSTEGANGSSOKNAD,
  ) => {

    const kodeverkForType = (behandlingType === BehandlingType.TILBAKEKREVING || behandlingType === BehandlingType.TILBAKEKREVING_REVURDERING)
      ? alleTilbakeKodeverk[kodeverk] : alleK9SakKodeverk[kodeverk];

    if (!kodeverkForType || kodeverkForType.length === 0) {
      throw Error(`Det finnes ingen kodeverk for type ${kodeverk} med kode ${kode}`);
    }

    return kodeverkForType.find(k => k.kode === kode);
  };
}
