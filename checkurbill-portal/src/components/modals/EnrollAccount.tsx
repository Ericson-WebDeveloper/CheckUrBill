import React, { useState } from "react";
import { Merchant } from "../../models/Merchant";
import Spinner from "../Spinner";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import ConfirmAccountEnroll from "./ConfirmAccountEnroll";
import { useLinkAccountMutation } from "../../services/account-service";
import ErrorHandling from "../../helper/ErrorHandling";


type EnrollAccountProps = {
  enrollModal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  datas: Merchant[] | null;
  setConfirmAccount: React.Dispatch<
    React.SetStateAction<{
      ref1: string | number;
      ref2: string;
      ref3: string;
    } | null>
  >;
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface EnrollAcountInterface {
  merchant: string;
  account_no: string | number;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
}

const schema = yup.object({
  merchant: yup.string().required(),
  account_no: yup.string().required(),
  firstname: yup.string().required(),
  middlename: yup.string().required(),
  lastname: yup.string().required(),
  email: yup.string().required().email(),
});

const EnrollAccount = (props: EnrollAccountProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<EnrollAcountInterface>({
    resolver: yupResolver(schema),
  });

  const {ErrorHandlingNotif} = ErrorHandling();

  const [linkAccount, { isLoading: accountLinkLoading }] =
    useLinkAccountMutation();

  const handlingAccountLink: SubmitHandler<EnrollAcountInterface> = async (
    formdata
  ) => {
    try {
      let response = await linkAccount(formdata).unwrap();
      props.setConfirmAccount({
        ref1: response?.data?.account_ref_1!,
        ref2: response?.data?.account_ref_2!,
        ref3: response?.data?.account_ref_3!,
      });
      toast.success(response.message || "Request Success");
      reset();
      props.setModal(false);
      props.setConfirmModal(true);
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  };

  return (
    <div
      id="enrollAccountModal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.enrollModal ? "" : "hidden"
      } fixed  top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden
 overflow-y-auto md:inset-0 h-modal md:h-full`}
    >
      <div className="relative w-full h-full max-w-2xl mx-auto mt-12 md:h-auto">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Enroll Account
            </h3>
            <button
              type="button"
              onClick={() => props.setModal(false)}
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
            {accountLinkLoading ? (
              <div className="h-[300px] w-full">
                <Spinner />
              </div>
            ) : (
              <form onSubmit={handleSubmit(handlingAccountLink)}>
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="default"
                    className="block mb-2 text-sm text-gray-400 dark:text-white"
                  >
                    Select Merchant
                  </label>
                  <select
                    {...register("merchant")}
                    id="default"
                    className="bg-gray-50 border border-gray-300 text-gray-900 mb-6 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value={""}>Choose a Biller's</option>
                    {props.datas?.map((merchant, index) => {
                      return (
                        <option value={merchant?.merchant_ref} key={index}>
                          {merchant?.merchant_name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-red-400">{errors?.merchant?.message}</p>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    id="account_no"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("account_no")}
                  />
                  <label
                    htmlFor="account_no"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Account No#
                  </label>
                  <p className="text-red-400">{errors?.account_no?.message}</p>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                      id="firstname"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      {...register("firstname")}
                    />
                    <label
                      htmlFor="firstname"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      First name
                    </label>
                    <p className="text-red-400">{errors?.firstname?.message}</p>
                  </div>
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                      id="lastname"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      {...register("lastname")}
                    />
                    <label
                      htmlFor="lastname"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Last name
                    </label>
                    <p className="text-red-400">{errors?.lastname?.message}</p>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                      id="middlename"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      {...register("middlename")}
                    />
                    <label
                      htmlFor="middlename"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Middle name
                    </label>
                    <p className="text-red-400">
                      {errors?.middlename?.message}
                    </p>
                  </div>
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="email"
                      id="email"
                      className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                      placeholder=" "
                      {...register("email")}
                    />
                    <label
                      htmlFor="email"
                      className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Email
                    </label>
                    <p className="text-red-400">{errors?.email?.message}</p>
                  </div>
                </div>
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Submit
                </button>
              </form>
            )}
          </div>

          <div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              data-modal-toggle="enrollAccountModal"
              // onClick={() => props.setModal(false)}
              onClick={() => {
                props.setModal(false);
              }}
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
  );
};

export default EnrollAccount;
