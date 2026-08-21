import { OverstyrInputBeregningAktivitet } from './OverstyrInputBeregningAktivitet';

export type OverstyrInputBeregningDto = {
  skjaeringstidspunkt: string;
  harKategoriNæring?: boolean;
  harKategoriFrilans?: boolean;
  aktivitetliste: OverstyrInputBeregningAktivitet[];
};
