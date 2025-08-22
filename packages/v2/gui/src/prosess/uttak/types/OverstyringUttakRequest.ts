import type {
  k9_sak_kontrakt_aksjonspunkt_BekreftetAksjonspunktDto as BekreftetAksjonspunktDto,
  k9_sak_kontrakt_aksjonspunkt_BekreftetOgOverstyrteAksjonspunkterDto as BekreftetOgOverstyrteAksjonspunkterDto,
  k9_sak_kontrakt_uttak_overstyring_OverstyrUttakPeriodeDto as OverstyrUttakPeriodeDto,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

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
