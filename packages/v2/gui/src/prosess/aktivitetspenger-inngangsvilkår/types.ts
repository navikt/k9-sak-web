import type { AksjonspunktDto } from '@k9-sak-web/backend/ungsak/kontrakt/aksjonspunkt/AksjonspunktDto.js';

export type SubmitCallback = (
  data: Array<{ kode: AksjonspunktDto['definisjon']; begrunnelse: string }>,
  aksjonspunkt: Array<Pick<AksjonspunktDto, 'definisjon'>>,
) => Promise<unknown>;

export const InngangsvilkårTab = {
  SØKNADSFRIST: 'søknadsfrist',
  ALDER: 'alder',
  BOSATT_I_TRONDHEIM: 'bosatt_i_trondheim',
  ANDRE_LIVSOPPHOLDYTELSER: 'andre_livsoppholdytelser',
  BEHOV_FOR_BISTAND: 'behov_for_bistand',
  BESLUTTER: 'beslutter',
} as const;

export type InngangsvilkårTab = (typeof InngangsvilkårTab)[keyof typeof InngangsvilkårTab];
