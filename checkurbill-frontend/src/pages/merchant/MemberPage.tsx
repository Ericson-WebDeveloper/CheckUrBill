import React, { useCallback } from "react";
import { motion } from "framer-motion";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  useMemberAllBillsQuery,
  useMemberCurrentBillQuery,
  useMemberDetailQuery,
} from "../../services/member";
import { useParams } from "react-router-dom";
import Spinner from "../../components/modals/Spinner";
import moment from "moment";

type MemberPageProps = {};

const MemberPage = (props: MemberPageProps) => {
  const { member_id } = useParams();
  const { data: member, isLoading: memberLoading } = useMemberDetailQuery(
    member_id || ""
  );
  const { data: bill, isLoading: billLoading } = useMemberCurrentBillQuery(
    {
      ref: member?.data?.merchant_ref || "",
      account_no: (member?.data?.account_no as string) || "",
    },
    {
      skip: memberLoading,
    }
  );

  const { data: bills, isLoading: allBillLoading } = useMemberAllBillsQuery(
    {
      ref: member?.data?.merchant_ref || "default",
      account_no: (member?.data?.account_no as string) || "0000",
    },
    { skip: memberLoading }
  );

  const tottalPayment = useCallback(() => {
    return bills?.data?.reduce((total, newVal) => total + parseFloat(newVal?.["Amount Payment"] as string), 0.00)
  }, [bills]);

  // current bill
  // total payments
  // history payment
  // infomation

  if (memberLoading || billLoading || allBillLoading) {
    return <Spinner />;
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-fit"
    >
      <div className="flex flex-col mb-2 space-y-4">
        <h1 className="text-4xl font-sans font-semibold space-x-2">
          Member Profile
        </h1>
        <div className="flex flex-col w-full space-x-2 space-y-4">
          <div className="h-full">
            <div
              className="flex flex-col lg:flex-row rounded-3xl justify-center lg:justify-between items-center lg:items-start 
            px-2 py-5 bg-[rgb(255,255,255)] space-y-6 lg:space-y-0"
            >
              <div className="flex items-center justify-center lg:justify-start space-x-4 w-full lg:w-2/5">
                <img
                  src="https://via.placeholder.com/30"
                  className="w-22 h-24"
                  alt=""
                />
                <span className="flex flex-col">
                  <h1 className="text-xl font-bold font-serif">
                    {member?.data?.first_name + " " + member?.data?.last_name}
                  </h1>
                </span>
              </div>

              <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start w-full lg:w-2/5">
                <h2 className="text-xl font-bold font-serif">Information</h2>
                <h3 className="text-lg font-serif ">
                  Full Name:{" "}
                  {member?.data?.first_name + " " + member?.data?.last_name}
                </h3>
                <h3 className="text-lg font-serif ">
                  Email: {member?.data?.email}
                </h3>
                <h3 className="text-lg font-serif ">
                  Account No#: {member?.data?.account_no}
                </h3>
                <h3 className="text-lg font-serif ">Gender: N/A</h3>
                <h3 className="text-lg font-serif ">Contact No#: N/A</h3>
              </div>

              <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start w-full lg:w-1/5">
                <h1 className="text-xl font-bold font-serif">Total Payment</h1>
                <div className="flex">
                  <PaymentsIcon />
                  <p className="text-lg font-sans ml-2">PHP {tottalPayment() || '0.00'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full lg:flex-row rounded-3xl space-x-2 space-y-2 lg:space-y-0">
            <div className="flex w-full lg:w-4/12 relative">
              <div className="flex flex-col w-full h-[200px] p-4 bg-[rgb(255,255,255)] rounded-3xl">
                <h1 className="text-xl font-serif mb-1">Latest Bill</h1>
                <h3 className="ml-12 font-semibold text-2xl">Amount to Pay:</h3>
                <h2 className="ml-12 text-4xl font-bold">
                  <p className="text-lg font-sans">
                    PHP {bill?.data
                      ? bill?.data?.Status === "Unpaid"
                        ? bill?.data?.Amount
                        : bill?.data?.Balance
                      : "0.00"}
                  </p>
                </h2>
                {(bill?.data && bill?.data?.Status === "Unpaid") ? (
                  <p className="ml-12 text-md">
                    Due Date {moment(bill?.data?.["Due Date"]).format('MMMM Do YYYY')}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex w-full lg:w-8/12 relative">
              <div className="flex flex-col w-full h-[550px] p-4 bg-[rgb(255,255,255)] rounded-3xl overflow-y-auto overflow-x-hidden">
                <h1 className="text-lg font-semibold font-sans mb-2">
                  History Bill
                </h1>
                <div className="overflow-x-auto sm:overflow-x-visible">
                  <div className="intro-y">
                    <div className="inbox__item inline-block sm:block text-slate-600 dark:text-slate-500 bg-slate-100 dark:bg-darkmode-400/70 border-b border-slate-200/60 dark:border-darkmode-400 inbox__item--active">
                      <div className="flex px-5 py-3 items-center">
                        <div className="flex-none flex items-center mr-5">
                          <div className="inbox__item--sender truncate ml-3">
                            Action
                          </div>
                          <div className="inbox__item--sender truncate ml-3">
                            Type Bill
                          </div>
                        </div>
                        <div className="sm:w-auto truncate">
                          <span className="inbox__item--highlight">Amount</span>
                          {/* Contrary to popular belief, Lorem Ipsum is
                                  not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 20 */}
                        </div>
                        <div className="inbox__item--time whitespace-nowrap ml-auto pl-10">
                          {" "}
                          Date 03:20 PM
                        </div>
                        <div className="inbox__item--time whitespace-nowrap ml-auto pl-10">
                          {" "}
                          Date of Payment 03:20 PM
                        </div>
                      </div>
                      {(bills && bills?.data) ? bills?.data?.map((bill, index) => {
                        return (
                          <>
                            <div
                              className="flex px-5 py-3 items-center"
                              key={index}
                            >
                              <div className="flex-none flex items-center mr-5">
                                {/* depend on status 2 button pay or unpaid based on members incident about payment */}
                                <button
                                  type="button"
                                  className="text-xs font-medium text-white bg-purple-700 hover:bg-purple-800
                                          focus:outline-none focus:ring-4 focus:ring-purple-300 rounded-full px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 
                                          dark:focus:ring-purple-900"
                                >
                                  Pay
                                </button>
                                <div className="inbox__item--sender truncate ml-3">
                                  {bill?.["Transaction Type"]}
                                </div>
                              </div>
                              <div className="sm:w-auto truncate">
                                <span className="inbox__item--highlight">
                                  {bill?.Amount}
                                </span>
                              </div>
                              <div className="inbox__item--time whitespace-nowrap ml-auto pl-10">
                                {" "}
                                Date 03:20 PM
                              </div>
                              <div className="inbox__item--time whitespace-nowrap ml-auto pl-10">
                                {" "}
                                Date of Payment 03:20 PM
                              </div>
                            </div>
                            <br />
                          </>
                        );
                      }) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MemberPage;
