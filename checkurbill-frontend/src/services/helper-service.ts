// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/store';
import { Category, Institution, Type } from '../models/MerchantAttribute';
import { Permission } from '../models/Permission';
import { IGenericResponse } from '../models/response/Response';


export const helperApi = createApi({
  reducerPath: 'helperApi',
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
    institutions: builder.query<IGenericResponse<Institution[]>, void>({
        query: () => `/api/get-institutions/list`
    }),
    categories: builder.query<IGenericResponse<Category[]>, void>({
        query: () => `/api/get-categories/list`
    }),
    types: builder.query<IGenericResponse<Type[]>, void>({
        query: () => `/api/get-types/list`
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useInstitutionsQuery, useCategoriesQuery, useTypesQuery } = helperApi