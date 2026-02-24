import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface SSRState {
    data: Record<string, any>;
}

const initialState: SSRState = {
    data: {},
};

const ssrSlice = createSlice({
    name: 'ssr',
    initialState,
    reducers: {
        setSSRData(state, action: PayloadAction<{ key: string; data: any }>) {
            state.data[action.payload.key] = action.payload.data;
        },
        clearSSRData(state, action: PayloadAction<string>) {
            delete state.data[action.payload];
        }
    },
});

export const { setSSRData, clearSSRData } = ssrSlice.actions;
export default ssrSlice.reducer;
