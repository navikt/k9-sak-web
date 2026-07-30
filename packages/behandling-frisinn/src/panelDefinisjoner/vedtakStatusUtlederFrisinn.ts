import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

const vedtakStatusUtlederFrisinn = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat);

export default vedtakStatusUtlederFrisinn;
