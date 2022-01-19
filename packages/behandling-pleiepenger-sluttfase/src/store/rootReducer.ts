import { combineReducers } from "@reduxjs/toolkit";
import aksjonspunkter from "./aksjonspunkter";
import vilkar from "./vilkar";


const rootReducer = combineReducers({
    aksjonspunkter,
    vilkar,
});

export type ReduxState = ReturnType<typeof rootReducer>;
export default rootReducer;