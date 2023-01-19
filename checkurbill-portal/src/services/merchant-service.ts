// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/index';
import { Category, Institution, Merchant, Type } from '../models/Merchant';
import { IGenericResponse } from '../models/response/Response';


export const merchantApi = createApi({
    reducerPath: 'merchantApi',
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
        merchantLists: builder.query<IGenericResponse<Merchant[]>, void>({
            query: () => `api/portal/merchant-list`,
        }),
        fetchMerchant: builder.query<IGenericResponse<Merchant>, string>({
            query: (ref) => `api/portal/merchant/${ref}`,
        }),
        fetchMerchantCategories: builder.query<IGenericResponse<Category[]>, void>({
            query: () => `api/portal/merchant/categories`,
        }),

        fetchBillerCategories: builder.query<IGenericResponse<Category[]>, void>({
            query: () => `api/get-categories/list`,
        }),
        fetchBillersCategories: builder.query<IGenericResponse<Merchant[]>, string>({
            query: (category) => `api/get/billers/${category}`,
        }),

        fetchMerchantTypes: builder.query<IGenericResponse<Type[]>, void>({
            query: () => `api/portal/merchant/types`,
        }),
        fetchMerchantInstitutions: builder.query<IGenericResponse<Institution[]>, void>({
            query: () => `api/portal/merchant/institutions`,
        }),
    }),
});

export const { useMerchantListsQuery, useFetchMerchantQuery, useFetchBillerCategoriesQuery, useFetchBillersCategoriesQuery } = merchantApi