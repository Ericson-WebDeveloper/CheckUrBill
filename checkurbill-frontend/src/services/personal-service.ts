// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/store';
import { IGenericResponse } from '../models/response/Response';
import { User, UserInfo } from '../models/User';

// import type { Pokemon } from './types'
import { Role } from '../models/Roles';
import { Permission } from '../models/Permission';
import { Location } from 'react-router-dom';
import { UserProfileUpdateType } from '../pages/administrator/Profile';
import { PasswordUserUpdate } from '../pages/administrator/ProfilePassword';
// Define a service using a base URL and expected endpoints
export interface UserSignInResponse {
  user: User;
  info: UserInfo;
  roles: Role[];
  permissions: Permission[]
}

type UserType = Omit<UserSignInResponse, "user">;



export const userApi = createApi({
  reducerPath: 'userApi',
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
    
    updateAvatarUser: builder.mutation<IGenericResponse<UserType & User>, {user_id: string, avatar: string}>({
      query(data) {
          return {
            url: '/api/user/avatar-update',
            method: 'POST',
            body: data,
          };
        },
    }),

    updateBasicInfoUser: builder.mutation<IGenericResponse<UserType & User>, UserProfileUpdateType>({
      query(data) {
          return {
            url: '/api/user/profile-info/update',
            method: 'POST',
            body: data,
          };
        },
    }),

    updatePasswordCredentialUser: builder.mutation<IGenericResponse<null>, PasswordUserUpdate>({
      query(data) {
          return {
            url: '/api/user/profile-password/update',
            method: 'POST',
            body: data,
          };
        },
    }),
  }),
})


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useUpdateAvatarUserMutation, useUpdateBasicInfoUserMutation, useUpdatePasswordCredentialUserMutation } = userApi