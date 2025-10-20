import { DetaljertFeilutbetalingPeriode } from './detaljerteFeilutbetalingsperioderTsType';

type DataForPeriode = {
  erTotalBelopUnder4Rettsgebyr: boolean;
  begrunnelse?: string;
  erForeldet: boolean;
} & DetaljertFeilutbetalingPeriode;

export default DataForPeriode;
