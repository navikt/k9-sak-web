import { Kodeverk, Personopplysninger } from '@k9-sak-web/types';

export interface Periode {
  id: string;
  vurderingsdato: string;
  årsaker: string[];
  aksjonspunkter: string[];
  begrunnelse: string;
  personopplysninger: Personopplysninger;
  bosattVurdering: boolean;
  vurdertAv: string;
  vurdertTidspunkt: string;
  isBosattAksjonspunktClosed: boolean;
  isPeriodAksjonspunktClosed: boolean;
  dekningType: Kodeverk;
  medlemskapManuellVurderingType: Kodeverk;
  oppholdsrettVurdering: boolean;
  erEosBorger?: boolean;
  lovligOppholdVurdering?: boolean;
}
