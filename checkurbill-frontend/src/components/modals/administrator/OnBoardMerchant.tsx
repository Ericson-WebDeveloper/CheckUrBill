import React, { useState } from "react";
import { Category, Institution, Type } from "../../../models/MerchantAttribute";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageToBas64 } from "../../../helpers/ImageBase64";
import { toast } from "react-toastify";
import { useOnBoardMerchantMutation } from "../../../services/administrator-service";
import Spinner from "../Spinner";
import { ErrorHandling } from "../../../helpers/errorHandling";

type OnBoardMerchantProps = {
  modalBoardMerchant: boolean;
  setModalBoardMerchant: React.Dispatch<React.SetStateAction<boolean>>;
  institutions: Institution[] | null;
  categories: Category[] | null;
  types: Type[] | null;
};

export interface MerchantOnBoard {
  logo: string;
  merchant_code: string;
  merchant_name: string;
  checkurbills_schema: "Api" | "StandAlone" | "Costumize";
  // "status": "password12345",
  address: string;
  institution_type_id: string | number;
  merchant_category_id: string | number;
  merchant_type_id: string | number;
  contact_no: string;
}

const schema = yup
  .object({
    merchant_name: yup.string().required(),
    merchant_code: yup
      .string()
      .required()
      .min(30, "Merchant Code Invalid Length Characters"),
    checkurbills_schema: yup.string().required(),
    address: yup.string().required(),
    institution_type_id: yup.string().required("Institution is required"),
    merchant_category_id: yup.string().required("Category is required"),
    merchant_type_id: yup.string().required("Type is required"),
    contact_no: yup.string().required("Merchant Contact No# is required"),
  })
  .required();

const OnBoardMerchant = (props: OnBoardMerchantProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MerchantOnBoard>({
    resolver: yupResolver(schema),
  });

  const [onBoardMerchant, { isLoading }] = useOnBoardMerchantMutation();

  const [image, setImage] = useState<null | string | ArrayBuffer>(null);

  const onSubmitAddUser: SubmitHandler<MerchantOnBoard> = async (formData) => {
    formData = {
      ...formData,
      logo: image as string,
    };
    try {
      await onBoardMerchant(formData).unwrap();
      props.setModalBoardMerchant(false);
      reset();
      toast.success("Request Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const imageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    let types = e.target?.files![0].type.split("/");
    if (types[0] !== "image" || !["png", "jpeg", "jpg"].includes(types[1])) {
      toast.error(`File are invalid`, {
        theme: "dark",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
      });
      return false;
    }
    imageToBas64(e.target, (image) => {
      setImage(image);
    });
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    // <!-- Main modal -->
    <div
      id="boardmerchantmodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.modalBoardMerchant ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              On Board New Merchant
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
              dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={() => props.setModalBoardMerchant(false)}
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
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 
                  1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmitAddUser)}>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  {...register("merchant_name")}
                  id="merchant_name"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <p className="text-red-600">{errors?.merchant_name?.message}</p>
                <label
                  htmlFor="merchant_name"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Merchant Name
                </label>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="text"
                  {...register("merchant_code")}
                  id="merchant_code"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <p className="text-red-600">{errors?.merchant_code?.message}</p>
                <label
                  htmlFor="merchant_code"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Merchant Code
                </label>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    {...register("address")}
                    id="address"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <p className="text-red-600">{errors?.address?.message}</p>
                  <label
                    htmlFor="address"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Address
                  </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="countries"
                    className="block mb-2  text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Select an Schema
                  </label>
                  <select
                    {...register("checkurbills_schema")}
                    id="countries"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option defaultValue={""} disabled>
                      Choose a Schema Type
                    </option>
                    <option value="Api">Api</option>
                    <option value="StandAlone">StandAlone</option>
                    <option value="Costumize">Costumize</option>
                  </select>
                  <p className="text-red-600">
                    {errors?.checkurbills_schema?.message}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="countries"
                    className="block mb-2  text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Select an Institution Type
                  </label>
                  <select
                    id="countries"
                    {...register("institution_type_id")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option defaultValue={""} disabled>
                      Choose a Institution Type
                    </option>
                    {props?.institutions?.map((i, index) => {
                      return (
                        <option value={i.id} key={index}>
                          {i.institution_name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-red-600">
                    {errors?.institution_type_id?.message}
                  </p>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <label
                    htmlFor="countries"
                    className="block mb-2  text-sm font-medium text-gray-500 dark:text-gray-400"
                  >
                    Select an Category Type
                  </label>
                  <select
                    id="countries"
                    {...register("merchant_category_id")}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option defaultValue={""} disabled>
                      Choose a Category Type
                    </option>
                    {props?.categories?.map((i, index) => {
                      return (
                        <option value={i.id} key={index}>
                          {i.merchant_category_name}
                        </option>
                      );
                    })}
                  </select>
                  <p className="text-red-600">
                    {errors?.merchant_category_id?.message}
                  </p>
                </div>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="tel"
                  pattern="[0][0-9]{10}"
                  {...register("contact_no")}
                  id="contact_no"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="contact_no"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  CellPhone number (098776543211)
                </label>
              </div>
              <div className="relative z-0 mb-6 w-full group">
                <label
                  htmlFor="countries"
                  className="block mb-2  text-sm font-medium text-gray-500 dark:text-gray-400"
                >
                  Select an Type
                </label>
                <select
                  id="countries"
                  {...register("merchant_type_id")}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
                    focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option defaultValue={""} disabled>
                    Choose a Type
                  </option>
                  {props?.types?.map((i, index) => {
                    return (
                      <option value={i.id} key={index}>
                        {i.merchant_type_name}
                      </option>
                    );
                  })}
                </select>
                <p className="text-red-600">
                  {errors?.merchant_type_id?.message}
                </p>
              </div>

              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="user_avatar"
              >
                Upload Logo
              </label>
              <input
                onChange={imageCapture}
                className="block w-full mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                id="user_avatar"
                type="file"
              ></input>
              <button
                type="submit"
                className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
              >
                Submit
              </button>
            </form>
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => props.setModalBoardMerchant(false)}
              type="button"
              className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 
              text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 
              dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnBoardMerchant;
