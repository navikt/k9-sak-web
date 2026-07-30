import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

/** Opplæringspenger bruker ikke tidlig IKKE_OPPFYLT-sjekk. */
const vedtakStatusUtlederOpplaeringspenger = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat, {
    skalSjekkeIkkeOppfyltVilkår: false,
  });

export default vedtakStatusUtlederOpplaeringspenger;
