import type {
  BekreftetAksjonspunktDto,
  BekreftetOgOverstyrteAksjonspunkterDto,
  OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated';

export type OverstyringUttakRequest = BekreftetOgOverstyrteAksjonspunkterDto & {
  overstyrteAksjonspunktDtoer: BekreftetAksjonspunktDto &
    {
      '@type': string;
      lagreEllerOppdater: OverstyrUttakPeriodeDto[];
      slett: { id: number | string }[];
      periode: { fom: string; tom: string };
      erVilkarOk: boolean;
      gåVidere: boolean;
    }[];
};
