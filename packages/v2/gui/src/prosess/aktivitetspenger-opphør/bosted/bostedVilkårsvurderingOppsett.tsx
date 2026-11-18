import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BostedsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BostedsvilkårIkkeOppfyltÅrsak.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { $VurderingAvBostedsvilkårEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bosted/VurderingAvBostedsvilkårEtterAvklaringDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { OpphørVilkårsvurderingOppsett } from '../OpphørVilkårsvurdering.js';

export const bostedVilkårsvurderingOppsett: OpphørVilkårsvurderingOppsett = {
  vilkårType: vilkarType.BOSTEDSVILKÅR,
  aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BOSTEDSVILKÅR_OPPHØR,
  årsakSomKreverFritekstIBrev: BostedsvilkårIkkeOppfyltÅrsak.ANNET,
  begrunnelseMaxLength: $VurderingAvBostedsvilkårEtterAvklaringDto.properties.begrunnelse.maxLength,
  tekster: {
    varsel: 'Vurder om søker ikke lenger er bosatt i Trondheim kommune.',
    overskrift: 'Vurdering av ikke lenger bosatt i Trondheim kommune',
    lovreferanse: '§ 2',
    begrunnelseLedetekst: (
      <>
        Vurder om bruker har flyttet fra Trondheim kommune, jmf{' '}
        <Lovreferanse includeFullTextInLink isAktivitetspenger>
          §2 Geografisk virkeområde
        </Lovreferanse>
      </>
    ),
    spørsmål: 'Har bruker flyttet fra Trondheim kommune?',
    nei: 'Nei, bruker bor fortsatt i Trondheim kommune',
  },
};
