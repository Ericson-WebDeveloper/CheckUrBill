import axios from '../../axios/axios';
// import {Csrf} from '../../axios/csrf';
import axiosError from 'axios';
// import {SET_ALL_MYTICKETS, SET_OPENTICKETS, SET_PROG_ERROR, SET_PROG_LOADING, SET_PROG_SUCCESS, 
//     SET_QA_ICKETS, SET_UPDATE_ALLTICKETS, 
//     SET_UPDATE_ASSIGN_QATICKETS, 
//     //SET_UPDATE_OPENTICKETS, 
//     SET_UPDATE_TICKETS} from './programmerSlice'
import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { SET_DATA, SET_LOADING } from './merchantSlice';
import { IGenericResponse } from '../../models/response/Response';
// import { TicketOnProgress } from '../../components/User/ViewTicket';


export interface MerchantInterface {
    id: string;
    merchant_ref: string;
    merchant_code: string;
    merchant_name: string;
    lbp_enrolled_account: string | null;
    checkurbills_schema: 'Api' | 'StandAlone' | 'Costumize';
    status: 'Activated' | 'Deactivated' | 'Not Activated';
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

export const fetchMerchant = (merchant_code: string) => async(dispatch: Dispatch<AnyAction>): Promise<void> => {
    try {
        dispatch(SET_LOADING(true));
        let response = await axios.get<IGenericResponse<MerchantInterface>>(`/api/merchant/fetch/${merchant_code}`);
        dispatch(SET_DATA({field: 'merchant', data: response?.data?.data!}));
    } catch (error) {
        // check if error is an axios error
     if (axiosError.isAxiosError(error)) {
        console.log(error.response?.data)
        if (!error?.response) {
            console.log("No Server Response");
        } else if (error.response?.status === 400) {
            console.log("Missing Username or Password");
        } else if (error.response?.status === 401) {
            console.log("Unauthorized");
        } else {
            console.log("Login Failed");
        } 
     } 
     dispatch(SET_DATA({field: 'merchant', data: null}));
    } finally {
        dispatch(SET_LOADING(false))
    }
}

// export const getTicketsAssignQA = (page = 1) => async(dispatch: Dispatch<AnyAction>): Promise<void> => {
//     try {
//         dispatch(SET_PROG_LOADING(true));
//         let {data} = await axs.get(`/api/backend/ticketing-system/tickets-qa/assign?page=${page}`);
//         console.log(data.tickets.data)
//         dispatch(SET_QA_ICKETS(data.tickets));
//     } catch (error) {
//         dispatch(SET_PROG_ERROR({error: 'Data Not Found', errors: null}));
//         dispatch(SET_QA_ICKETS(null));
//     } finally {
//         dispatch(SET_PROG_LOADING(false));
//     }
// }

// export const assignToQa = async(data: {user_id: number}, id: number) => {
//     return await axs.put(`/api/backend/ticketing-system/ticket/assigningQa/${id}`, data); 
// }