import Utfalltype from './Utfall';
import Vilkår from './Vilkår';

export type Map<Key extends string | number, Value> = {
  [key in Key]?: Value;
};

export type VurderteVilkår = Map<Vilkår, Utfalltype>;

interface Uttaksperiode {
  periode: string; // fom/tom
  delvisFravær?: string; // Duration
  utfall: Utfalltype;
  utbetalingsgrad: number;
  vurderteVilkår: {
    vilkår: VurderteVilkår;
  };
}

export default Uttaksperiode;
