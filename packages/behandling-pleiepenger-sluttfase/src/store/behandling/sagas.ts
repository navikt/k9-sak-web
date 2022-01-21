import { put, takeLatest } from 'redux-saga/effects'
import {
    PleiepengerSluttfaseBehandlingApiKeys,
    requestPleiepengerSluttfaseApi,
} from "../../data/pleiepengerSluttfaseBehandlingApi";
import { actions } from "./slice";

function* requestBehandling() {
    try {
        const result = yield requestPleiepengerSluttfaseApi.startRequest(PleiepengerSluttfaseBehandlingApiKeys.BEHANDLING_PP);
        yield put(actions.requestBehandlingSuccess(result.payload));
    } catch (e) {

        yield put(actions.requestBehandlingError(e.toString()));
    }
}

function* vilkarSaga() {
    yield takeLatest(actions.requestBehandling, requestBehandling);
}

export default vilkarSaga;