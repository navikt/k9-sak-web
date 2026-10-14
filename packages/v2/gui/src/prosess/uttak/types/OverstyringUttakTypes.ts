import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';

export const OverstyrUttakHandling = {
  SLETT: 'SLETT',
  BEKREFT: 'BEKREFT',
  LAGRE: 'LAGRE',
} as const;

export type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};
