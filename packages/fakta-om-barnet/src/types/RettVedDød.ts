import RettVedDødUtfallType from './RettVedDødType';

export interface RettVedDød {
  vurdering: string;
  rettVedDødType: RettVedDødUtfallType;
  vurdertAv?: string;
  vurdertTidspunkt?: string;
}
