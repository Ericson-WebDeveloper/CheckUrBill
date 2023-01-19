import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Merchant, MerchantDetail } from '../../models/Merchant';
import { MerchantList } from '../../services/administrator-service';

// Define a type for the slice state


interface State {
    merchant: MerchantList | null;
    isLoading: boolean;
    isError: boolean;
    error: any | null;
    errors: Array<unknown> | null;
}

// Define the initial state using that type
const initialState: State = {
    merchant: null,
    isLoading: false,
    isError: false,
    error: null,
    errors: null
};

export const merchantSlice = createSlice({
  name: "merchant",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SET_LOADING: (state, action: PayloadAction<boolean>) => {
        state.isLoading = action.payload;
    },
    SET_DATA: (state, action: PayloadAction<{field: string, data: MerchantList | null}>) => {
        state[action.payload.field as keyof typeof state] = action.payload.data;
    },
    SET_ERROR: (state, action: PayloadAction<any|null>) => {
        state.error = action.payload;
    },
    SET_ERRORS: (state, action: PayloadAction<Array<unknown>>) => {
        state.errors = action.payload;
    },
    SET_ERROR_STATUS: (state, action: PayloadAction<boolean>) => {
        state.isError = action.payload;
    }
  },
});

export const { SET_LOADING, SET_DATA, SET_ERROR, SET_ERRORS, SET_ERROR_STATUS } = merchantSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default merchantSlice.reducer;