import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";



interface AuthState {
    loadingGLobal: boolean;
}

// Define the initial state using that type
const initialState: AuthState = {
  loadingGLobal: false,
};

export const globalSlice = createSlice({
  name: "global",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SET_START_LOADING: (state) => {
        state.loadingGLobal = true;
    },
    SET_STOP_LOADING: (state) => {
        state.loadingGLobal = false;
    }
  },
});

export const { SET_START_LOADING, SET_STOP_LOADING } = globalSlice.actions;
// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value
export default globalSlice.reducer;