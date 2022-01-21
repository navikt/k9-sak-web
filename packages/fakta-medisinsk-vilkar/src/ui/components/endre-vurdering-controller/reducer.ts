import ActionType from './actionTypes';
import Dokument from '../../../types/Dokument';
import { PeriodeMedEndring } from '../../../types/PeriodeMedEndring';
import { Vurderingsversjon } from '../../../types/Vurdering';
import { dokumentSorter } from '../../../util/dokumentUtils';

interface State {
    sjekkForEksisterendeVurderingerPågår: boolean;
    lagringAvVurderingPågår: boolean;
    lagreVurderingHarFeilet: boolean;
    hentDataTilVurderingPågår: boolean;
    hentDataTilVurderingHarFeilet: boolean;
    dokumenter: Dokument[];
    perioderMedEndring: PeriodeMedEndring[];
    overlappendePeriodeModalOpen: boolean;
    vurderingsversjonTilLagringFraModal: Vurderingsversjon | null;
}

interface Action {
    type: ActionType;
    perioderMedEndring?: PeriodeMedEndring[];
    dokumenter?: Dokument[];
    vurderingsversjonTilLagringFraModal?: Vurderingsversjon;
}

const vurderingControllerReducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.SJEKK_FOR_EKSISTERENDE_VURDERINGER_PÅBEGYNT:
            return {
                ...state,
                sjekkForEksisterendeVurderingerPågår: true,
            };
        case ActionType.LAGRING_AV_VURDERING_PÅBEGYNT:
            return {
                ...state,
                lagringAvVurderingPågår: true,
                lagreVurderingHarFeilet: false,
            };
        case ActionType.VURDERING_LAGRET:
            return {
                ...state,
                lagringAvVurderingPågår: false,
                perioderMedEndring: null,
                overlappendePeriodeModalOpen: false,
            };
        case ActionType.LAGRE_VURDERING_FEILET:
            return {
                ...state,
                lagringAvVurderingPågår: false,
                lagreVurderingHarFeilet: true,
                sjekkForEksisterendeVurderingerPågår: false,
            };
        case ActionType.LAGRING_AV_VURDERING_AVBRUTT:
            return {
                ...state,
                overlappendePeriodeModalOpen: false,
                vurderingsversjonTilLagringFraModal: null,
            };
        case ActionType.ADVAR_OM_EKSISTERENDE_VURDERINGER:
            return {
                ...state,
                overlappendePeriodeModalOpen: true,
                sjekkForEksisterendeVurderingerPågår: false,
                perioderMedEndring: action.perioderMedEndring,
                vurderingsversjonTilLagringFraModal: action.vurderingsversjonTilLagringFraModal,
            };
        case ActionType.HENT_DATA_TIL_VURDERING:
            return {
                ...state,
                hentDataTilVurderingPågår: true,
                hentDataTilVurderingHarFeilet: false,
            };
        case ActionType.HENTET_DATA_TIL_VURDERING: {
            const dokumenter = action.dokumenter?.sort(dokumentSorter);
            return {
                ...state,
                dokumenter,
                hentDataTilVurderingPågår: false,
            };
        }
        case ActionType.HENT_DATA_TIL_VURDERING_HAR_FEILET:
            return {
                ...state,
                hentDataTilVurderingPågår: false,
                hentDataTilVurderingHarFeilet: true,
            };
        default:
            return state;
    }
};

export default vurderingControllerReducer;
