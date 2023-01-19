// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RootState } from '../feature/store';
import { Member } from '../models/Members';
import { IGenericResponse } from '../models/response/Response';



interface BiilAccount {
    id: number;
    'Account No': number;
    merchant_ref: string;
    Address: string;
    Amount: string;
    'Amount Payment': string | number;
    Balance: string | number;
    'Bill From': Date;
    'Bill To': Date
    'Due Date': Date;
    Email: string;
    Name: string;
    'Reference No': string;
    Status: string;
    'Transaction Type': string;
    batch_no: string;
  
  
  }


export const memberApi = createApi({
  reducerPath: 'memberApi',
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
    memberDetail: builder.query<IGenericResponse<Member>, string>({
        query: (email) => `/api/merchant/fetch/merchant/detail/${email}`
    }),
    memberCurrentBill: builder.query<IGenericResponse<BiilAccount>, {ref: string, account_no: string}>({
        query: ({ref, account_no}) => `/api/merchant/bill-current/${ref}/member/${account_no}`
    }),
    memberAllBills: builder.query<IGenericResponse<BiilAccount[]>, {ref: string, account_no: string}>({
        query: ({ref, account_no}) => `/api/merchant/bills/${ref}/member/${account_no}`
    }),
  }),
})

export const { useMemberDetailQuery, useMemberCurrentBillQuery, useMemberAllBillsQuery} = memberApi

// 