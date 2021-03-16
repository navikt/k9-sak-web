import { Aksjonspunkt, Vilkar } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import {
  generereInfoForVurdertVilkar,
  erVilkarVurdert,
  hentBegrunnelseOgVilkarOppfylt,
} from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { OmsorgenForProps } from '../../../../types/utvidetRettMikrofrontend/OmsorgProps';
import { InformasjonTilLesemodus } from '../../../../types/utvidetRettMikrofrontend/informasjonTilLesemodus';

const KartleggePropertyTilOmsorgenForMikrofrontendKomponent = (
  vedtakFattetAksjonspunkt,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  isAksjonspunktOpen,
  submitCallback,
  angitteBarn,
  behandling,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunkt = aksjonspunkter[0];
  const vilkarKnyttetTilAksjonspunkt = vilkar.filter(
    vilkaret => vilkaret.vilkarType.kode === aksjonspunkt.vilkarType.kode,
  )[0];

  if (aksjonspunkt && vilkarKnyttetTilAksjonspunkt && aksjonspunkt.definisjon.kode === aksjonspunktCodes.OMSORGEN_FOR) {
    const vedtakFattet = vedtakFattetAksjonspunkt.length > 0 && !vedtakFattetAksjonspunkt[0].kanLoses;
    const skalVilkarsUtfallVises = !isAksjonspunktOpen && vedtakFattet && erVilkarVurdert(vilkarKnyttetTilAksjonspunkt);
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        aksjonspunktLost,
        lesemodus: isReadOnly || !isAksjonspunktOpen,
        informasjonTilLesemodus: hentBegrunnelseOgVilkarOppfylt(
          vilkarKnyttetTilAksjonspunkt,
          aksjonspunkt,
          false,
        ) as InformasjonTilLesemodus,
        barn: angitteBarn.map(barn => barn.personIdent),
        vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
        informasjonOmVilkar: generereInfoForVurdertVilkar(
          skalVilkarsUtfallVises,
          vilkarKnyttetTilAksjonspunkt,
          aksjonspunkt.begrunnelse,
          'Omsorgen for',
        ),
        losAksjonspunkt: (harOmsorgen, begrunnelse) => {
          submitCallback([
            {
              kode: aksjonspunkt.definisjon.kode,
              harOmsorgenFor: harOmsorgen,
              begrunnelse,
            },
          ]);
        },
      } as OmsorgenForProps,
    };
  }
  return objektTilMikrofrontend;
};

export default KartleggePropertyTilOmsorgenForMikrofrontendKomponent;
