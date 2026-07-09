import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

const vedtakStatusUtlederOmsorgspenger = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat);

export default vedtakStatusUtlederOmsorgspenger;
