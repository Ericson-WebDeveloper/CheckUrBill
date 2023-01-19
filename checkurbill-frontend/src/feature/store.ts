import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "./auth/auth";
import merchantReducer from "./merchant/merchantSlice";
import { authApi } from "../services/auth-service";
import { administratorApi } from "../services/administrator-service";
import { rolePermissionApi } from "../services/role-permission-service";
import { helperApi } from "../services/helper-service";
import { userApi } from "../services/personal-service";
import { merchantApi } from "../services/merchant-service";
import { merchantUploadApi } from "../services/merchant-uploading-service";
import { memberApi } from "../services/member";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    merchant: merchantReducer,
    
    [authApi.reducerPath]: authApi.reducer,
    [administratorApi.reducerPath]: administratorApi.reducer,
    [rolePermissionApi.reducerPath]: rolePermissionApi.reducer,
    [helperApi.reducerPath]: helperApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [merchantApi.reducerPath]: merchantApi.reducer,
    [merchantUploadApi.reducerPath]: merchantUploadApi.reducer,
    [memberApi.reducerPath]: memberApi.reducer
  },

  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([authApi.middleware, administratorApi.middleware, rolePermissionApi.middleware, 
      helperApi.middleware, userApi.middleware, merchantApi.middleware, merchantUploadApi.middleware, memberApi.middleware]),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
