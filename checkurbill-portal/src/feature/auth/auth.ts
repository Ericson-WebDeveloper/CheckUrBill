import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { User, UserInfo } from "../../models/User";
import { Role } from "../../models/Role";
import { getCookie, removeCookie, setCookie } from "../../helper/cookies";

interface UserInterface {
  user: User;
  info?: UserInfo | null;
  roles: Role[];
}

// Define a type for the slice state
type UserAuth = Omit<UserInterface, "user">

interface AuthState {
  auth: boolean;
  // userAuth: UserSignInResponse | null;
  userAuth: UserAuth & User | null;
  // user: any | null;
  token: string | null;
  accounts: Array<unknown>
}

// Define the initial state using that type
const initialState: AuthState = {
  auth: false,
  // userAuth: null,
  userAuth: localStorage.getItem("auth_user")
  ? JSON.parse(localStorage.getItem("auth_user")!)
  : null,
  token:  getCookie("auth_token") || null,
  accounts: []
};

export const authSlice = createSlice({
  name: "auth",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    SET_TOKEN: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      setCookie("auth_token", action.payload!);
    },
    SET_USER_AUTH: (
      state,
      action: PayloadAction<UserAuth & User | null>
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

export const { SET_TOKEN, SET_USER_AUTH, CLEAR_CREDENTIALS } = authSlice.actions;
// // Other code such as selectors can use the imported `RootState` type
// export const selectCount = (state: RootState) => state.counter.value
export default authSlice.reducer;