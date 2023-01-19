import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../../../components/Spinner";
import ErrorHandling from "../../../helper/ErrorHandling";
import { usePaymentCancelPaypalMutation, usePaymentConfirmPaypalMutation } from "../../../services/account-service";

type PaypalRedirectProps = {};

export interface IPaypalConfirm {
  trans_id: string;
  PayerID: string;
  payment_ref: string;
}

const PaypalRedirect = (props: PaypalRedirectProps) => {
  const [getParams, setParams] = useSearchParams();
  const [paymentConfirmPaypal, { isLoading }] =
    usePaymentConfirmPaypalMutation();
  const [paymentCancelPaypal, { isLoading: cancelPaymentLoading }] = usePaymentCancelPaypalMutation();
  
  const navigate = useNavigate();
  const shouldRun = useRef(true);
  const [message, setMessage] = useState<string>('');
  //   getParams.get('token) & getParams.get(''PayerID')
  // payment_paypal_refget get in localstorage
  // data need payment_paypal_ref, PayerID from
  // post capture payment
  const trans_id = localStorage.getItem("transa_id")
    ? JSON.parse(JSON.stringify(localStorage.getItem("transa_id")))
    : null;
    const { ErrorHandlingNotif } = ErrorHandling();

    const removingStorageRef = () => {
      localStorage.removeItem('transa_id');
      localStorage.removeItem('payment_ref');
    }

    const handlingConfirmingPayment = async () => {
      try {
        const data = {
          trans_id: trans_id,
          PayerID: getParams.get("PayerID")!,
          payment_ref: getParams.get("token")!
        }
        await paymentConfirmPaypal(data).unwrap();
        setTimeout(() => {
          removingStorageRef();
          window.location.href = '/app/auth'
        }, 3000);
      } catch (error: any) {
        ErrorHandlingNotif(error);
      }
    }

    const handlingCancelPayment = async () => {
      try {
        const data = {
          trans_id: trans_id
        }
        await paymentCancelPaypal(data).unwrap();
        setTimeout(() => {
          removingStorageRef()
          window.location.href = '/app/auth'
        }, 3000);
      } catch (error: any) {
        ErrorHandlingNotif(error);
      }
    }
  useEffect(() => {
    // token -> id of payment paypal
    if (getParams.get("token") && getParams.get("PayerID") && trans_id && getParams.get("success")) {
      if(shouldRun.current && getParams.get("success") === "true") {
        shouldRun.current = false;
        handlingConfirmingPayment();
       
      } // add jan 13 2023
      else if(shouldRun.current && getParams.get("success") === "false") {
        shouldRun.current = false;
        handlingCancelPayment();
      } 
    } else {
      if(shouldRun.current) {
        shouldRun.current = false;
        toast.error("Invalid Payment Request. Sorry Your Payment was Cancel");
        handlingCancelPayment();
      }
      // post cancel transaction payment
    }
  }, [getParams, trans_id]);

  if (isLoading || cancelPaymentLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="p-1 rounded shadow-lg bg-gradient-to-r from-purple-500 via-green-500 to-blue-500">
        <div className="flex flex-col items-center p-4 space-y-2 bg-white">
          {getParams.get("success") != null ? (
            getParams.get("success") == "true" ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-green-600 w-28 h-28"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
                  Thank You !
                </h1>
                <p>
                  Thank you for your payment! Check your email for details of
                  payment.
                </p>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="text-red-600 w-28 h-28"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>

                <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
                  Payment Failed/Cancel !
                </h1>
                <p>
                  Thank you for your payment attempt!. unfortunately it not
                  success.
                </p>
              </>
            )
          ) : (
            <>
              <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500">
                Sorry this page is not accessible
              </h1>
              <span
                onClick={() => navigate("/app/auth")}
                className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded rounded-full 
                hover:bg-indigo-700 focus:outline-none focus:ring cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3 h-3 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 16l-4-4m0 0l4-4m-4 4h18"
                  />
                </svg>
                <span className="text-sm font-medium">Go Back DashBoard</span>
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaypalRedirect;
