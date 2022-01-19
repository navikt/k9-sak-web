import { put, takeLatest } from 'redux-saga/effects'
import {
    PleiepengerSluttfaseBehandlingApiKeys,
    requestPleiepengerSluttfaseApi,
} from "../../data/pleiepengerSluttfaseBehandlingApi";
import { actions } from "./slice";

function* requestVilkar() {
    try {
        const result = yield requestPleiepengerSluttfaseApi.startRequest(PleiepengerSluttfaseBehandlingApiKeys.VILKAR);
        yield put(actions.requestVilkarSuccess(result.payload));
    } catch (e) {

        yield put(actions.requestVilkarError(e.toString()));
    }
}

function* vilkarSaga() {
    yield takeLatest(actions.requestVilkar, requestVilkar);
}

export default vilkarSaga;