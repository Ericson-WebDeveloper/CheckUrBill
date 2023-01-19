import React, { useEffect, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useVerifyAccountMutation } from "../services/auth-service";
import useState from "react";
import Spinner from "../components/modals/Spinner";
import { toast } from "react-toastify";

type ConfirmAccountProps = {};

const ConfirmAccount = (props: ConfirmAccountProps) => {
  const { code } = useParams();
  const shouldRun = useRef(true);
  const [query, setQuery] = useSearchParams();
  const [verifyAccount, { isLoading, isError, error, isSuccess }] =
    useVerifyAccountMutation();

  useEffect(() => {
    const verifyAccountAction = async () => {
      if (shouldRun.current) {
        shouldRun.current = false;
        const data = {
          code: code || "",
          expires: query.get("expires") ? Number(query.get("expires")) : 0,
        };
        await verifyAccount(data).unwrap();
      }
    };
    verifyAccountAction();
  }, [code, query, verifyAccount]);

  useEffect(() => {
    if(isError && error) {
      toast.error('Token Expires/ Invalid. please try again later');
    }
  }, [isError, error]);

  if (isLoading) {
    return <Spinner />;
  }
  return isSuccess ? (
    <div className="flex items-center justify-center h-screen">
      <div className="p-1 rounded shadow-lg bg-gradient-to-r from-purple-500 via-green-500 to-blue-500">
        <div className="flex flex-col items-center p-4 space-y-2 bg-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-green-600 w-28 h-28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h1 className="text-4xl font-bold font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Account Verified !
          </h1>
          <p>Welcome to CheckUrBill. you can login now with the account.</p>
          <span
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded rounded-full 
          hover:bg-indigo-700 focus:outline-none focus:ring"
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
            <Link to="/" className="text-sm font-medium">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen">
      <div className="p-1 rounded shadow-lg bg-gradient-to-r from-purple-500 via-green-500 to-blue-500">
        <div className="flex flex-col items-center p-4 space-y-2 bg-white">
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

          <h1 className="text-4xl font-bold font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-500">
            Account Not Found / Token Code Invalid !
          </h1>
          <p>Token expires in 5 minutes!</p>
          <p>please make sure you have account to verify.</p>
          <span
            className="inline-flex items-center px-4 py-2 text-white bg-indigo-600 border border-indigo-600 rounded rounded-full 
    hover:bg-indigo-700 focus:outline-none focus:ring"
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
            <Link to="/" className="text-sm font-medium">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfirmAccount;
