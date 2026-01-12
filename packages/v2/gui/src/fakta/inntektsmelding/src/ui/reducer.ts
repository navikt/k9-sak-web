import type { k9_sak_kontrakt_kompletthet_KompletthetsVurderingDto as KompletthetsVurdering } from '@navikt/k9-sak-typescript-client/types';
import ActionType from './actionTypes';

interface MainComponentState {
  kompletthetsoversiktResponse: KompletthetsVurdering | null;
  kompletthetsoversiktHarFeilet: boolean;
  isLoading: boolean;
}

interface Action {
  type: ActionType;
  kompletthetsoversiktResponse?: KompletthetsVurdering;
}

const mainComponentReducer = (state: MainComponentState, action: Action): MainComponentState => {
  switch (action.type) {
    case ActionType.OK:
      return {
        kompletthetsoversiktResponse: action.kompletthetsoversiktResponse ?? null,
        kompletthetsoversiktHarFeilet: false,
        isLoading: false,
      };
    case ActionType.FAILED:
      return {
        kompletthetsoversiktResponse: null,
        kompletthetsoversiktHarFeilet: true,
        isLoading: false,
      };
    case ActionType.PENDING:
      return {
        kompletthetsoversiktResponse: null,
        kompletthetsoversiktHarFeilet: false,
        isLoading: true,
      };
    default:
      return state;
  }
};

export default mainComponentReducer;
