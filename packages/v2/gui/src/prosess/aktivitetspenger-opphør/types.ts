import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';
import type { BehandlingDto } from '@k9-sak-web/backend/ungsak/kontrakt/behandling/BehandlingDto.js';
import type { VilkårMedPerioderDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/VilkårMedPerioderDto.js';
import type { AktivitetspengerApi } from '../aktivitetspenger-prosess/AktivitetspengerApi.js';

export const OpphørTab = {
  ÅRSAK_OG_VARSEL: 'årsak_og_varsel',
  VILKÅRSVURDERING: 'vilkårsvurdering',
  BESLUTTER: 'beslutter',
} as const;

export type OpphørTab = (typeof OpphørTab)[keyof typeof OpphørTab];

export interface OpphørÅrsakOgVarselProps {
  vurderFaktaAP?: AksjonspunktDto;
  vilkår: VilkårMedPerioderDto;
  api: AktivitetspengerApi;
  behandling: BehandlingDto;
  onAksjonspunktBekreftet: () => void;
  readOnly: boolean;
  isPermanentlyReadOnly: boolean;
}
