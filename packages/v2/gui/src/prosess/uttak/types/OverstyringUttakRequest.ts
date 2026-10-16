import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { BekreftetOgOverstyrteAksjonspunkterDto } from '@k9-sak-web/backend/k9sak/kontrakt/aksjonspunkt/BekreftetOgOverstyrteAksjonspunkterDto.js';
import type { OverstyrUttakPeriodeDto } from '@k9-sak-web/backend/k9sak/kontrakt/uttak/overstyring/OverstyrUttakPeriodeDto.js';

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
