import React, { useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import BillCostumerTables from "../../components/tables/merchant/BillCostumerTables";
import {
  useBillCostumerListsQuery,
  useRequestReportMutation,
} from "../../services/merchant-uploading-service";
import Spinner from "../../components/modals/Spinner";
import Paginate from "../../components/pagination/Paginate";
import { useAppSelector } from "../../feature/store";
import TrackingProgress from "../../hooks/TrackingProgress";
import { toast } from "react-toastify";
import { ErrorHandling } from "../../helpers/errorHandling";
import axios from "../../axios/axios";

type BillListsProps = {};

const BillLists = (props: BillListsProps) => {
  const { ref } = useParams();
  const [getPage] = useSearchParams();
  const [requestReport, { isLoading: reportLoading }] =
    useRequestReportMutation();

  const ProcessInterval = useRef<null | number>(null);
  const [pInterval, setPInterval] = useState<null | number>(null);
  const [batchJobProgress, SetBatchJobProgress] = useState<null | number>(null);
  const [progressMessage, setProgressMessage] = useState<null | string>(null);
  const [filename, setFilename] = useState<null | string>(null);
  const { token } = useAppSelector((state) => state.auth);
  const { data: bills, isLoading } = useBillCostumerListsQuery({
    ref: ref || "",
    page: getPage.get("page") || null,
  });
  const UploadProgressReset = () => {
    clearInterval(ProcessInterval.current!);
    ProcessInterval.current = null;
    setPInterval(null)
    SetBatchJobProgress(null);
    setProgressMessage(null);
  };

  const { hooksProgressJobs } = TrackingProgress(
    `http://127.0.0.1:8000/api/report/progress/`,
    token!
  );

  const downloadFile = (file: string) => {
    axios({
      url: `http://127.0.0.1:8000/api/merchant/downloading/file-report/bill?filename_downloaded=${file}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob",
    })
      .then((response) => {
        const url = window.URL.createObjectURL(
          new Blob([response.data], {
            // type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            type: "text/csv;charset=utf-8",
          })
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file); //or any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error: any) => {
        toast.error("File Not Found. please tray again later.");
      });
  };
// change progress ui not based on progress -> loading downloading only
  const getDataApi = async (batchId: string | number, filenamedl: string) => {
    try {
      let response = await hooksProgressJobs(batchId);
      if (response.data?.finishedAt !== null) {
        SetBatchJobProgress(response.data?.progress || null);
        UploadProgressReset();
        toast.success("Downloading File Start....");
        downloadFile(filenamedl);
      } else if (response.data?.cancelledAt !== null) {
        UploadProgressReset();
        toast.error(
          `Download Request Cancel in ${response.data?.progress}& progress. Due the error encounter.`
        );
      } else {
        SetBatchJobProgress(response.data?.progress || null);
      }
    } catch (error: any) {
      UploadProgressReset();
      ErrorHandling(error);
    }
  };

  const fetchProgress = (batchId: string | number, filenamedl:string) => {
    if (ProcessInterval.current === null) {
      ProcessInterval.current = window.setInterval(async () => {
        await getDataApi(batchId, filenamedl);
      }, 2000);
    //   console.log('here');
    }
    // if (pInterval === null) {
    //     let interval = window.setInterval(async () => {
    //       await getDataApi(batchId, filenamedl);
    //     }, 2000);
    //     setPInterval(interval)
    //   }
  };

  const handleGenerateReport = async () => {
    if (!window.confirm("Are you sure to Download this Bill?")) {
      return false;
    }
    try {
      if (!ref) {
        return;
      }
      let response = await requestReport({ bill_reference: ref! }).unwrap();
      if (response?.data?.progress_ref && response?.data?.filename_downloaded) {
        setFilename(response?.data?.filename_downloaded);
        // setTimeout(() => {
          SetBatchJobProgress(1);
          fetchProgress(response?.data?.progress_ref!, response?.data?.filename_downloaded!);
        // }, 1000);
      }
    } catch (error) {
      toast.error(
        "Sorry Unable to Download Bill for the mean time. please try again later."
      );
    }
  };

  if (isLoading || reportLoading) {
    return <Spinner />;
  }

  if (ProcessInterval.current && ProcessInterval.current !== null) {
    // if (pInterval) {
    return (
      <>
        <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700 mt-[50px]">
          <p className="font-bold font-serif text-center text-white">
            Downloading File..... Please Wait.....
          </p>
          {/* <div
            className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            style={{ width: `${batchJobProgress}%` }}
          >
            {" "}
          </div> */}
        </div>
        <p className="text-xl font-semibold font-serif text-center">
          {progressMessage || "Dont Interrupt Generate Report Progress...."}
        </p>
      </>
    );
  }
  // dito nalang un downloading report
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-[80vh]"
    >
      <div className="flex flex-col mb-14">
        <h1 className="flex text-4xl font-serif font-semibold space-x-2 mr-2">
          Costumer Bills{" "}
          <button
            type="button"
            onClick={handleGenerateReport}
            className="text-white ml-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br
                       focus:ring-4 focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 
                       dark:shadow-lg dark:shadow-green-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            DownLoad Bills
          </button>
        </h1>
        {/* list */}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <BillCostumerTables datas={bills?.data?.data || null} />
        </div>
        <div className="flex justify-end items-center mt-6 mb-6">
          {bills && bills?.data?.data?.length! > 0 ? (
            <Paginate
              currentPage={bills?.data?.current_page!}
              prev_page_url={bills?.data?.prev_page_url || null}
              next_page_url={bills?.data?.next_page_url || null}
            />
          ) : null}
        </div>
        <div />
      </div>
      {/* view modal */}
    </motion.div>
  );
};

export default BillLists;
