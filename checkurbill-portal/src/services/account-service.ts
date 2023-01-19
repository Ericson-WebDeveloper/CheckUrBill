// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { EnrollAcountInterface } from '../components/modals/EnrollAccount';
import { PaymentCardDetailsInterface, PaymentConfirmInterface } from '../components/modals/Payments/MasterCardModal';
import { IPayment } from '../components/modals/Payments/PaypalModal';
import { RootState } from '../feature/index';
import { Account } from '../models/Accounts';
import { BillPayment } from '../models/Bills';
import { IGenericResponse } from '../models/response/Response';
import { IPaypalConfirm } from '../pages/auth/AccountBill/PaypalRedirect';


export interface BiilAccount {
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

type AccountType = Account

export const accountApi = createApi({
    reducerPath: 'accountApi',
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
    tagTypes: ['Accounts', 'Bill'],
    endpoints: (builder) => ({
      getAccounts: builder.query<IGenericResponse<AccountType[]>, void>({
        query: () => `api/portal/accounts/list`,
        providesTags: ['Accounts']
      }),
      linkAccount: builder.mutation<IGenericResponse<{account_ref_1:string, account_ref_2:string, account_ref_3:string}>, EnrollAcountInterface>({
        query(data) {
            return {
              url: '/api/portal/link-account/create',
              method: 'POST',
              body: data,
            };
          },
      }),
      verifyAccount: builder.mutation<IGenericResponse<null>, {ref1:string, ref2:string, ref3:string, ref4: string}>({
        query(data) {
            return {
              url: '/api/portal/link-account/confirm',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Accounts']
      }),
      fetchCurrentBill: builder.query<IGenericResponse<BiilAccount>, {ref:string, account_no:number|string}>({
        query: ({account_no,ref}) => `api/portal/bill-current/${ref}/${account_no}`,
        providesTags: ['Bill']
      }),
      fetchBillPayments: builder.query<IGenericResponse<BillPayment[]>, number>({
        query: (bill_id) => `api/portal/payments/${bill_id}/bill-current`,
        providesTags: ['Bill']
      }),
      
      payWithCard: builder.mutation<IGenericResponse<{payment_id_ref: string, transaction_id: string}>, PaymentCardDetailsInterface>({
        query(data) {
            return {
              url: '/api/portal/user/pay-bill/cards-attempt',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Bill']
      }),
      paymentConfirmCard: builder.mutation<IGenericResponse<null>, PaymentConfirmInterface>({
        query(data) {
            return {
              url: '/api/portal/user/pay-bill/cards-confirm',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Bill']
      }),

      paymentPaypal: builder.mutation<IGenericResponse<{trans_id: string, payment_ref: string, link: string}>, IPayment>({
        query(data) {
            return {
              url: '/api/portal/user/pay-bill/paypal',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Bill']
      }),
      paymentConfirmPaypal: builder.mutation<IGenericResponse<null>, IPaypalConfirm>({
        query(data) {
            return {
              url: '/api/portal/user/confirm/pay-bill/paypal',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Bill']
      }),
      paymentCancelPaypal: builder.mutation<IGenericResponse<null>, {trans_id: string}>({
        query(data) {
            return {
              url: '/api/portal/user/cancel/payment',
              method: 'POST',
              body: data,
            };
          },
          invalidatesTags: ['Bill']
      }),

      fetchBillsMerchant: builder.mutation<IGenericResponse<BiilAccount[]>, {merchant_ref: string, account_no: string}>({
        query(data) {
            return {
              url: '/api/portal/bills-history/merchant/list',
              method: 'POST',
              body: data,
            };
          }
      }),


    }),
});

export const { useLinkAccountMutation, useVerifyAccountMutation, useGetAccountsQuery, useFetchCurrentBillQuery, usePayWithCardMutation, 
usePaymentConfirmCardMutation, useFetchBillPaymentsQuery, usePaymentPaypalMutation, usePaymentConfirmPaypalMutation, 
usePaymentCancelPaypalMutation, useFetchBillsMerchantMutation} = accountApi