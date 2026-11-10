import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { AktivitetsvilkåretIkkeOppfyltÅrsak } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/AktivitetsvilkåretIkkeOppfyltÅrsak.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { $VurderingAvAktivitetsvilkårEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/aktivitet/VurderingAvAktivitetsvilkårEtterAvklaringDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { OpphørVilkårsvurderingOppsett } from '../OpphørVilkårsvurdering.js';

export const aktivitetVilkårsvurderingOppsett: OpphørVilkårsvurderingOppsett = {
  vilkårType: vilkarType.AKTIVITETSVILKÅR,
  aksjonspunktKode: AksjonspunktDefinisjon.VURDER_AKTIVITETSVILKÅR_OPPHØR,
  årsakSomKreverFritekstIBrev: AktivitetsvilkåretIkkeOppfyltÅrsak.ANNET,
  begrunnelseMaxLength: $VurderingAvAktivitetsvilkårEtterAvklaringDto.properties.begrunnelse.maxLength,
  tekster: {
    varsel: 'Vurder om bruker ikke lenger er i aktivitet.',
    overskrift: 'Vurdering av ikke i aktivitet',
    lovreferanse: '§ 8',
    begrunnelseLedetekst: (
      <>
        Vurder om bruker ikke lenger er i aktivitet, jf.{' '}
        <Lovreferanse includeFullTextInLink isAktivitetspenger>
          § 8 Medlemmets medvirknings- og aktivitetsplikt og konsekvenser av fravær
        </Lovreferanse>
      </>
    ),
    spørsmål: 'Skal ytelsen opphøre fordi bruker ikke er i aktivitet?',
    nei: 'Nei',
  },
};
