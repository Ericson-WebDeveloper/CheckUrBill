
import React, { useState } from "react";
import ConfirmAccountEnroll from "../../components/modals/ConfirmAccountEnroll";
import EnrollAccount from "../../components/modals/EnrollAccount";
import { useGetAccountsQuery } from "../../services/account-service";
import { useMerchantListsQuery } from "../../services/merchant-service";
import { Link } from "react-router-dom";
import Spinner from "../../components/Spinner";

type IndexProps = {};

const Index = (props: IndexProps) => {
  const [enrollModal, setEnrollModal] = useState<boolean>(false);
  const [confirmAccount, setConfirmAccount] = useState<{
    ref1: string | number;
    ref2: string;
    ref3: string;
  } | null>(null);
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const { data: billers, isLoading } = useMerchantListsQuery();
  const { data: accounts, isLoading: loadingAccounts } = useGetAccountsQuery();

  if (isLoading || loadingAccounts) {
    return <div className="container mx-auto"><Spinner /></div>;
  }
  return (
    // user can enroll account per merchant
    // add account using account no -> veirfication by sending code in email that upload in merchant side

    // list of accounts enroll
    // gayahin un globe one app -> multiple accounts
    // new table in backend
    //  new page which is register page

    // my add button to enroll new account

    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {accounts?.data?.map((account, index) => {
          return (
            <div
              key={index}
              className="max-w-sm p-6 h-[250px] bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700"
            >
              <span>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Account No: {account?.account_no}
                </h5>
              </span>
              <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
                Biller: {account?.merchant_name}.
              </p>
              {/* <p className="mb-3 font-semibold text-gray-700 dark:text-gray-400">
            Amount To Pay: {account?.Amount}
          </p> */}
            <p>
            <span className={`inline-flex items-center 
            ${account?.status === 'active'  ? "bg-green-100  text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300" : 
            "bg-red-100  text-red-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-red-900 dark:text-red-300"} `}>
                <span className={`w-2 h-2 mr-1 ${account?.status === 'active'  ? "bg-green-500" : "bg-red-500"} rounded-full`}></span>
                status {account?.status?.toLocaleUpperCase()} 
            </span>
            <span className={`text-sm ${account?.status === 'active'  ? "text-green-500" : "text-red-500"} `}>
              {account?.status !== "warning" ?? 'You have pending bill'}</span>
            </p>
            <br />
              <Link
                to={`/app/auth/enroll-account/${account?.account_no}/${account?.merchant_ref}`}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white 
                ${account?.status === 'active' ? "bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" 
                : 'bg-red-700 rounded-lg hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800'}`}
              >
                View Account
                <svg
                  aria-hidden="true"
                  className="w-4 h-4 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>
          );
        })}

        {/* <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
          <a href="#">
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Noteworthy technology acquisitions 2021
            </h5>
          </a>
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Here are the biggest enterprise technology acquisitions of 2021 so
            far, in reverse chronological order.
          </p>
          <a
            href="#"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Read more
            <svg
              aria-hidden="true"
              className="w-4 h-4 ml-2 -mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </a>
        </div> */}

        {/* add Button */}
        <div
          className="max-w-sm p-6 h-[250px] bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 
        dark:border-gray-700"
        >
          <br />
          <br />
          <br />
          <button
            type="button"
            className="inline-flex w-full justify-center items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg 
            hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700
             dark:focus:ring-blue-800"
            data-modal-toggle="enrollAccountModal"
            onClick={() => setEnrollModal(true)}
          >
            Enroll Account Account
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      <EnrollAccount
        datas={billers?.data || null}
        enrollModal={enrollModal}
        setConfirmAccount={setConfirmAccount}
        setModal={setEnrollModal}
        setConfirmModal={setConfirmModal}
      />
      <ConfirmAccountEnroll
        confirmAccount={confirmAccount}
        confirmModal={confirmModal}
        setConfirmModal={setConfirmModal}
      />
    </div>
  );
};

export default Index;
