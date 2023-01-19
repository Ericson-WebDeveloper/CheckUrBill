import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from './auth/auth';
import globalReducer from './global/globalSlice';
import { authApi } from "../services/auth-service";
import { merchantApi } from "../services/merchant-service";
import { accountApi } from "../services/account-service";

export const store = configureStore({
  reducer: {
    'auth': authReducer,
    'global': globalReducer,
    [authApi.reducerPath]: authApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [accountApi.reducerPath]: accountApi.reducer
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, merchantApi.middleware, accountApi.middleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;