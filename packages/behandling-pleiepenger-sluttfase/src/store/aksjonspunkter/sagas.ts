import { put, takeLatest } from 'redux-saga/effects'
import {
    PleiepengerSluttfaseBehandlingApiKeys,
    requestPleiepengerSluttfaseApi,
} from "../../data/pleiepengerSluttfaseBehandlingApi";
import { actions } from "./slice";

function* requestAksjonspunkter() {
    try {
        const result = yield requestPleiepengerSluttfaseApi.startRequest(PleiepengerSluttfaseBehandlingApiKeys.AKSJONSPUNKTER);
        yield put(actions.requestAksjonspunkterSuccess(result.payload));
    } catch (e) {
        yield put(actions.requestAksjonspunkterError(e.toString()));
    }
}

function* aksjonspunkterSaga() {
    yield takeLatest(actions.requestAksjonspunkter, requestAksjonspunkter);
}

export default aksjonspunkterSaga;