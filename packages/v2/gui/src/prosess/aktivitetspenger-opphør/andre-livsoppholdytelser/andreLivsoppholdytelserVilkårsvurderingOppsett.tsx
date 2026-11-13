import { AksjonspunktDefinisjon } from '@k9-sak-web/backend/ungsak/kodeverk/behandling/aksjonspunkt/AksjonspunktDefinisjon.js';
import { vilkarType } from '@k9-sak-web/backend/ungsak/kodeverk/vilkår/VilkårType.js';
import { $VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto } from '@k9-sak-web/backend/ungsak/kontrakt/vilkår/livsopphold/VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto.js';
import { Lovreferanse } from '@k9-sak-web/gui/shared/lovreferanse/Lovreferanse.js';
import type { OpphørVilkårsvurderingOppsett } from '../OpphørVilkårsvurdering.js';

export const andreLivsoppholdytelserVilkårsvurderingOppsett: OpphørVilkårsvurderingOppsett = {
  vilkårType: vilkarType.ANDRE_LIVSOPPHOLDSYTELSER_VILKÅR,
  aksjonspunktKode: AksjonspunktDefinisjon.VURDER_ANDRE_LIVSOPPHOLDSYTELSER_OPPHØR,
  begrunnelseMaxLength: $VurderingAvAndreLivsoppholdsytelserEtterAvklaringDto.properties.begrunnelse.maxLength,
  tekster: {
    varsel: 'Vurder om søker mottar andre livsoppholdsytelser.',
    overskrift: 'Vurdering av andre livsoppholdsytelser',
    lovreferanse: '§ 4',
    begrunnelseLedetekst: (
      <>
        Vurder om bruker mottar annen livoppholdsytelse, jf.{' '}
        <Lovreferanse includeFullTextInLink isAktivitetspenger>
          § 4 Forholdet til andre ytelser
        </Lovreferanse>
      </>
    ),
    spørsmål: 'Mottar bruker annen livsoppholdsytelse?',
    nei: 'Nei',
  },
};
