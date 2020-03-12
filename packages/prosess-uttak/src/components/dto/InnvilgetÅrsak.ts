import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const InnvilgetÅrsakEnum = stringEnum({
  GRADERT_MOT_TILSYN: 'GRADERT_MOT_TILSYN',
  AVKORTET_MOT_INNTEKT: 'AVKORTET_MOT_INNTEKT',
  BARNETS_DØDSFALL: 'BARNETS_DØDSFALL'
});

type InnvilgetÅrsak = typeof InnvilgetÅrsakEnum[keyof typeof InnvilgetÅrsakEnum];

export default InnvilgetÅrsak;
