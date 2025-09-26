import type {
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_opplæring_OpplæringResultat as OpplæringVurderingResultat,
  k9_sak_web_app_tjenester_behandling_opplæringspenger_visning_reisetid_ReisetidResultat as ReisetidResultat,
} from '@k9-sak-web/backend/k9sak/generated/types.js';

export const resultatTilJaNei = (resultat: ReisetidResultat | OpplæringVurderingResultat) => {
  if (resultat === 'GODKJENT') {
    return 'ja';
  }
  if (resultat === 'IKKE_GODKJENT') {
    return 'nei';
  }
  return '';
};
