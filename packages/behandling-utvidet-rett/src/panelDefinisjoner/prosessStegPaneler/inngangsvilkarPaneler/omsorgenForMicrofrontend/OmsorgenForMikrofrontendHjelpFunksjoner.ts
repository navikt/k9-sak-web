import { Aksjonspunkt, Behandling, Vilkar } from '@k9-sak-web/types';
import aksjonspunktCodes from '@fpsak-frontend/kodeverk/src/aksjonspunktCodes';
import UtvidetRettMikrofrontendVisning from '../../../../types/MikrofrontendKomponenter';

const kartleggePropertyTilOmsorgenForMikrofrontendKomponent = (
  behandling: Behandling,
  isReadOnly: boolean,
  aksjonspunkter: Aksjonspunkt[],
  vilkar: Vilkar[],
  submitCallback,
  angitteBarn,
) => {
  let objektTilMikrofrontend = {};
  const aksjonspunktKode = aksjonspunkter[0].definisjon.kode;
  const barnl = angitteBarn.map(barn => barn.personIdent);
  console.log(barnl);
  if (aksjonspunktKode === aksjonspunktCodes.OMSORGEN_FOR) {
    objektTilMikrofrontend = {
      visKomponent: UtvidetRettMikrofrontendVisning.OMSORG,
      props: {
        lesemodus: isReadOnly,
        harOmsorgen: false,
        barn: angitteBarn.map(barn => barn.personIdent),
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
