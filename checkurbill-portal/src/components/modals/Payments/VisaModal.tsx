import React, {useState} from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { useAppSelector } from "../../../feature/index";
import { Elements } from "@stripe/react-stripe-js";
import StripeCardForm from "../../payment/StripeCardForm";
import { usePaymentConfirmCardMutation, usePayWithCardMutation } from "../../../services/account-service";
import ErrorHandling from "../../../helper/ErrorHandling";
import Spinner from "../../Spinner";
import { toast } from 'react-toastify';


const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLICKEY!);

type VisaModalProps = {
  setPaymentOption: React.Dispatch<React.SetStateAction<"" | "Paypal" | "Visa" | "Master Card">>;
  paymentOption: "Visa";
  reference: string | undefined;
  account_no: string | undefined;
  amount: string | number;
  bill_id: number | null;
  merchant_id: string | null;
}

const VisaModal = (props: VisaModalProps) => {

  const [payWithCard, { isLoading }] = usePayWithCardMutation();
  const [paymentConfirmCard, {isLoading: confirmLoading}] = usePaymentConfirmCardMutation();
  const { ErrorHandlingNotif } = ErrorHandling();
  const handlePayBill = async (payment_id_reference: string) => {
    try {
      let data = {
        merchant_ref: props?.reference || "",
        payment_intent_reference: payment_id_reference || "",
        account_no: props?.account_no || "",
        bill_id: props?.bill_id || 0,
        merchant_id: props?.merchant_id || "",
      };
      let response = await payWithCard(data).unwrap();
      data.payment_intent_reference = "";
      let confirmData = {
        ...data,
        payment_reference: response?.data?.payment_id_ref!,
        trans_id: response?.data?.transaction_id!,
        type_card: props?.paymentOption
      }
      let r = await paymentConfirmCard(confirmData).unwrap();
      toast.success(r?.message || 'Payment Success');
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  };

  return (
    <div
      id="VisaModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden
 overflow-y-auto md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto mt-12 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Pay With Visa
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
          <div className="p-6 space-y-6">
            {(isLoading || confirmLoading) ? (
              <div className="h-[300px] w-full">
                <Spinner />
              </div>
            ) : (
              <>
                <label htmlFor="" className="text-xl font-serif">
                  Amount: Php {props.amount}
                </label>
                <Elements stripe={stripePromise}>
                  {/* <CheckoutForm /> */}
                  <StripeCardForm
                    typeCard={props.paymentOption}
                    handlePay={handlePayBill}
                  />
                </Elements>
              </>
            )}
          </div>
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
  )
}

export default VisaModal