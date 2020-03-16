import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const AvslåttÅrsakEnum = stringEnum({
  UTENOM_TILSYNSBEHOV: 'UTENOM_TILSYNSBEHOV',
  FOR_LAV_GRAD: 'FOR_LAV_GRAD',
  FOR_HØY_TILSYNSGRAD: 'FOR_HØY_TILSYNSGRAD',
  LOVBESTEMT_FERIE: 'LOVBESTEMT_FERIE',
  IKKE_MEDLEM_I_FOLKETRYGDEN: 'IKKE_MEDLEM_I_FOLKETRYGDEN',
  SØKERS_DØDSFALL: 'SØKERS_DØDSFALL',
  BARNETS_DØDSFALL: 'BARNETS_DØDSFALL',
});

type AvslåttÅrsak = typeof AvslåttÅrsakEnum[keyof typeof AvslåttÅrsakEnum];

export default AvslåttÅrsak;
