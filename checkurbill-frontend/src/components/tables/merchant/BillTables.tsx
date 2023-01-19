import React, { useRef, useState } from "react";
import { Bill } from "../../../models/Bill";
import moment from "moment";
import { have } from "../../../helpers/can";
import { useAppSelector } from "../../../feature/store";
import {
  useApprovedBillMutation,
  useRejectBillMutation,
  useRequestReportMutation,
} from "../../../services/merchant-uploading-service";
import Spinner from "../../modals/Spinner";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import TrackingProgress from "../../../hooks/TrackingProgress";
import { ErrorHandling } from "../../../helpers/errorHandling";

type BillTablesProps = {
  datas: Bill[] | null;
};

const BillTables = (props: BillTablesProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [approvedBill, { isLoading: ApproveBillLoading }] =
    useApprovedBillMutation();

  const [rejectBill, { isLoading: RejectBillLoading }] =
    useRejectBillMutation();

  const [requestReport, { isLoading: reportLoading }] =
    useRequestReportMutation();

  const ProcessInterval = useRef<null | number>(null);
  const [batchJobProgress, SetBatchJobProgress] = useState<null | number>(null);
  const [progressMessage, setProgressMessage] = useState<null | string>(null);
  const [filename, setFilename] = useState<null | string>(null);
  const { token } = useAppSelector((state) => state.auth);
  const UploadProgressReset = () => {
    // setBatchId(null);
    clearInterval(ProcessInterval.current!);
    ProcessInterval.current = null;
    SetBatchJobProgress(null);
    setProgressMessage(null);
  };
  const { hooksProgressJobs } = TrackingProgress(
    `http://127.0.0.1:8000/api/upload-member/progress/`,
    token!
  );
  const getDataApi = async (batchId: string | number) => {
    try {
      // let r = await fetch(
      //   `http://127.0.0.1:8000/api/upload-member/progress/${batchId}`,
      //   {
      //     method: "GET",
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // let response: IGenericResponse<batchJobsProgress> = await r.json();
      let response = await hooksProgressJobs(batchId);
      if (response.data?.finishedAt !== null) {
        SetBatchJobProgress(response.data?.progress || null);
        UploadProgressReset();
        if (filename !== null) {
          toast.success("Upload Request Success.");
        }
      } else if (response.data?.cancelledAt !== null) {
        UploadProgressReset();
        if (filename !== null) {
          toast.error(
            `Upload Request Cancel in ${response.data?.progress}& progress. Due the error encounter.`
          );
        }
      } else {
        SetBatchJobProgress(response.data?.progress || null);
      }
    } catch (error: any) {
      UploadProgressReset();
      ErrorHandling(error);
    }
  };

  const fetchProgress = (batchId: string | number) => {
    if (ProcessInterval.current === null) {
      ProcessInterval.current = window.setInterval(async () => {
        await getDataApi(batchId);
      }, 2000);
    }
  };

  const handleApprovedBill = async (bill: string, merchant: string) => {
    if (!window.confirm("Are you sure to Approved this Bill. and Upload it?")) {
      return false;
    }
    try {
      let response = await approvedBill({
        bill_id: bill,
        merchant_id: merchant,
      }).unwrap();
      toast.success("Bill Approved and Uploaded to System!.");
      if (response?.data?.batchId) {
        SetBatchJobProgress(1);
        fetchProgress(response?.data?.batchId!);
      }
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleRejectBill = async (bill: string, merchant: string) => {
    if (!window.confirm("Are you sure to Reject this Bill?")) {
      return false;
    }
    try {
      await rejectBill({ bill_id: bill, merchant_id: merchant }).unwrap();
      toast.success("Bill Rejected and never will Uploaded to System!.");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  if (ApproveBillLoading || RejectBillLoading) {
    return <Spinner />;
  }

  if (ProcessInterval.current && batchJobProgress) {
    return (
      <>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-[50px]">
          <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${batchJobProgress}%` }}
          >
            {" "}
            <p className="font-bold font-serif text-center">
              {batchJobProgress}% Uploading
            </p>
          </div>
        </div>
        <p className="text-xl font-semibold font-serif text-center">
          {progressMessage || "Dont Interrupt Upload Progress...."}
        </p>
      </>
    );
  }

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Batch No
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Bill Month
            </th>
            <th scope="col" className="py-3 px-6">
              Date Uploaded
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props?.datas?.map((bill, index) => {
            return (
              <tr
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={index}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {bill?.batch_no}
                </th>
                <td className="py-4 px-6">{bill?.status}</td>
                <td className="py-4 px-6">
                  {moment(bill?.bill_month).format("MMMM YYYY")}
                </td>
                <td className="py-4 px-6">
                  {moment(bill?.date_uploaded).format("MMMM Do YYYY")}
                </td>
                <td className="py-4 px-6">
                  {have(userAuth?.permissions!, ["admin", "authorizer"]) ? (
                    bill?.status === "Pending" ? (
                      <>
                        {" "}
                        <button
                          type="button"
                          onClick={() =>
                            handleRejectBill(bill?.id, bill?.merchant_id)
                          }
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            handleApprovedBill(bill?.id, bill?.merchant_id)
                          }
                          className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br
                             focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 
                             dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Approved
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate(`costumer/${bill?.batch_no}`)}
                          className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br
                       focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 
                       dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          View Bills
                        </button>
                      </>
                    )
                  ) : null}
                  <Link
                    to={`/app/merchant/bills/costumer/transaction/${bill?.batch_no}/${bill?.bill_month}`}
                  >
                    {" "}
                    <button
                      type="button"
                      className="text-white ml-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br
                       focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 
                       dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      View Transaction's History
                    </button>{" "}
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default BillTables;
