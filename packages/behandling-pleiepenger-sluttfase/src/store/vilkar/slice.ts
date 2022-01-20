/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Vilkar } from '@k9-sak-web/types';

interface Props {
    error: string;
    loading: boolean;
    vilkar: Vilkar;
}

const initialState = {
    error: undefined,
    vilkar: [],
    loading: false,
};

const VilkarSlice = createSlice({
    name: 'vilkar',
    initialState,
    reducers: {
        requestVilkar: (state, action: PayloadAction) => {
            state.error = undefined;
            state.loading = true;
        },
        requestVilkarSuccess: (state, action: PayloadAction<any>) => {
            state.vilkar = action.payload;
            state.loading = false;
        },
        requestVilkarError: (state, action: PayloadAction<any>) => {
            state.error = action.payload;
            state.loading = false;
        }
    },
});

export const { actions } = VilkarSlice;
export const { requestVilkar } = actions;
export default VilkarSlice.reducer;
