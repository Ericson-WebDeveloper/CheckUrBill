import React from 'react'
import { MerchantInterface } from '../../../feature/merchant/merchantAction';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateStatusMerchantMutation } from '../../../services/administrator-service';
import { toast } from 'react-toastify';
import Spinner from '../Spinner';
import { ErrorHandling } from '../../../helpers/errorHandling';


type ActivateMerchantProps = {
    modalActivateMerchant: boolean;
    setActivateMerchantModal: (open: boolean, merchant_code?: string) => Promise<void>;
    merchant: MerchantInterface | null;
}

export interface ActivateDeActivateMerchantInterface {
  id: string;
  merchant_code: string;
  merchant_ref: string;
  status: 'Activated' | 'Deactivated' | 'Not Activated'
}

const ActivateMerchant = (props: ActivateMerchantProps) => {

  const [updateStatusMerchant, {isLoading}] = useUpdateStatusMerchantMutation();

  const onHandleActivateDeactivateRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      const data: ActivateDeActivateMerchantInterface = {
        id: props.merchant?.id!,
        merchant_code: props.merchant?.merchant_code!,
        merchant_ref: props.merchant?.merchant_ref!,
        status: props.merchant?.status!
      }
        e.preventDefault();
        let response = await updateStatusMerchant(data).unwrap();
        toast.success(response?.message);
        props.setActivateMerchantModal(false);
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

  if(isLoading) {
    return <Spinner />
  }

  return (
    <div
      id="merchantactivatemodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.modalActivateMerchant ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Activate/DeActivate Merchant Account: {props.merchant?.status}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
              dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={() => props.setActivateMerchantModal(false)}
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 
                  1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6">
            <form onSubmit={onHandleActivateDeactivateRequest}>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  id="merchant_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  readOnly
                  defaultValue={props.merchant?.merchant_name}
                />
                <label
                  htmlFor="merchant_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Merchant Name
                </label>
              </div>
       
              <button
                type="submit"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >
                Submit
              </button>
            </form>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex justify-end items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => props.setActivateMerchantModal(false)}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 
              text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 
              dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ActivateMerchant