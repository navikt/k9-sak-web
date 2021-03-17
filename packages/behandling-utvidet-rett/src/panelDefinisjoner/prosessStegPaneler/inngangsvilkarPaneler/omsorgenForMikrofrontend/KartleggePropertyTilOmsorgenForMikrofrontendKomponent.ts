import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import behandlingStatus from '@fpsak-frontend/kodeverk/src/behandlingStatus';
import vilkarUtfallType from '@fpsak-frontend/kodeverk/src/vilkarUtfallType';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { OmsorgenForProps } from '../../../../types/utvidetRettMikrofrontend/OmsorgProps';
import { InformasjonTilLesemodus } from '../../../../types/utvidetRettMikrofrontend/informasjonTilLesemodus';
import {
  AksjonspunktInformasjon,
  VilkarInformasjon,
} from '../../../../types/utvidetRettMikrofrontend/KartleggePropertyTilMikrofrontendTypes';

const KartleggePropertyTilOmsorgenForMikrofrontendKomponent = (
  isReadOnly: boolean,
  submitCallback,
  behandling,
  angitteBarn,
  aksjonspunktInformasjon: AksjonspunktInformasjon,
  vilkarInformasjon: VilkarInformasjon,
) => {
  let objektTilMikrofrontend = {};
  const { aksjonspunkter, isAksjonspunktOpen } = aksjonspunktInformasjon;
  const { vilkar, status } = vilkarInformasjon;

  const aksjonspunkt = aksjonspunkter[0];
  const vilkarKnyttetTilAksjonspunkt = vilkar[0];

  if (aksjonspunkt && vilkarKnyttetTilAksjonspunkt && aksjonspunkt.definisjon.kode === aksjonspunktCodes.OMSORGEN_FOR) {
    const skalVilkarsUtfallVises = behandling.status.kode === behandlingStatus.AVSLUTTET;
    const aksjonspunktLost = behandling.status.kode === behandlingStatus.BEHANDLING_UTREDES && !isAksjonspunktOpen;

    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        aksjonspunktLost,
        lesemodus: isReadOnly || !isAksjonspunktOpen,
        informasjonTilLesemodus: {
          begrunnelse: aksjonspunkt.begrunnelse,
          vilkarOppfylt: status === vilkarUtfallType.OPPFYLT,
        } as InformasjonTilLesemodus,
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
