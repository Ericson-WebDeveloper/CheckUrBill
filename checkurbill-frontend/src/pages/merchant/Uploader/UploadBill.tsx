import React, { useState } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useUploadBillsMutation } from "../../../services/merchant-uploading-service";
import { ErrorInterface } from '../../../models/response/Error';
import { ErrorHandling } from "../../../helpers/errorHandling";
import Spinner from "../../../components/modals/Spinner";


type UploadBillProps = {

};



export interface UploadBillsInterface {
  remarks: string;
  bill_month: Date;
  bills: FormData
}

const UploadBill = (props: UploadBillProps) => {
  const [fromDate, setFromDate] = useState<Date>(new Date());
  const [toDate, setToDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<null|string>(null);
  const [fileUpload, setFIleUpload] = useState<null | FileList>(null);
  const [uploadBills, {isLoading}] = useUploadBillsMutation();

  const handlingUploadBills = async () => {
  
    if (!fileUpload) {
      toast.error("File was required!");
      return false;
    }
    try {
      const formData = new FormData();
      formData.append("bills", fileUpload![0]);
      formData.append("bill_month", fromDate.toDateString());
      formData.append("remarks", remarks || "");
      await uploadBills(formData).unwrap();
      toast.success('Request Uploading Success')
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

  const captureUploadFIle = (e: React.ChangeEvent<HTMLInputElement>) => {
    let types = e.target?.files![0].type.split("/");

    if (types[0] !== "text" || !["csv"].includes(types[1])) {
      toast.error(`File are invalid`, {
        theme: "dark",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
      });
      setFIleUpload(null);
      return false;
    }
    setFIleUpload(e.target.files);
  };

  if(isLoading) {
    return <Spinner />
  }
  
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-[80vh]"
    >
      {/* add in database upload data with id, ref_id, text, etc.... */}
      <div className="flex flex-col mb-14 space-y-4">
        <h1 className="text-4xl font-serif font-semibold">
          Upload Bill
        </h1>
        {/* upload bill */}

        <form>
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              id="remarks"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 
              border-gray-300 appearance-none 
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              onChange={(e) => setRemarks(e.target.value)}
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Remarks
            </label>
          </div>
          <div className="relative z-20 mb-6 w-full group">
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
              -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Bill Date From
            </label>
            <DatePicker
              selected={fromDate}
              onChange={(date: Date) => setFromDate(date)}
              // {...register('bill_month')}
              className="rounded-xl"
            />
            <div className="flex absolute top-5 inset-y-0 left-0 items-center pl-3 pointer-events-none ml-40">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <div className="relative z-10 mb-6 w-full group">
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
              -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Bill Date to
            </label>
            <DatePicker
              selected={toDate}
              onChange={(date: Date) => setToDate(date)}
              className="rounded-xl"
            />
            <div className="flex absolute top-5 inset-y-0 left-0 items-center pl-3 pointer-events-none ml-40">
              <svg
                aria-hidden="true"
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
          </div>
          <div className="relative z-0 mb-6 w-full group">
            <label
              htmlFor="floating_repeat_password"
              className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
              -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              File
            </label>
            <input
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer 
              dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="bills"
              type="file"
              onChange={captureUploadFIle}
            />
          </div>

          <button
            type="button" onClick={handlingUploadBills}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>

        <div />
      </div>
      {/* view modal */}
    </motion.div>
  );
};

export default UploadBill;
