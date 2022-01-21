/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Behandling, Vilkar } from '@k9-sak-web/types';

interface Props {
    error: string;
    loading: boolean;
    behandling: Vilkar | undefined;
}

const initialState = {
    error: undefined,
    behandling: undefined,
    loading: false,
};

const BehandlingSlice = createSlice({
    name: 'behandling',
    initialState,
    reducers: {
        requestBehandling: (state, action: PayloadAction) => {
            state.error = undefined;
            state.loading = true;
        },
        requestBehandlingSuccess: (state, action: PayloadAction<Behandling>) => {
            state.behandling = action.payload;
            state.loading = false;
        },
        requestBehandlingError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { actions } = BehandlingSlice;
export const { requestBehandling } = actions;
export default BehandlingSlice.reducer;
