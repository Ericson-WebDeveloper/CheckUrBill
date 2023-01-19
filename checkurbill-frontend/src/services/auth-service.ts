// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/store';
import { IGenericResponse } from '../models/response/Response';
import { User, UserInfo } from '../models/User';
import { SignInData } from '../pages/SignIn';
// import type { Pokemon } from './types'
import { Role } from '../models/Roles';
import { Permission } from '../models/Permission';
import { Location } from 'react-router-dom';

// Define a service using a base URL and expected endpoints
export interface UserSignInResponse {
  user: User;
  info: UserInfo;
  roles: Role[];
  permissions: Permission[]
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
    loginUser: builder.mutation<IGenericResponse<{token:string, user: UserSign & User}>, SignInData>({
      query(data) {
          return {
            url: '/api/user/signin',
            method: 'POST',
            body: data,
          };
        },
    }),
    verifyAccount: builder.mutation<IGenericResponse<null>, {code: string, expires: number}>({
      query(data) {
          return {
            url: '/api/verify/account/user',
            method: 'POST',
            body: data,
          };
        },
    }),
    logoutUser: builder.mutation<IGenericResponse<null>, void>({
      query() {
          return {
            url: '/api/user/signout',
            method: 'POST',
          };
        },
    }),
    resendActivation: builder.mutation<IGenericResponse<null>, {email: string}>({
      query(data) {
          return {
            url: '/api/administrator/user-not-activated/resend/confirmation',
            method: 'POST',
            body: data,
          };
        },
    }),
    sendResetPassRequest: builder.mutation<IGenericResponse<null>, {email: string}>({
      query(data) {
          return {
            url: '/api/request/reset-password',
            method: 'POST',
            body: data,
          };
        },
    }),
    resetPassRequest: builder.mutation<IGenericResponse<null>, {password: string, confirm_password: string, code: string}>({
      query(data) {
          return {
            url: '/api/send-post/reset-password',
            method: 'POST',
            body: data,
          };
        },
    }),
    fetchUserCredential: builder.query<IGenericResponse<UserSign & User>, Location | string>({
      query: (location) => `/api/user`
    }),
  }),
})


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginUserMutation, useFetchUserCredentialQuery, useLogoutUserMutation, useVerifyAccountMutation, useResendActivationMutation, 
useSendResetPassRequestMutation, useResetPassRequestMutation } = authApi
