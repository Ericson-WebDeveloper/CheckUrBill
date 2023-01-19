import React from "react";
import { MerchantInterface } from "../../../feature/merchant/merchantAction";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateAPIUrlMerchantMutation } from "../../../services/administrator-service";
import { toast } from "react-toastify";
import { ErrorHandling } from "../../../helpers/errorHandling";

type UpdateMerchantApiUrlProps = {
  modalEditAPiUrl: boolean;
  setFetchingMerchantAPI: (
    open: boolean,
    merchant_code?: string
  ) => Promise<void>;
  merchant: MerchantInterface | null;
};

export interface UpdateAPIUrlInterface {
  API_URL: string;
  merchant_id: string;
  merchant_code: string;
}

enum SCHEMAENUM {
  Api,
  StandAlone,
  Costumize,
}

const schema = yup.object({
  API_URL: yup.string().required(),
});

const UpdateMerchantApiUrl = (props: UpdateMerchantApiUrlProps) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<UpdateAPIUrlInterface>({
    resolver: yupResolver(schema),
  });

  const [updateAPIUrlMerchant, { data, isLoading }] =
    useUpdateAPIUrlMerchantMutation();

  const schemaType = props.merchant?.checkurbills_schema || "";

  const handleUpdateSubmit: SubmitHandler<UpdateAPIUrlInterface> = async (
    formdata
  ) => {
    try {
      formdata = {
        ...formdata,
        merchant_id: props?.merchant?.id as string,
        merchant_code: props.merchant?.merchant_code as string,
      };
      await updateAPIUrlMerchant(formdata).unwrap();
      reset();
      toast.success("API URL Updated Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };
  return (
    <div
      id="merchantapiurlmodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.modalEditAPiUrl ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Update API URL
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
              dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={() => props.setFetchingMerchantAPI(false)}
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
              <form onSubmit={handleSubmit(handleUpdateSubmit)}>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    id="merchant_name"
                    value={props.merchant?.merchant_name}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    readOnly
                  />
                  <label
                    htmlFor="merchant_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Merchant Name
                  </label>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="url"
                    id="API_URL"
                    {...register("API_URL")}
                    defaultValue={props.merchant?.API_URL || ""}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 
                    focus:border-blue-600 peer"
                  />
                  <label
                    htmlFor="merchant_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    API URL
                  </label>
                  <p className="text-red-600">{errors?.API_URL?.message}</p>
                </div>
          
                {schemaType === "Api" ? (
                  <button
                    type="submit"
                    className="text-white bg-purple-700 hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-purple-300 font-medium rounded-full text-sm px-5 py-2.5 text-center mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                  >
                    Submit
                  </button>
                ) : (
                  <h1 className="text-white text-xl font-semibold">
                    Sorry You setting for Schema was not API mode. if you want
                    to add/update API Url change to API Schema
                  </h1>
                )}
              </form>
            ) : (
              <h1>Merchant Data Not Found</h1>
            )}
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex justify-end items-center p-6 space-x-2 rounded-b border-t border-gray-200 dark:border-gray-600">
            <button
              onClick={() => props.setFetchingMerchantAPI(false)}
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

export default UpdateMerchantApiUrl;
