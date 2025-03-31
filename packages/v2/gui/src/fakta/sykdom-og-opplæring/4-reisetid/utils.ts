import type {
  OpplæringVurderingDtoResultat,
  ReisetidPeriodeVurderingDtoResultat,
} from '@k9-sak-web/backend/k9sak/generated';

export const resultatTilJaNei = (resultat: ReisetidPeriodeVurderingDtoResultat | OpplæringVurderingDtoResultat) => {
  if (resultat === 'GODKJENT') {
    return 'ja';
  }
  if (resultat === 'IKKE_GODKJENT') {
    return 'nei';
  }
  return '';
};
