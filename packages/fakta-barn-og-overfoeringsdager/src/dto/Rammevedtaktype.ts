import stringEnum from '@k9-sak-web/types/src/tsUtils';

export const RammevedtakEnum = stringEnum({
  UTVIDET_RETT: 'UTVIDET_RETT',
  MIDLERTIDIG_ALENEOMSORG: 'MIDLERTIDIG_ALENEOMSORG',
  OVERFØRT_FÅR: 'OVERFØRT_FÅR',
  OVERFØRT_GIR: 'OVERFØRT_GIR',
  KORONA_OVERFØRT_GIR: 'KORONA_OVERFØRT_GIR',
  KORONA_OVERFØRT_FÅR: 'KORONA_OVERFØRT_FÅR',
});

type Rammevedtaktype = typeof RammevedtakEnum[keyof typeof RammevedtakEnum];

export default Rammevedtaktype;
