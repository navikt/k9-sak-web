import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

const vedtakStatusUtlederOpplaeringspenger = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat, false);

export default vedtakStatusUtlederOpplaeringspenger;
