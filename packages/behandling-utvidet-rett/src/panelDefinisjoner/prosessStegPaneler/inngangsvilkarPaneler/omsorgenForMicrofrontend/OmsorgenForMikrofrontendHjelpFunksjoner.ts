import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';

const kartleggePropertyTilOmsorgenForMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  submitCallback,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;

  if (aksjonspunktKode === aksjonspunktCodes.OMSORGEN_FOR) {
    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        lesemodus: isReadOnly,
        harOmsorgen: false,
        barnetsFnr: '01010050053',
      },
      losAksjonspunkt: ({ harSokerOmsorg, begrunnelse }) => {
        submitCallback([
          {
            kode: aksjonspunktKode,
            begrunnelse,
            erVilkarOk: harSokerOmsorg,
          },
        ]);
      },
    };
  }
  return objektTilMikrofrontend;
};

export default kartleggePropertyTilOmsorgenForMikrofrontendKomponent;
