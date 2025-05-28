import type { Personopplysninger } from './Personopplysninger';

export interface Periode {
  aksjonspunkter: string[];
  begrunnelse: string;
  bosattVurdering?: boolean;
  erEosBorger: boolean;
  id: string;
  isBosattAksjonspunktClosed: boolean;
  isPeriodAksjonspunktClosed: boolean;
  lovligOppholdVurdering?: boolean;
  medlemskapManuellVurderingType: string;
  oppholdsrettVurdering?: boolean;
  personopplysninger: Personopplysninger;
  vurderingsdato: string;
  vurdertAv: string;
  vurdertTidspunkt: string;
  årsaker: string[];
}
