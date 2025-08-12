import type {
  sak_kontrakt_aksjonspunkt_BekreftetAksjonspunktDto as BekreftetAksjonspunktDto,
  sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto as BekreftetOgOverstyrteAksjonspunkterDto,
  sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto,
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
