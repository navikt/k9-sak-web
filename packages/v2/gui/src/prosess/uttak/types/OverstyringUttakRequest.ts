import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/generated';

export type OverstyringUttakRequest = {
  periode: { fom: string; tom: string };
  erVilkarOk: boolean;
  gåVidere: boolean;
  lagreEllerOppdater: OverstyrUttakPeriodeDto[];
  slett: { id: number | string }[];
};
