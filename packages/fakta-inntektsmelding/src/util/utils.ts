import { initializeDate } from '@fpsak-frontend/utils';
import Aksjonspunkt from '../types/Aksjonspunkt';
import { Kode, TilstandBeriket } from '../types/KompletthetData';
import Status from '../types/TilstandStatus';

// eslint-disable-next-line import/prefer-default-export
export const finnAktivtAksjonspunkt = (aksjonspunkter: Aksjonspunkt[]): Aksjonspunkt =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.status.kode === 'OPPR');

export const skalVurderes = (tilstand: TilstandBeriket): boolean =>
  tilstand?.tilVurdering &&
  tilstand?.status.some(status => [Status.MANGLER].includes(status.status)) &&
  tilstand?.vurdering?.kode === Kode.TOM;

export const ikkePaakrevd = (tilstand: TilstandBeriket): boolean =>
  tilstand?.status.some(status => [Status.IKKE_PÅKREVD].includes(status.status));

export const ingenInntektsmeldingMangler = (tilstand: TilstandBeriket): boolean =>
  !tilstand?.status.some(status => [Status.MANGLER].includes(status.status));

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
