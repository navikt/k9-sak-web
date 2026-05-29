import { utledVedtakStatus } from '@k9-sak-web/behandling-felles';
import { Aksjonspunkt, Behandlingsresultat, Vilkar } from '@k9-sak-web/types';

/**
 * Ungdomsytelse bruker ikke tidlig IKKE_OPPFYLT-sjekk
 * og ignorerer åpent OVERSTYR_BEREGNING-aksjonspunkt.
 */
const vedtakStatusUtlederUngdomsytelse = (
  vilkar: Vilkar[],
  aksjonspunkter: Aksjonspunkt[],
  vedtakAksjonspunkter: Aksjonspunkt[],
  behandlingsresultat: Behandlingsresultat,
) =>
  utledVedtakStatus(vilkar, aksjonspunkter, vedtakAksjonspunkter, behandlingsresultat, {
    skalSjekkeIkkeOppfyltVilkår: false,
    skalSjekkeOverstyrBeregningAksjonspunkt: false,
  });

export default vedtakStatusUtlederUngdomsytelse;
