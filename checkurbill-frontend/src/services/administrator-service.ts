// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../feature/store";
import {
  IGenericResponse,
  IGenericResponseWPagesState,
} from "../models/response/Response";

import { Location } from "react-router-dom";
import { AddUserInteraface } from "../components/modals/administrator/AddUser";
import { UserSignInResponse } from "./auth-service";
import { MerchantOnBoard } from "../components/modals/administrator/OnBoardMerchant";
import { UpdateAPIUrlInterface } from "../components/modals/administrator/UpdateMerchantApiUrl";
import { MerchantInfoUpdate } from "../components/modals/administrator/UpdateMerchantInfo";
import { ActivateDeActivateMerchantInterface } from "../components/modals/administrator/ActivateMerchant";
import { AddMerchantAdminInterface } from "../components/modals/administrator/OnBoardMerchantAdmin";

export interface MerchantList {
  id: string;
  merchant_ref: string;
  merchant_code: string;
  merchant_name: string;
  lbp_enrolled_account: string | null;
  checkurbills_schema: "Api" | "StandAlone" | "Costumize";
  status: "Activated" | "Deactivated" | "Not Activated";
  API_URL: string | null;
  created_at: Date;
  updated_at: Date;
  detail_id: string;
  detail_merchant_id: string;
  detail_address: string;
  institution_type_id?: number;
  merchant_category_id?: number;
  merchant_type_id?: number;
  merchant_institution?: string;
  merchant_category?: string;
  merchant_type?: string;
  detail_contact_no: string;
  detail_logo: string;
  detail_created_at: Date;
  detail_updated_at: Date;
}

export interface UserPerRoles {
  count_total: number;
  name: string;
}
export interface UserPerRolesPermissions {
  count_total: number;
  permission: string;
  role: string;
}

export const administratorApi = createApi({
  reducerPath: "administratorApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://127.0.0.1:8000",

    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = (getState() as RootState).auth.token;
      // console.log(endpoint);
      // console.log(token);
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      headers.set("accept", "application/json");
      return headers;
    },
    // credentials: 'include',
  }),

  tagTypes: ["AdministratorUsers", "MerchantList"],

  endpoints: (builder) => ({
    adminsUserList: builder.query<
      { data: IGenericResponseWPagesState<UserSignInResponse[]> },
      { type: string; page: string | null }
    >({
      query: (arg) => {
        const { type, page } = arg;
        return {
          url: page
            ? `/api/administrator/admins-list?type=${type}&page=${page}`
            : `/api/administrator/admins-list?type=${type}`,
        };
        // (type, page) => page ? `/api/administrator/admins-list?type=${type}&page=${page}` : `/api/administrator/admins-list?type=${type}`
      },
      providesTags: ["AdministratorUsers"],
    }),

    deleteAdminUser: builder.mutation<
      IGenericResponse<null>,
      { user_id: string; email: string }
    >({
      query(data) {
        return {
          url: "/api/administrator/removing/user-account",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdministratorUsers"],
    }),

    deActivateAdminUser: builder.mutation<
      IGenericResponse<null>,
      { user_id: string; email: string }
    >({
      query(data) {
        return {
          url: "/api/administrator/user/deactivated-status",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdministratorUsers"],
    }),

    activateAdminUser: builder.mutation<
      IGenericResponse<null>,
      { user_id: string; email: string }
    >({
      query(data) {
        return {
          url: "/api/administrator/user/activated-status",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdministratorUsers"],
    }),

    addNewAdmin: builder.mutation<IGenericResponse<null>, AddUserInteraface>({
      query(data) {
        return {
          url: "/api/administrator/create-admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdministratorUsers"],
    }),

    getDashBoardData: builder.query<
      IGenericResponse<{
        user_per_roles: UserPerRoles[] | [] | null;
        user_per_roles_permissions: UserPerRolesPermissions[] | [] | null;
      }>,
      void
    >({
      query: () => `/api/administrator/dashboard/datas`,
    }),

    getMerchantLists: builder.query<IGenericResponse<IGenericResponseWPagesState<MerchantList[]>>, 
    {search: string | null, page: string| null}>({
      query: ({search, page}) => search ? page ? `/api/administrator/merchants/list?page=${page}&search=${search}` 
      : `/api/administrator/merchants/list?search=${search}` : 
      page ? `/api/administrator/merchants/list?page=${page}` : `/api/administrator/merchants/list`,
      providesTags: ["MerchantList"],
    }),

    onBoardMerchant: builder.mutation<IGenericResponse<null>, MerchantOnBoard>({
      query(data) {
        return {
          url: "/api/administrator/uploader/onboard-merchant",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MerchantList"],
    }),
    updateAPIUrlMerchant: builder.mutation<
      IGenericResponse<null>,
      UpdateAPIUrlInterface
    >({
      query(data) {
        return {
          url: "/api/administrator/update/merchant-url-api",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MerchantList"],
    }),
    updateInfoMerchant: builder.mutation<
      IGenericResponse<null>,
      MerchantInfoUpdate
    >({
      query(data) {
        return {
          url: "/api/administrator/update/merchant-data/info",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MerchantList"],
    }),

    updateStatusMerchant: builder.mutation<
      IGenericResponse<null>,
      ActivateDeActivateMerchantInterface
    >({
      query(data) {
        return {
          url: "/api/administrator/authorizer/approve-merchant",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["MerchantList"],
    }),

    onBoardAdminMerchant: builder.mutation<
      IGenericResponse<null>,
      AddMerchantAdminInterface
    >({
      query(data) {
        return {
          url: `/api/administrator/authorizer/create/${data.merchant_id}/admin-merchant/${data.merchant_code}`,
          method: "POST",
          body: data,
        };
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useAddNewAdminMutation,
  useAdminsUserListQuery,
  useGetDashBoardDataQuery,
  useGetMerchantListsQuery,
  useOnBoardMerchantMutation,
  useUpdateAPIUrlMerchantMutation,
  useUpdateInfoMerchantMutation,
  useUpdateStatusMerchantMutation,
  useOnBoardAdminMerchantMutation,
  useDeleteAdminUserMutation,
  useDeActivateAdminUserMutation,
  useActivateAdminUserMutation,
} = administratorApi;
