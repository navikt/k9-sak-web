import { Period } from '@navikt/k9-period-utils';
import Vurderingsoversikt from '../../../types/Vurderingsoversikt';
import ActionType from './actionTypes';
import Vurderingselement from '../../../types/Vurderingselement';

interface State {
    visVurderingDetails: boolean;
    isLoading: boolean;
    vurderingsoversikt: Vurderingsoversikt;
    valgtVurderingselement: Vurderingselement;
    skalViseRadForNyVurdering: boolean;
    vurderingsoversiktFeilet: boolean;
}

interface Action {
    type: ActionType;
    vurderingsoversikt?: Vurderingsoversikt;
    valgtVurderingselement?: Vurderingselement;
    resterendeVurderingsperioder?: Period[];
}

const vilkårsvurderingReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.VIS_VURDERINGSOVERSIKT: {
            return {
                ...state,
                vurderingsoversikt: action.vurderingsoversikt,
                isLoading: false,
                visVurderingDetails: false,
                skalViseRadForNyVurdering: false,
                vurderingsoversiktFeilet: false,
            };
        }
        case ActionType.VURDERINGSOVERSIKT_FEILET: {
            return {
                ...state,
                isLoading: false,
                vurderingsoversiktFeilet: true,
            };
        }
        case ActionType.VIS_NY_VURDERING_FORM:
            return {
                ...state,
                valgtVurderingselement: null,
                visVurderingDetails: true,
                skalViseRadForNyVurdering: !action.resterendeVurderingsperioder,
            };
        case ActionType.VELG_VURDERINGSELEMENT:
            return {
                ...state,
                valgtVurderingselement: action.valgtVurderingselement,
                visVurderingDetails: true,
            };
        case ActionType.PENDING:
            return {
                ...state,
                isLoading: true,
                vurderingsoversiktFeilet: false,
            };
        case ActionType.AVBRYT_FORM:
            return {
                ...state,
                visVurderingDetails: false,
                valgtVurderingselement: null,
                skalViseRadForNyVurdering: false,
            };
        default:
            return state;
    }
};

export default vilkårsvurderingReducer;
