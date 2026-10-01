import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';

export enum OverstyrUttakHandling {
  SLETT = 'SLETT',
  BEKREFT = 'BEKREFT',
  LAGRE = 'LAGRE',
}

export type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};
