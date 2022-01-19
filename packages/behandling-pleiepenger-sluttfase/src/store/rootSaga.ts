import { all } from "redux-saga/effects";
import aksjonspunkterSaga from "./aksjonspunkter/sagas";
import vilkarSaga from "./vilkar/sagas";

function* rootSaga() {
    yield all([
        aksjonspunkterSaga(),
        vilkarSaga(),
    ]);
}

export default rootSaga;