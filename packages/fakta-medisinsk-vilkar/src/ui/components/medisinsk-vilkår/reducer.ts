import ActionType from './actionTypes';
import Step, { dokumentSteg } from '../../../types/Step';
import SykdomsstegStatusResponse from '../../../types/SykdomsstegStatusResponse';
import Dokument from '../../../types/Dokument';

interface State {
    isLoading: boolean;
    hasError: boolean;
    activeStep: Step;
    markedStep: Step;
    sykdomsstegStatus: SykdomsstegStatusResponse;
    nyeDokumenterSomIkkeErVurdert: Dokument[];
}

interface Action {
    type: ActionType;
    step?: Step;
    sykdomsstegStatus?: SykdomsstegStatusResponse;
    nyeDokumenterSomIkkeErVurdert?: Dokument[];
}

const medisinskVilkårReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.MARK_AND_ACTIVATE_STEP: {
            return {
                ...state,
                nyeDokumenterSomIkkeErVurdert: action.nyeDokumenterSomIkkeErVurdert || [],
                activeStep: action.step || dokumentSteg,
                markedStep: action.step,
                isLoading: false,
            };
        }
        case ActionType.ACTIVATE_STEP: {
            return {
                ...state,
                activeStep: action.step,
            };
        }
        case ActionType.ACTIVATE_STEP_AND_CLEAR_MARKING: {
            return {
                ...state,
                activeStep: action.step,
                markedStep: null,
            };
        }
        case ActionType.ACTIVATE_DEFAULT_STEP: {
            return {
                ...state,
                nyeDokumenterSomIkkeErVurdert: action.nyeDokumenterSomIkkeErVurdert || [],
                activeStep: dokumentSteg,
                isLoading: false,
            };
        }
        case ActionType.NAVIGATE_TO_STEP: {
            return {
                ...state,
                activeStep: action.step,
                markedStep: action.step,
            };
        }
        case ActionType.UPDATE_STATUS: {
            return {
                ...state,
                sykdomsstegStatus: action.sykdomsstegStatus,
                markedStep: action.step,
            };
        }
        case ActionType.SHOW_ERROR: {
            return {
                ...state,
                hasError: true,
            };
        }
        case ActionType.ENDRINGER_UTIFRA_NYE_DOKUMENTER_REGISTRERT: {
            return {
                ...state,
                nyeDokumenterSomIkkeErVurdert: [],
            };
        }
        case ActionType.UPDATE_NYE_DOKUMENTER_SOM_IKKE_ER_VURDERT: {
            return {
                ...state,
                nyeDokumenterSomIkkeErVurdert: action.nyeDokumenterSomIkkeErVurdert,
            };
        }
        default:
            return state;
    }
};

export default medisinskVilkårReducer;
