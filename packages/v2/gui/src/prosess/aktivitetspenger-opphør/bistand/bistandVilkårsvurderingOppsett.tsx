import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { BistandsvilkårIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/BistandsvilkårIkkeOppfyltÅrsak.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { $VurderingAvBistandsvilkårEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/bistand/VurderingAvBistandsvilkårEtterAvklaringDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { OpphørVilkårsvurderingOppsett } from '../OpphørVilkårsvurdering.js';

export const bistandVilkårsvurderingOppsett: OpphørVilkårsvurderingOppsett = {
  vilkårType: vilkarType.BISTANDSVILKÅR,
  aksjonspunktKode: AksjonspunktDefinisjon.VURDER_BISTANDSVILKÅR_OPPHØR,
  årsakSomKreverFritekstIBrev: BistandsvilkårIkkeOppfyltÅrsak.ANNET,
  begrunnelseMaxLength: $VurderingAvBistandsvilkårEtterAvklaringDto.properties.begrunnelse.maxLength,
  tekster: {
    varsel: 'Vurder om bruker ikke lenger har behov for bistand.',
    overskrift: 'Vurdering av ikke lenger behov for bistand',
    lovreferanse: '§ 6',
    begrunnelseLedetekst: (
      <>
        Vurder om bruker ikke lenger har behov for bistand, jf.{' '}
        <Lovreferanse includeFullTextInLink isAktivitetspenger>
          § 6 Behov for bistand
        </Lovreferanse>
      </>
    ),
    spørsmål: 'Skal ytelsen opphøres fordi bruker ikke lenger har behov for bistand?',
    nei: 'Nei',
  },
};
