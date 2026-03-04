import type { UseMutateFunction } from '@tanstack/react-query';
import type { OverstyrUttakHandling } from '../overstyr-uttak/OverstyrUttak';
import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';

export type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};

export type HandleOverstyringType = UseMutateFunction<unknown, Error, OverstyringUttakHandling, void>;
