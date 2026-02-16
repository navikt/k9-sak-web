import type { AksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { KompletthetsVurderingDto as KompletthetsVurdering } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/KompletthetsVurderingDto.js';
import { Status as InntektsmeldingStatus } from '@k9-sak-web/backend/k9sak/kontrakt/kompletthet/Status.js';
import { initializeDate } from '@k9-sak-web/lib/dateUtils/initializeDate.js';
import { Period } from '@navikt/ft-utils';
import { InntektsmeldingVurderingRequestKode, type Tilstand, type TilstandMedUiState } from '../types';

/** Transforms backend response to domain model with Period objects */
export const transformKompletthetsdata = (response: KompletthetsVurdering): Tilstand[] =>
  response.tilstand.map(({ periode, status, begrunnelse, tilVurdering, vurdering, vurdertAv, vurdertTidspunkt }) => {
    const [fom = '', tom = ''] = periode.split('/');
    return {
      periode: new Period(fom, tom),
      status,
      begrunnelse,
      tilVurdering,
      vurdering,
      periodeOpprinneligFormat: periode,
      vurdertAv,
      vurdertTidspunkt,
    };
  });

// Denne funksjonen eksisterer for å vite hvilket aksjonspunkt som skal vises når vi ikke har noe aksjonspunkt som må løses.
// Vi er nødt til å vite hvilket aksjonspunkt som skal vises når en skal redigere en tidligere vurdering.
export const finnSisteAksjonspunkt = (aksjonspunkter: AksjonspunktDto[]): AksjonspunktDto | undefined =>
  [...aksjonspunkter].sort((a, b) => Number(b.definisjon) - Number(a.definisjon))[0];

export const skalVurderes = (tilstand: TilstandMedUiState): boolean =>
  tilstand?.tilVurdering &&
  tilstand?.status.some(status => status.status === InntektsmeldingStatus.MANGLER) &&
  tilstand?.vurdering === InntektsmeldingVurderingRequestKode.UDEFINERT;

export const ikkePaakrevd = (tilstand: TilstandMedUiState): boolean =>
  tilstand?.status.some(status => status.status === InntektsmeldingStatus.IKKE_PÅKREVD);

export const ingenInntektsmeldingMangler = (tilstand: TilstandMedUiState): boolean =>
  !tilstand?.status.some(status => status.status === InntektsmeldingStatus.MANGLER);

export const ingenTilstanderHarMangler = (tilstander: TilstandMedUiState[]) =>
  tilstander.every(ingenInntektsmeldingMangler);

export const finnTilstanderSomVurderes = (tilstander: TilstandMedUiState[]): TilstandMedUiState[] =>
  tilstander.filter(skalVurderes);

export const finnTilstanderSomRedigeres = (tilstander: TilstandMedUiState[]): TilstandMedUiState[] =>
  tilstander.filter(tilstand => tilstand.redigeringsmodus);

export const sorterSkjæringstidspunkt = (tilstand1: TilstandMedUiState, tilstand2: TilstandMedUiState): number => {
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
