import { OverstyrInputBeregningDto } from './OverstyrInputBeregningDto';

export type OverstyrInputForBeregningDto = {
  kode: string;
  begrunnelse: string;
  perioder: OverstyrInputBeregningDto[];
};
