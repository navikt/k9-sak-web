import OverseEtablertTilsynÅrsak from '../constants/OverseEtablertTilsynÅrsak';

export default interface GraderingMotTilsyn {
  etablertTilsyn: number;
  andreSøkeresTilsyn: number;
  tilgjengeligForSøker: number;
  overseEtablertTilsynÅrsak?: OverseEtablertTilsynÅrsak;
}
