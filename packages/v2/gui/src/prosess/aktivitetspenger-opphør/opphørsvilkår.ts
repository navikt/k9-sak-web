import { BehandlingÅrsakType } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/BehandlingÅrsakType.js';
import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import type { ComponentType } from 'react';
import type { OpphørVilkårsvurderingOppsett } from './OpphørVilkårsvurdering.js';
import { AktivitetÅrsakOgVarsel } from './aktivitet/AktivitetÅrsakOgVarsel.js';
import { aktivitetVilkårsvurderingOppsett } from './aktivitet/aktivitetVilkårsvurderingOppsett.js';
import { AndreLivsoppholdytelserÅrsakOgVarsel } from './andre-livsoppholdytelser/AndreLivsoppholdytelserÅrsakOgVarsel.js';
import { andreLivsoppholdytelserVilkårsvurderingOppsett } from './andre-livsoppholdytelser/andreLivsoppholdytelserVilkårsvurderingOppsett.js';
import { BistandÅrsakOgVarsel } from './bistand/BistandÅrsakOgVarsel.js';
import { bistandVilkårsvurderingOppsett } from './bistand/bistandVilkårsvurderingOppsett.js';
import { BostedÅrsakOgVarsel } from './bosted/BostedÅrsakOgVarsel.js';
import { bostedVilkårsvurderingOppsett } from './bosted/bostedVilkårsvurderingOppsett.js';
import type { OpphørÅrsakOgVarselProps } from './types.js';

export interface OpphørsvilkårOppsett {
  behandlingÅrsak: BehandlingÅrsakType;
  faktaAksjonspunktKode: AksjonspunktDefinisjon;
  årsakOgVarsel: ComponentType<OpphørÅrsakOgVarselProps>;
  vilkårsvurdering: OpphørVilkårsvurderingOppsett;
}

export const opphørsvilkår: OpphørsvilkårOppsett[] = [
  {
    behandlingÅrsak: BehandlingÅrsakType.ENDRET_BOSTED,
    faktaAksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_OM_BOSTED,
    årsakOgVarsel: BostedÅrsakOgVarsel,
    vilkårsvurdering: bostedVilkårsvurderingOppsett,
  },
  {
    behandlingÅrsak: BehandlingÅrsakType.ENDRET_BISTANDSBEHOV,
    faktaAksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_OM_BISTAND,
    årsakOgVarsel: BistandÅrsakOgVarsel,
    vilkårsvurdering: bistandVilkårsvurderingOppsett,
  },
  {
    behandlingÅrsak: BehandlingÅrsakType.ENDRET_AKTIVITET,
    faktaAksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_OM_AKTIVITET,
    årsakOgVarsel: AktivitetÅrsakOgVarsel,
    vilkårsvurdering: aktivitetVilkårsvurderingOppsett,
  },
  {
    behandlingÅrsak: BehandlingÅrsakType.ENDRET_LIVSOPPHOLDSYTELSE,
    faktaAksjonspunktKode: AksjonspunktDefinisjon.VURDER_FAKTA_OM_ANDRE_LIVSOPPHOLDSYTELSER,
    årsakOgVarsel: AndreLivsoppholdytelserÅrsakOgVarsel,
    vilkårsvurdering: andreLivsoppholdytelserVilkårsvurderingOppsett,
  },
];
