// import type { AksjonspunktCodes } from '@k9-sak-web/backend/k9sak/kodeverk/AksjonspunktCodes.js';
import type { UseMutateFunction } from '@tanstack/react-query';
import type { OverstyrUttakHandling } from '../overstyr-uttak/OverstyrUttak';
import type {
  BekreftetAksjonspunktDto,
  BekreftetOgOverstyrteAksjonspunkterDto,
  OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';

export type OverstyringUttakHandling = {
  action: keyof typeof OverstyrUttakHandling;
  values?: OverstyrUttakPeriodeDto;
};

export type HandleOverstyringType = UseMutateFunction<unknown, Error, OverstyringUttakHandling, void>;

export type OverstyrUttakAksjonspunktDto = {
  '@type': string;
  lagreEllerOppdater: OverstyrUttakPeriodeDto[];
  slett: { id: number | string }[];
  periode: { fom: string; tom: string };
  erVilkarOk: boolean;
  gåVidere: boolean;
};

export type OverstyringUttakRequest = BekreftetOgOverstyrteAksjonspunkterDto & {
  overstyrteAksjonspunktDtoer: BekreftetAksjonspunktDto & OverstyrUttakAksjonspunktDto[];
};
