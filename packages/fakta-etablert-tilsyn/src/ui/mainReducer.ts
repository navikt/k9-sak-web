import { Period } from '@navikt/k9-fe-period-utils';
import BeredskapType from '../types/BeredskapType';
import EtablertTilsynType from '../types/EtablertTilsynType';
import NattevåkType from '../types/NattevåkType';
import { SykdomResponse, TilsynResponse } from '../types/TilsynResponse';
import ActionType from './mainActionTypes';

interface MainComponentState {
  etablertTilsyn: EtablertTilsynType[];
  beredskap: BeredskapType;
  nattevåk: NattevåkType;
  smurtEtablertTilsynPerioder: EtablertTilsynType[];
  sykdomsperioderSomIkkeErOppfylt: Period[];
  tilsynHarFeilet: boolean;
  sykdomHarFeilet: boolean;
  isLoading: boolean;
}

interface Action {
  type: ActionType;
  tilsynResponse?: TilsynResponse;
  sykdomResponse?: SykdomResponse;
}

const mainComponentReducer = (state: MainComponentState, action: Action): Partial<MainComponentState> => {
  switch (action.type) {
    case ActionType.OK: {
      const { tilsynResponse } = action;
      const etablertTilsyn = tilsynResponse.etablertTilsynPerioder.map(
        etablertTilsynPeriode => new EtablertTilsynType(etablertTilsynPeriode),
      );
      const beredskap = new BeredskapType(tilsynResponse.beredskap);
      const nattevåk = new NattevåkType(tilsynResponse.nattevåk);
      const smurtEtablertTilsynPerioder = tilsynResponse.smortEtablertTilsynPerioder.map(
        etablertTilsynPeriode => new EtablertTilsynType(etablertTilsynPeriode),
      );
      return {
        ...state,
        etablertTilsyn,
        beredskap,
        nattevåk,
        smurtEtablertTilsynPerioder,
        tilsynHarFeilet: false,
        isLoading: false,
      };
    }
    case ActionType.FAILED:
      return {
        ...state,
        tilsynHarFeilet: true,
        isLoading: false,
      };
    case ActionType.PENDING:
      return {
        ...state,
        tilsynHarFeilet: false,
        isLoading: true,
      };
    case ActionType.SYKDOM_OK: {
      const { sykdomResponse } = action;
      const resterendeVurderingsperioder = sykdomResponse?.resterendeVurderingsperioder?.map(
        v => new Period(v.fom, v.tom),
      );
      const sykdomsperioderSomIkkeErOppfylt = sykdomResponse.vurderingselementer
        .filter(v => v.resultat !== 'OPPFYLT')
        .map(v => new Period(v.periode.fom, v.periode.tom));
      return {
        ...state,
        sykdomsperioderSomIkkeErOppfylt: [...sykdomsperioderSomIkkeErOppfylt, ...resterendeVurderingsperioder],
        sykdomHarFeilet: false,
      };
    }
    case ActionType.SYKDOM_FAILED:
      return {
        ...state,
        sykdomHarFeilet: true,
      };
    default:
      return { ...state };
  }
};

export default mainComponentReducer;
