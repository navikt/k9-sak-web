import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';
import { generereInfoForVurdertVilkar, erVilkarVurdert } from '../../UtvidetRettOmsorgenForMikrofrontendFelles';
import { OmsorgenForProps } from '../../../../types/utvidetRettMikrofrontend/OmsorgProps';

const KartleggePropertyTilOmsorgenForMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  isAksjonspunktOpen,
  submitCallback,
  angitteBarn,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;
  const vilkarTypeFraAksjonspunkt = aksjonspunkter[0].vilkarType.kode;
  const skalVilkarsUtfallVises = !isAksjonspunktOpen && erVilkarVurdert(vilkar, vilkarTypeFraAksjonspunkt);

  if (aksjonspunktKode === aksjonspunktCodes.OMSORGEN_FOR) {
    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        lesemodus: isReadOnly,
        harOmsorgen: false,
        barn: angitteBarn.map(barn => barn.personIdent),
        vedtakFattetVilkarOppfylt: skalVilkarsUtfallVises,
        informasjonOmVilkar: generereInfoForVurdertVilkar(
          skalVilkarsUtfallVises,
          vilkar,
          vilkarTypeFraAksjonspunkt,
          'Omsorgen for',
        ),
        losAksjonspunkt: ({ harOmsorgen, begrunnelse }) => {
          submitCallback([
            {
              kode: aksjonspunktKode,
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
