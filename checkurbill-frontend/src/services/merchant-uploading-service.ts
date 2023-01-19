import { Bill, BillCostumer } from './../models/Bill';
// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { AddMemberInterface } from "../components/modals/merchant/AddMember";
import { RootState } from "../feature/store";
import {
  IGenericResponse,
  IGenericResponseWPagesState,
} from "../models/response/Response";
import { UploadMemberInterface } from "../pages/merchant/Uploader/UploadMember";
import { ITransaction } from '../models/Transaction';

type BilliLists = Bill

type BillCostumerLists = BillCostumer;

export const merchantUploadApi = createApi({
  reducerPath: "merchantUploadApi",
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
  tagTypes: ["Members", "Bills"],
  endpoints: (builder) => ({
    uploadingMembersData: builder.mutation<
      IGenericResponse<{batchId: number|string}>,
      FormData
    >({
      query(data) {
        return {
          url: "/api/merchant/uploads/member-data",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Members"],
    }),
    onBoardMember: builder.mutation<IGenericResponse<null>, AddMemberInterface >({
      query(data) {
        return {
          url: "/api/merchant/upload-manual/member-data",
          method: "POST",
          body: data,
        };
      },
    }),
    uploadBills: builder.mutation<IGenericResponse<null>, FormData >({
      query(data) {
        return {
          url: "/api/merchant/upload/bill-data",
          method: "POST",
          body: data,
        };
      },
    }),
    approvedBill: builder.mutation<IGenericResponse<{batchId: string}>, {bill_id:string, merchant_id: string} >({
      query(data) {
        return {
          url: "/api/merchant/upload/bills/approved",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Bills"],
    }),
    rejectBill: builder.mutation<IGenericResponse<null>, {bill_id:string, merchant_id: string} >({
      query(data) {
        return {
          url: "/api/merchant/upload/bills/reject",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Bills"],
    }),
    billLists: builder.query<IGenericResponse<IGenericResponseWPagesState<BilliLists[]>>, string|null>({
      query: (page) => page ? `/api/merchant/bill/lists?page=${page}` : `/api/merchant/bill/lists`,
      providesTags: ["Bills"]
    }),
    billCostumerLists: builder.query<IGenericResponse<IGenericResponseWPagesState<BillCostumerLists[]>>, {ref:string, page: string | null}>({
      query: ({ref,page}) => page ? `/api/merchant/bill/costumer/lists/${ref}?page=${page}` :`/api/merchant/bill/costumer/lists/${ref}`
    }),
    
    billTransactionLists: builder.query<IGenericResponse<IGenericResponseWPagesState<ITransaction[]>>, {reference: string, page: string|null}>({
      query: ({reference, page}) => page ? `/api/merchant/fetch-payments/list/${reference}?page=${page}` :`/api/merchant/fetch-payments/list/${reference}`
    }),

    requestReport: builder.mutation<IGenericResponse<{progress_ref: string, filename_downloaded: string}>, {bill_reference:string} >({
      query(data) {
        return {
          url: "/api/merchant/requesting/file-report/bill",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["Bills"],
    }),
    requestReportTransaction: builder.mutation<IGenericResponse<{progress_ref: string, filename_downloaded: string}>, {trans_reference:string} >({
      query(data) {
        return {
          url: "/api/merchant/generate/report/transaction",
          method: "POST",
          body: data,
        };
      },
      // invalidatesTags: ["Bills"],
    }),
    // downloadFileReport: builder.mutation<IGenericResponse<{progress_ref: string, filename_downloaded: string}>, {bill_reference:string} >({
    //   query(data) {
    //     return {
    //       url: "/api/merchant/requesting/file-report/bill",
    //       method: "POST",
    //       body: data,
    //     };
    //   },
    //   invalidatesTags: ["Bills"],
    // }),

  }),
});
export const { useUploadingMembersDataMutation, useOnBoardMemberMutation, useUploadBillsMutation, useBillListsQuery, 
useApprovedBillMutation, useRejectBillMutation, useBillCostumerListsQuery, useRequestReportMutation, useBillTransactionListsQuery,
useRequestReportTransactionMutation } = merchantUploadApi;
