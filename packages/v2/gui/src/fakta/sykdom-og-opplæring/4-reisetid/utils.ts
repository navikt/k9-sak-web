import type { OpplæringVurderingResultat } from '@k9-sak-web/backend/k9sak/tjenester/behandling/opplæringspenger/visning/opplæring/OpplæringVurderingResultat.js';
import type { ReisetidResultatType as ReisetidResultat } from '@k9-sak-web/backend/k9sak/tjenester/behandling/opplæringspenger/visning/reisetid/ReisetidResultatType.js';

export const resultatTilJaNei = (resultat: ReisetidResultat | OpplæringVurderingResultat) => {
  if (resultat === 'GODKJENT') {
    return 'ja';
  }
  if (resultat === 'IKKE_GODKJENT') {
    return 'nei';
  }
  return '';
};
