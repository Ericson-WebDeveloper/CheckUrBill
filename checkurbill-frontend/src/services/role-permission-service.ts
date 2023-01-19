// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/store';
import { Permission } from '../models/Permission';
import { IGenericResponse } from '../models/response/Response';


export const rolePermissionApi = createApi({
  reducerPath: 'rolePermissionApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000', 
  prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
          headers.set('Authorization', `Bearer ${token}`)
      }
      headers.set('accept','application/json');
      return headers
    },
  // credentials: 'include',
  }),
  
  endpoints: (builder) => ({
    permissions: builder.query<IGenericResponse<{permissions: Permission[]}>, void>({
        query: () => `/api/essetials-data/permissions`
    }),
  }),
});


// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { usePermissionsQuery } = rolePermissionApi