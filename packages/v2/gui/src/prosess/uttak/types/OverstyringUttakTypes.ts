import type { UseMutateFunction } from '@tanstack/react-query';
import type { OverstyrUttakHandling } from '../overstyr-uttak/OverstyrUttak';
import type { k9_sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/generated/types.js';

export type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};

export type HandleOverstyringType = UseMutateFunction<unknown, Error, OverstyringUttakHandling, void>;
