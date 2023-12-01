import ActionType from './actionTypes';
import { Kompletthet } from '../types/KompletthetResponse';

interface MainComponentState {
  kompletthetsoversiktResponse: Kompletthet;
  kompletthetsoversiktHarFeilet: boolean;
  isLoading: boolean;
}

interface Action {
  type: ActionType;
  kompletthetsoversiktResponse?: Kompletthet;
}

const mainComponentReducer = (state: MainComponentState, action: Action): Partial<MainComponentState> => {
  switch (action.type) {
    case ActionType.OK:
      return {
        kompletthetsoversiktResponse: action.kompletthetsoversiktResponse,
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
      return { ...state };
  }
};

export default mainComponentReducer;
