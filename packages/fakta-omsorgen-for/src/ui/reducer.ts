import Omsorgsperiodeoversikt from '../types/Omsorgsperiodeoversikt';
import ActionType from './actionTypes';

interface MainComponentState {
  omsorgsperiodeoversikt: Omsorgsperiodeoversikt;
  omsorgsperiodeoversiktHarFeilet: boolean;
  isLoading: boolean;
}

interface Action {
  type: ActionType;
  omsorgsperiodeoversikt?: Omsorgsperiodeoversikt;
}

const mainComponentReducer = (state: MainComponentState, action: Action): Partial<MainComponentState> => {
  switch (action.type) {
    case ActionType.OK:
      return {
        omsorgsperiodeoversikt: action.omsorgsperiodeoversikt,
        omsorgsperiodeoversiktHarFeilet: false,
        isLoading: false,
      };
    case ActionType.FAILED:
      return {
        omsorgsperiodeoversikt: null,
        omsorgsperiodeoversiktHarFeilet: true,
        isLoading: false,
      };
    case ActionType.PENDING:
      return {
        omsorgsperiodeoversikt: null,
        omsorgsperiodeoversiktHarFeilet: false,
        isLoading: true,
      };
    default:
      return { ...state };
  }
};

export default mainComponentReducer;
