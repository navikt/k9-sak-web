import type { PersonopplysningDto } from '@k9-sak-web/backend/k9sak/generated';

export interface Periode {
  id: string;
  vurderingsdato: string;
  årsaker: string[];
  aksjonspunkter: string[];
  begrunnelse: string;
  personopplysninger: PersonopplysningDto;
  bosattVurdering?: boolean;
  vurdertAv: string;
  vurdertTidspunkt: string;
  isBosattAksjonspunktClosed: boolean;
  isPeriodAksjonspunktClosed: boolean;
  medlemskapManuellVurderingType: string;
  oppholdsrettVurdering?: boolean;
  erEosBorger: boolean;
  lovligOppholdVurdering?: boolean;
}
