/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Aksjonspunkt } from '@k9-sak-web/types';

interface Props {
    error: string;
    loading: boolean;
    aksjonspunkter: Aksjonspunkt[] | any;
}

const initialState = {
    error: undefined,
    aksjonspunkter: [],
    loading: false,
};

const AksjonpunkterSlice = createSlice({
    name: 'aksjonspunkter',
    initialState,
    reducers: {
        requestAksjonspunkter: (state, action: PayloadAction) => {
            console.log("her er vi i reduceren");
            state.error = undefined;
            state.loading = true;
        },
        requestAksjonspunkterSuccess: (state, action: PayloadAction<any>) => {
            console.log("her er vi i reduceren success");
            state.aksjonspunkter = action.payload;
            state.loading = false;
        },
        requestAksjonspunkterError: (state, action: PayloadAction<any>) => {
            console.log("her er vi i reduceren failure");
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { actions } = AksjonpunkterSlice;
export const { requestAksjonspunkter } = actions;
export default AksjonpunkterSlice.reducer;
