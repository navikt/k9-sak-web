import type { ReisetidPeriodeVurderingDtoResultat } from '@k9-sak-web/backend/k9sak/generated';

export const resultatTilJaNei = (resultat: ReisetidPeriodeVurderingDtoResultat) => {
  if (resultat === 'GODKJENT') {
    return 'ja';
  }
  if (resultat === 'IKKE_GODKJENT') {
    return 'nei';
  }
  return '';
};
