import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { getCookie, setCookie, removeCookie } from "../../helpers/js-cookies";
import { UserSignInResponse } from "../../services/auth-service";
import { User } from "../../models/User";
// import type { RootState } from '../../app/store'

// Define a type for the slice state
type authUser = Omit<UserSignInResponse, "user">

interface AuthState {
  auth: boolean;
  // userAuth: UserSignInResponse | null;
  userAuth: authUser & User | null;
  // user: any | null;
  token: string | null;
}

// Define the initial state using that type
const initialState: AuthState = {
  auth: false,
  // userAuth: null,
  userAuth: localStorage.getItem("auth_user")
    ? JSON.parse(localStorage.getItem("auth_user")!)
    : null,
  token: getCookie("auth_token") || null,
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SET_LOGIN_CREDENTIALS: (state, action) => {},
    SET_TOKEN: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      setCookie("auth_token", action.payload!);
    },
    SET_USER_AUTH: (
      state,
      action: PayloadAction<authUser & User | null>
    ) => {
      state.userAuth = action.payload;
      localStorage.setItem("auth_user", JSON.stringify(action.payload));
    },
    CLEAR_CREDENTIALS: (state) => {
      state.userAuth = null;
      state.token = null;
      removeCookie("auth_token");
      localStorage.removeItem("auth_user");
    },
    RESET_STATE: (state) => {
      state = initialState;
    }
  },
});

export const {
  SET_LOGIN_CREDENTIALS,
  SET_TOKEN,
  SET_USER_AUTH,
  CLEAR_CREDENTIALS,
  RESET_STATE
} = authSlice.actions;

// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value

export default authSlice.reducer;
