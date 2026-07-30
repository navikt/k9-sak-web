import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

const vedtakStatusUtleder = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat);

export default vedtakStatusUtleder;
