import { OverstyrInputBeregningDto } from './OverstyrInputBeregningDto';

export type BehandlingIdDto = {
  id: string;
};

export type OverstyrInputForBeregningDto = {
  kode: string;
  begrunnelse: string;
  perioder: OverstyrInputBeregningDto[];
};
