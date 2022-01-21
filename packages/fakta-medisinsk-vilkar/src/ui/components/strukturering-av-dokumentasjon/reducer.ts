import Dokument from '../../../types/Dokument';
import ActionType from './actionTypes';
import Dokumentoversikt from '../../../types/Dokumentoversikt';

interface State {
    visDokumentDetails: boolean;
    isLoading: boolean;
    dokumentoversikt: Dokumentoversikt;
    valgtDokument: Dokument;
    dokumentoversiktFeilet: boolean;
    visRedigeringAvDokument: boolean;
}

interface Action {
    type: ActionType;
    dokumentoversikt?: Dokumentoversikt;
    valgtDokument?: Dokument;
}

const vilkårsdokumentReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_DOKUMENTOVERSIKT: {
            return {
                ...state,
                dokumentoversikt: action.dokumentoversikt,
                valgtDokument: action.valgtDokument,
                isLoading: false,
                visDokumentDetails: false,
                dokumentoversiktFeilet: false,
            };
        }
        case ActionType.DOKUMENTOVERSIKT_FEILET: {
            return {
                ...state,
                isLoading: false,
                dokumentoversiktFeilet: true,
            };
        }
        case ActionType.VELG_DOKUMENT:
            return {
                ...state,
                valgtDokument: action.valgtDokument,
                visRedigeringAvDokument: false,
                visDokumentDetails: true,
            };
        case ActionType.PENDING:
            return {
                ...state,
                isLoading: true,
                dokumentoversiktFeilet: false,
            };
        case ActionType.REDIGER_DOKUMENT:
            return {
                ...state,
                visRedigeringAvDokument: true,
            };
        default:
            return state;
    }
};

export default vilkårsdokumentReducer;
