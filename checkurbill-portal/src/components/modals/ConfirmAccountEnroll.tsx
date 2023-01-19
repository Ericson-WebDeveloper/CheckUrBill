import React, { useState } from "react";
import ErrorHandling from "../../helper/ErrorHandling";
import { useVerifyAccountMutation } from "../../services/account-service";
import Spinner from "../Spinner";
import { toast } from 'react-toastify';

type ConfirmAccountEnrollProps = {
  confirmModal: boolean;
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmAccount: {
    ref1: string | number;
    ref2: string;
    ref3: string;
  } | null;
};

const ConfirmAccountEnroll = (props: ConfirmAccountEnrollProps) => {
  const { ErrorHandlingNotif } = ErrorHandling();
  const [code, setCode] = useState<string|null>(null);
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const handlingConfirmAccount = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(props?.confirmAccount);
    try {
      const data = {
        ref1: props?.confirmAccount?.ref1! as string,
        ref2: props?.confirmAccount?.ref2!,
        ref3: props?.confirmAccount?.ref3!,
        ref4: code!,
      };
      let response = await verifyAccount(data).unwrap();
      toast.success(response?.message || 'Request Success');
      props.setConfirmModal(false);
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  };
  return (
    <div
      // id="enrollAccountModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.confirmModal ? "" : "hidden"
      } fixed  top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden
 overflow-y-auto md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto mt-12 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Confirm Enroll Account
            </h3>
            <button
              type="button"
              onClick={() => props.setConfirmModal(false)}
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="enrollAccountModal"
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
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {isLoading ? (
              <div className="h-[300px] w-full">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handlingConfirmAccount}>
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="account_no"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
                  -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Account No# 
                  </label>{props?.confirmAccount?.ref2}
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    id="code"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <label
                    htmlFor="code"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
                  -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
                  peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Code
                  </label>
                </div>

                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={() => props.setConfirmModal(false)}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 
                focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 
                focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 
                dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccountEnroll;
