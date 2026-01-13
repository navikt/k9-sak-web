import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import { k9_sak_kontrakt_kompletthet_Status as InntektsmeldingStatus } from '@navikt/k9-sak-typescript-client/types';
import { InntektsmeldingKode, type TilstandBeriket } from '../types/KompletthetData';
import { aksjonspunktStatus } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktStatus.js';

export const finnAktivtAksjonspunkt = (aksjonspunkter: AksjonspunktDto[]): AksjonspunktDto | undefined =>
  aksjonspunkter.find(aksjonspunkt => aksjonspunkt.status === aksjonspunktStatus.OPPRETTET);

export const skalVurderes = (tilstand: TilstandBeriket): boolean =>
  tilstand?.tilVurdering &&
  tilstand?.status.some(status => status.status === InntektsmeldingStatus.MANGLER) &&
  tilstand?.vurdering === InntektsmeldingKode.TOM;

export const ikkePaakrevd = (tilstand: TilstandBeriket): boolean =>
  tilstand?.status.some(status => status.status === InntektsmeldingStatus.IKKE_PÅKREVD);

export const ingenInntektsmeldingMangler = (tilstand: TilstandBeriket): boolean =>
  !tilstand?.status.some(status => status.status === InntektsmeldingStatus.MANGLER);

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
