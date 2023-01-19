import React, { useMemo, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useUploadingMembersDataMutation } from "../../../services/merchant-uploading-service";
import Spinner from "../../../components/modals/Spinner";
import { IGenericResponse } from "../../../models/response/Response";
import { useAppSelector } from "../../../feature/store";
import TrackingProgress from "../../../hooks/TrackingProgress";
import { ErrorHandling } from "../../../helpers/errorHandling";

type UploadMemberProps = {};

export interface UploadMemberInterface {
  members: FormData;
}

const schema = yup.object({
  // members: yup.mixed().test('required', 'Please Select File Upload', (value) => {
  //   console.log(value);
  //   return value;
  // })
});

// export interface batchJobsProgress {
//   id: string;
//   name: string;
//   total_jobs: number;
//   pendingJobs: number;
//   processedJobs: number;
//   progress: number;
//   totalJobs: number;
//   failedJobs: number;
//   options: Array<unknown> | null;
//   cancelledAt: number | Date | string | null;
//   createdAt: number | Date | string;
//   finishedAt: number | Date | string | null;
// }

const UploadMember = (props: UploadMemberProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UploadMemberInterface>({
    resolver: yupResolver(schema),
  });
  const [uploadingMembersData, { isLoading: uploadingMemberLoading }] =
    useUploadingMembersDataMutation();

  const [fileUpload, setFIleUpload] = useState<null | FileList>(null);
  const ProcessInterval = useRef<null | number>(null);
  // const [batchId, setBatchId] = useState<null | string | number>(null);
  const [batchJobProgress, SetBatchJobProgress] = useState<null | number>(null);
  const { token } = useAppSelector((state) => state.auth);
  // const validationSchema = useMemo(() => (
  //   yup.object().shape({
  //     email: yup.string().email().required('Email is required'),
  //     password: yup.string().required('Password is requred'),
  //     passwordConfirmation: yup.string()
  //       .test({
  //         name: 'password-confirmation',
  //         message: 'Passwords need to match',
  //         test: function () {
  //           const { password, passwordConfirmation } = this.parent;
  //           if (password && passwordConfirmation !== password) {
  //             return false;
  //           }
  //           return true;
  //         }
  //       })
  //   })
  // ), [])
  const UploadProgressReset = () => {
    // setBatchId(null);
    clearInterval(ProcessInterval.current!);
    ProcessInterval.current = null;
    SetBatchJobProgress(null);
  };

  const {hooksProgressJobs} = TrackingProgress(`http://127.0.0.1:8000/api/upload-member/progress/`, token!);

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
        toast.success("Upload Request Success.");
      } else if (response.data?.cancelledAt !== null) {
        UploadProgressReset();
        toast.error(
          `Upload Request Cancel in ${response.data?.progress}& progress. Due the error encounter.`
        );
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

  // useEffect(() => {
  //   if (batchId !== null) {
  //     fetchProgress();
  //   }
  // }, [batchId]);

  const UploadingHandleRequest = async () => {
    if (!fileUpload) {
      toast.error("File was required!");
      return false;
    }
    try {
      const formData = new FormData();
      formData.append("members", fileUpload![0]);
      let response = await uploadingMembersData(formData).unwrap();
      // setBatchId(response?.data?.batchId || null);
      if (response?.data?.batchId) {
        SetBatchJobProgress(1);
        fetchProgress(response?.data?.batchId!);
      }
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

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

  if (uploadingMemberLoading) {
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
          Dont Interrupt Upload Progress....
        </p>
      </>
    );
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
        <h1 className="text-4xl font-serif font-semibold">Upload Members</h1>
        {/* upload bill */}

        <form onSubmit={handleSubmit(UploadingHandleRequest)}>
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              name="floating_password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-black bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-black dark:text-black duration-300 
              transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Description
            </label>
          </div>

          <div className="relative z-0 mb-6 w-full group">
            <label
              htmlFor="member_csv"
              className="peer-focus:font-medium text-sm text-black dark:text-black duration-300 transform 
              -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              File
            </label>
            <input
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer 
              dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="member_csv"
              // {...register('members')}
              onChange={captureUploadFIle}
              type="file"
            />
            <p className="text-red-500 font-sans font-semibold">
              {/* {errors?.members?.message} */}
            </p>
          </div>

          <button
            type="submit"
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

export default UploadMember;
