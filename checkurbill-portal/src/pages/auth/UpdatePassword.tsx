import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorHandling from "../../helper/ErrorHandling";
import { useUpdatePasswordUserMutation } from "../../services/auth-service";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

type UpdatePasswordProps = {};

const schema = yup.object({
  password: yup
    .string()
    .required()
    .min(6, "Password length should be at least 6 characters")
    .max(15, "Password cannot exceed more than 12 characters"),
  confirm_password: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match"),
});

const UpdatePassword = (props: UpdatePasswordProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<{ password: string; confirm_password: string }>({
    resolver: yupResolver(schema),
  });
  const { ErrorHandlingNotif } = ErrorHandling();
  const [updatePasswordUser, { isLoading }] = useUpdatePasswordUserMutation();

  const handlingPassword: SubmitHandler<{
    password: string;
    confirm_password: string;
  }> = async (formdata) => {
    try {
      let response = await updatePasswordUser(formdata).unwrap();
      toast.success(response?.message || "Request Success");
      reset();
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-screen mt-[150px]">
      {/*  */}
      <div className="w-full h-[250px] bg-[#DACDE6] p-4">
        <div className="flex flex-col h-full container mx-auto px-10 justify-between">
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold font-mono text-[#402F83]">
              ACCOUNT CREDENTIALS
            </h1>
          </div>
          <div className="flex w-full">
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2 cursor-pointer">
                  <span
                    className={`inline-block p-4 border-green-600 active dark:text-green-500 dark:border-green-500 text-gray-600 rounded-t-lg border-b-4`}
                  >
                    UPDATE CREDENTIALS
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* content */}
      <div className="flex h-full w-full pt-6">
        <div className="container mx-auto ">
          <div className="flex h-auto w-[650px] mx-auto">
            <div
              className="w-full flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md 
        dark:bg-gray-800 dark:border-gray-700"
            >
              <span>
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-[rgb(64,47,131)]">
                  UPDATE PASSWORD
                </h5>
              </span>
              <div className="flex w-full">
                <form
                  onSubmit={handleSubmit(handlingPassword)}
                  className="w-full"
                >
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="password"
                      id="password"
                      {...register("password")}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                    />
                    <label
                      htmlFor="password"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="password"
                      id="confirm_password"
                      {...register("confirm_password")}
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      required
                    />
                    <label
                      htmlFor="confirm_password"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Confirm password
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
