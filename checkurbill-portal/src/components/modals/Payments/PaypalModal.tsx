import React from "react";
import ErrorHandling from "../../../helper/ErrorHandling";
import { usePaymentPaypalMutation } from "../../../services/account-service";
import Spinner from "../../Spinner";

type PaypalModalProps = {
  setPaymentOption: React.Dispatch<
    React.SetStateAction<"" | "Paypal" | "Visa" | "Master Card">
  >;
  reference: string | undefined;
  account_no: string | undefined;
  amount: string | number;
  bill_id: number | null;
  merchant_id: string | null;
};

export interface IPayment {
  merchant_ref: string;
  amount: string;
  bill_id: number;
  account_no: string;
  merchant_id: string;
}

export interface IPaymentConfirm {}

const PaypalModal = (props: PaypalModalProps) => {
  const { ErrorHandlingNotif } = ErrorHandling();
  const [paymentPaypal, { isLoading: paymentPostLoading }] =
    usePaymentPaypalMutation();
  const handlingPaypalPayment = async () => {
    try {
      const data = {
        merchant_ref: props?.reference || "",
        amount: props?.amount as string || "",
        account_no: props?.account_no || "",
        bill_id: props?.bill_id || 0,
        merchant_id: props?.merchant_id || "",
      };

      let response = await paymentPaypal(data).unwrap();

      // get id from and store in localhostorage as payment_paypal_ref
      localStorage.setItem('payment_ref', response?.data?.payment_ref || '');
      localStorage.setItem('transa_id', response?.data?.trans_id || '');
      // get the link from paypal to redirect
      window.location.replace(response?.data?.link!);
      // redirect to links
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  };

  return (
    <div
      id="PaypalModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden
 overflow-y-auto md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto mt-12 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Pay With Paypal
            </h3>
            <button
              type="button"
              onClick={() => props.setPaymentOption("")}
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
            {paymentPostLoading ? (
              <div className="h-[300px] w-full">
                <Spinner />
              </div>
            ) : (
              <div className="flex flex-col w-full h-full">
                <label htmlFor="" className="text-xl font-serif">
                  Amount: Php {props.amount}
                </label>
                <br />
                <button
                  type="button"
                  onClick={handlingPaypalPayment}
                  className="w-[250px] text-gray-900 bg-[#F7BE38] hover:bg-[#F7BE38]/90 focus:ring-4 
              focus:outline-none focus:ring-[#F7BE38]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              inline-flex items-center dark:focus:ring-[#F7BE38]/50 mr-2 mb-2"
                >
                  <svg
                    className="mr-2 -ml-1 w-4 h-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="paypal"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384 512"
                  >
                    <path
                      fill="currentColor"
                      d="M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4 .7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9 .7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"
                    ></path>
                  </svg>
                  Check out with PayPal
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-toggle="enrollAccountModal"
              onClick={() => props.setPaymentOption("")}
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

export default PaypalModal;
