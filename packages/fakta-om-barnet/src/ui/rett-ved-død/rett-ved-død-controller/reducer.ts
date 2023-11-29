import { RettVedDød } from '../../../types/RettVedDød';
import ActionType from './actionTypes';

interface MainComponentState {
  rettVedDød: RettVedDød;
  hasFailed: boolean;
  isLoading: boolean;
  editMode: boolean;
}

interface Action {
  type: ActionType;
  rettVedDød?: RettVedDød;
}

const rettVedDødReducer = (state: MainComponentState, action: Action): Partial<MainComponentState> => {
  switch (action.type) {
    case ActionType.OK:
      return {
        rettVedDød: action.rettVedDød,
        hasFailed: false,
        isLoading: false,
      };
    case ActionType.FAILED:
      return {
        rettVedDød: null,
        hasFailed: true,
        isLoading: false,
      };
    case ActionType.ENABLE_EDIT:
      return {
        ...state,
        editMode: true,
      };
    case ActionType.ABORT_EDIT:
      return {
        ...state,
        editMode: false,
      };
    default:
      return { ...state };
  }
};

export default rettVedDødReducer;
