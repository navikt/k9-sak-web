import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';

/** Pleiepenger bruker ikke tidlig IKKE_OPPFYLT-sjekk. */
const vedtakStatusUtlederPleiepenger = (vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat, {
    skalSjekkeIkkeOppfyltVilkår: false,
  });

export default vedtakStatusUtlederPleiepenger;
