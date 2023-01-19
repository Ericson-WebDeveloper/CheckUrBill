// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../feature/store";
import {
  IGenericResponse,
  IGenericResponseWPagesState,
} from "../models/response/Response";
import { User, UserInfo } from "../models/User";

// import type { Pokemon } from './types'
import { Merchant } from "../models/Merchant";
import { MerchantList } from "./administrator-service";
import { Role } from "../models/Roles";
import { Permission } from "../models/Permission";
import { AddMerchantUserInteraface } from "../components/modals/merchant/AddAdministrator";
import { Member } from "../models/Members";
import { AddMemberInterface } from "../components/modals/merchant/AddMember";
// Define a service using a base URL and expected endpoints

interface MerchantAdmin {
  info: UserInfo;
  roles: Role[];
  permissions: Permission[];
}

export interface MerchantUserPerPermissions {
  count_total: number;
  permission: string;
}

export interface MembersDashInteraface {
  count_total: number, 
  name: string
}

export type MerchantAdminInterface = MerchantAdmin & User;

export const merchantApi = createApi({
  reducerPath: "merchantApi",
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
  tagTypes: ["AdminLists", "Members"],
  endpoints: (builder) => ({
    fetchMerchant: builder.query<IGenericResponse<MerchantList>, string>({
      query: (merchant_code) => `/api/merchant/fetch/${merchant_code}`,
    }),

    merchantAdminList: builder.query<
      IGenericResponse<IGenericResponseWPagesState<MerchantAdminInterface[]>>,
      { merchant_ref: string; page: string | null }
    >({
      // query: (merchant_ref) => `/api/administrator/merchant/administrator-list/${merchant_ref}`
      query: (arg) => {
        const { merchant_ref, page } = arg;
        return {
          url: page
            ? `/api/administrator/merchant/administrator-list/${merchant_ref}?page=${page}`
            : `/api/administrator/merchant/administrator-list/${merchant_ref}`,
        };
      },
    }),

    fetchMembers: builder.query<IGenericResponse<IGenericResponseWPagesState<Member[]>>, {page: string | null, search: string | null}>({
      query: ({page, search}) => page ? search ?  `/api/merchant/members/list?search=${search}&page=${page}` 
      : `/api/merchant/members/list?&page=${page}` : search ? `/api/merchant/members/list?search=${search}` : `/api/merchant/members/list`,
      providesTags: ["Members"],
    }),
    fetchMember: builder.query<IGenericResponse<Member>, {merchant_ref: string , email: string}>({
      query: ({merchant_ref, email}) => `/api/merchant/member/${merchant_ref}/detail/${email}`,
    }),
    removeMember: builder.mutation<IGenericResponse<null>, { email: string } >({
      query(data) {
        return {
          url: "/api/merchant/removing/member-data/list",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ['Members']
    }),
    updatingMember: builder.mutation<IGenericResponse<null>, { member: number, account_no: string, status: string} >({
      query(data) {
        return {
          url: "/api/merchant/updating/member/status",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ['Members']
    }),
    

    adminMerchantLists: builder.query<
      IGenericResponse<IGenericResponseWPagesState<MerchantAdminInterface[]>>,
      { merchant_ref: string; page: string | null }
    >({
      // query: (merchant_ref) => `/api/administrator/merchant/administrator-list/${merchant_ref}`
      query: (arg) => {
        const { merchant_ref, page } = arg;
        return {
          url: page
            ? `/api/merchant/administrator-list/${merchant_ref}?page=${page}`
            : `/api/merchant/administrator-list/${merchant_ref}`,
        };
      },
      providesTags: ["AdminLists"],
    }),

    onBoardNewAdmin: builder.mutation<
      IGenericResponse<null>,
      AddMerchantUserInteraface
    >({
      query(data) {
        return {
          url: "/api/merchant/create-admin",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdminLists"],
    }),

    resendActivation: builder.mutation<
      IGenericResponse<null>,
      { email: string }
    >({
      query(data) {
        return {
          url: "/api/merchant/user-not-activated/resend/confirmation",
          method: "POST",
          body: data,
        };
      },
    }),

    userAdminActivation: builder.mutation<
      IGenericResponse<null>,
      { user_id: string; merchant_ref: string }
    >({
      query(data) {
        return {
          url: "/api/merchant/user-admin/activated",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdminLists"],
    }),

    userAdminDeActivation: builder.mutation<
      IGenericResponse<null>,
      { user_id: string; merchant_ref: string }
    >({
      query(data) {
        return {
          url: "/api/merchant/user-admin/deactivated",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["AdminLists"],
    }),

    getMerchantDashBoardData: builder.query<IGenericResponse<{
        members: MembersDashInteraface[] | [] | null;
        user_per_permissions: MerchantUserPerPermissions[] | [] | null;
      }>,
      void
    >({
      query: () => `/api/merchant/dashboard/datas`,
    }),

  }),
});
export const {
  useFetchMerchantQuery,
  useMerchantAdminListQuery,
  useAdminMerchantListsQuery,
  useOnBoardNewAdminMutation,
  useResendActivationMutation,
  useUserAdminActivationMutation,
  useUserAdminDeActivationMutation,
  useFetchMembersQuery,
  useFetchMemberQuery,
  useRemoveMemberMutation,
  useGetMerchantDashBoardDataQuery,
  useUpdatingMemberMutation
} = merchantApi;
