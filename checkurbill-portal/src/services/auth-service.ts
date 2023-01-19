// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/index';
import { IGenericResponse } from '../models/response/Response';
import { Role } from '../models/Role';
import { User, UserInfo } from '../models/User';
import { AccountUpdateInterface } from '../pages/auth/ProfileUpdate';
import { SignInData } from '../pages/Login';
import { SignUpData } from '../pages/Register';

// Define a service using a base URL and expected endpoints
export interface UserSignInResponse {
    user: User;
    info?: UserInfo | null;
    roles: Role[];
}
type UserSign = Omit<UserSignInResponse, "user">;

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000', 
    prepareHeaders: (headers, { getState, endpoint }) => {
        const token = (getState() as RootState).auth.token
        // console.log(endpoint);
        // console.log(token);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`)
        }
        headers.set('accept','application/json');
        return headers
      },
    // credentials: 'include',
    }),
    
    endpoints: (builder) => ({
      getUserAuth: builder.query<IGenericResponse<UserSign & User>, string>({
        query: (path) => `api/portal/user-auth`,
      }),
      loginUser: builder.mutation<IGenericResponse<{token:string, user: UserSign & User}>, SignInData>({
        query(data) {
            return {
              url: '/api/portal/signin-user',
              method: 'POST',
              body: data,
            };
          },
      }),
      logoutUser: builder.mutation<IGenericResponse<null>, void>({
        query(data) {
            return {
              url: '/api/portal/user-auth/signout',
              method: 'POST',
              body: data,
            };
          },
      }),
      registerUser: builder.mutation<IGenericResponse<null>, SignUpData>({
        query(data) {
            return {
              url: '/api/portal/signup-user',
              method: 'POST',
              body: data,
            };
          },
      }),
      updateAccountUser: builder.mutation<IGenericResponse<null>, AccountUpdateInterface>({
        query(data) {
            return {
              url: '/api/portal/account/update-info',
              method: 'POST',
              body: data,
            };
          },
      }),
      updatePasswordUser: builder.mutation<IGenericResponse<null>, {password:string, confirm_password: string}>({
        query(data) {
            return {
              url: '/api/portal/account/update-credentials',
              method: 'POST',
              body: data,
            };
          },
      }),
    }),
});

export const { useLoginUserMutation, useRegisterUserMutation, useGetUserAuthQuery, useLogoutUserMutation, useUpdateAccountUserMutation, 
useUpdatePasswordUserMutation } = authApi