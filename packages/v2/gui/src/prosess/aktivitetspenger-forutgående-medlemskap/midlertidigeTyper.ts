// TODO: Fjern når ung-sak-typescript-client er publisert med fritekstVurderingBrev
import type { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { BekreftetAksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/BekreftetAksjonspunktDto.js';
import type { MedlemskapPeriodeInfoDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/medlemskap/MedlemskapPeriodeInfoDto.js';

export type MedlemskapPeriodeInfoMedFritekstDto = MedlemskapPeriodeInfoDto & { fritekstVurderingBrev?: string };

export type BekreftErMedlemVurderingMedFritekstDto = Extract<
  BekreftetAksjonspunktDto,
  { '@type': typeof AksjonspunktDefinisjon.AVKLAR_GYLDIG_MEDLEMSKAP }
> & { fritekstVurderingBrev?: string };

export const fritekstVurderingBrevMaxLength = 10000;
