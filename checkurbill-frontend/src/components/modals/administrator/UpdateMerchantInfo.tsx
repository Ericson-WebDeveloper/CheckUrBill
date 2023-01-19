import React, { useState } from "react";
import { MerchantInterface } from "../../../feature/merchant/merchantAction";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageToBas64 } from "../../../helpers/ImageBase64";
import { toast } from "react-toastify";
import { useUpdateInfoMerchantMutation } from "../../../services/administrator-service";
import Spinner from "../Spinner";
import { ErrorHandling } from "../../../helpers/errorHandling";


type UpdateMerchantInfoProps = {
  modalMerchantUpdateInfo: boolean;
  setModalEditInfo: (open: boolean, merchant_code?: string) => Promise<void>;
  merchant: MerchantInterface | null;
};

export interface MerchantInfoUpdate {
  merchant_id: string;
  merchant_code: string;
  merchant_name: string;
  address: string;
  checkurbills_schema: string;
  contact_no: string;
  logo: string | null;
}

const schema = yup.object({
  merchant_name: yup.string().required(),
  address: yup.string().required(),
  checkurbills_schema: yup.string().required(),
  contact_no: yup.string().required()
});

const UpdateMerchantInfo = (props: UpdateMerchantInfoProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<MerchantInfoUpdate>({
    resolver: yupResolver(schema),
  });
  const [updateInfoMerchant, {isLoading}] = useUpdateInfoMerchantMutation();

  const [image, setImage] = useState<null | string | ArrayBuffer>(null);

  const handleUpdateInfoSubmit: SubmitHandler<MerchantInfoUpdate> = async(formdata) => {
    try {
      formdata = {
        ...formdata,
        merchant_id: props?.merchant?.id as string,
        merchant_code: props.merchant?.merchant_code as string,
        logo: image as string | null
      };
      await updateInfoMerchant(formdata).unwrap();
      props.setModalEditInfo(false)
      reset();
      toast.success('Data Info Updated Success');
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

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

  if(isLoading) {
    return <Spinner />
  }

  return (
    <div
      id="boardmerchantmodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.modalMerchantUpdateInfo ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update Merchant Info
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
            dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={() => props.setModalEditInfo(false)}
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
            {props.merchant ? (
              <form onSubmit={handleSubmit(handleUpdateInfoSubmit)}>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    {...register("merchant_name")}
                    defaultValue={props?.merchant?.merchant_name}
                    id="merchant_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  {/* <p className="text-red-600">{errors?.merchant_name?.message}</p> */}
                  <label
                    htmlFor="merchant_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Merchant Name
                  </label>
                  <p className="text-red-600">
                      {errors?.merchant_name?.message}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 mb-6 w-full group">
                    <input
                      type="text"
                        {...register("address")}
                        defaultValue={props?.merchant?.detail_address}
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
                    <p className="text-red-600">
                      {errors?.address?.message}
                    </p>
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
                      id="checkurbills_schema"
                      defaultValue={props?.merchant?.checkurbills_schema}
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

                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="tel"
                    pattern="[0][0-9]{10}"
                    {...register("contact_no")}
                    defaultValue={props.merchant?.detail_contact_no}
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
                  <p className="text-red-600">
                      {errors?.contact_no?.message}
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
            ) : (
              <h1>Merchant Data Not Found</h1>
            )}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center justify-end p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => props.setModalEditInfo(false)}
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

export default UpdateMerchantInfo;
