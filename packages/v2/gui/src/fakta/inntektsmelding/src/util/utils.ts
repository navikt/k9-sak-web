import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import type { Aksjonspunkt } from '@k9-sak-web/types';
import { k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus } from '@navikt/k9-sak-typescript-client/types';
import { Kode, type TilstandBeriket } from '../types/KompletthetData';

export const finnAktivtAksjonspunkt = (aksjonspunkter: Aksjonspunkt[]): Aksjonspunkt | undefined =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.status.kode === 'OPPR');

export const skalVurderes = (tilstand: TilstandBeriket): boolean =>
  tilstand?.tilVurdering &&
  tilstand?.status.some(status => [InntektsmeldingStatus.MANGLER].includes(status.status)) &&
  tilstand?.vurdering === Kode.TOM;

export const ikkePaakrevd = (tilstand: TilstandBeriket): boolean =>
  tilstand?.status.some(status => [InntektsmeldingStatus.IKKE_PÅKREVD].includes(status.status));

export const ingenInntektsmeldingMangler = (tilstand: TilstandBeriket): boolean =>
  !tilstand?.status.some(status => [InntektsmeldingStatus.MANGLER].includes(status.status));

export const ingenTilstanderHarMangler = (tilstander: TilstandBeriket[]) =>
  tilstander.every(ingenInntektsmeldingMangler);

export const finnTilstanderSomVurderes = (tilstander: TilstandBeriket[]): TilstandBeriket[] =>
  tilstander.filter(skalVurderes);

export const finnTilstanderSomRedigeres = (tilstander: TilstandBeriket[]): TilstandBeriket[] =>
  tilstander.filter(tilstand => tilstand.redigeringsmodus);

export const sorterSkjæringstidspunkt = (tilstand1: TilstandBeriket, tilstand2: TilstandBeriket): number => {
  const date1 = initializeDate(tilstand1?.periode?.fom);
  const date2 = initializeDate(tilstand2?.periode?.fom);
  if (date1.isBefore(date2)) {
    return -1;
  }
  if (date2.isBefore(date1)) {
    return 1;
  }
  return 0;
};
