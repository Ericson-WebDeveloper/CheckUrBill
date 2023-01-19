import React, { useState } from "react";
import { Permission } from "../../../models/Permission";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { imageToBas64 } from "../../../helpers/ImageBase64";
import { toast } from "react-toastify";
import { useOnBoardNewAdminMutation } from "../../../services/merchant-service";
import Spinner from "../Spinner";
import { ErrorHandling } from "../../../helpers/errorHandling";

type AddAdministratorProps = {
  modalAdd: boolean;
  setModalAdd: React.Dispatch<React.SetStateAction<boolean>>;
  permissions: Permission[] | null;
};

export interface AddMerchantUserInteraface {
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
  gender: string;
  avatar: string;
  contact_no: string;
  permission: string;
}

const schema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  middlename: yup.string().required(),
  email: yup.string().required().email(),
  gender: yup.string().required('gender is required'),
  contact_no: yup.string().required('contact no is required'),
  permission: yup.string().required('permission is required'),
});

const AddAdministrator = (props: AddAdministratorProps) => {
  const [image, setImage] = useState<null | string | ArrayBuffer>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AddMerchantUserInteraface>({
    resolver: yupResolver(schema),
  });
  const [onBoardNewAdmin, {isLoading: postNewAdminLoading}] = useOnBoardNewAdminMutation();

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

  const handlePostRequestAdd:SubmitHandler<AddMerchantUserInteraface> = async (formdata) => {
    try {
      formdata = {
        ...formdata,
        avatar: image as string
      }
      await onBoardNewAdmin(formdata).unwrap();
      reset();
      props.setModalAdd(false)
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

  if(postNewAdminLoading) {
    return <Spinner />
  }

  return (
    <div
      id="boardmerchantmodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`${
        props.modalAdd ? "" : "hidden"
      } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex justify-between items-start p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Add Merchant Admin
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center 
              dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="defaultModal"
              onClick={() => props.setModalAdd(false)}
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
            <form onSubmit={handleSubmit(handlePostRequestAdd)}>
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="email"
                  id="floating_email"
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...register("email")}
                />
                <label
                  htmlFor="floating_email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
                <p className="text-red-600 font-semibold">
                  {errors?.email?.message}
                </p>
              </div>

              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    {...register("firstname")}
                    id="floating_first_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_first_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    First name
                  </label>
                  <p className="text-red-600 font-semibold">
                    {errors?.firstname?.message}
                  </p>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    {...register("lastname")}
                    id="floating_last_name"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_last_name"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Last name
                  </label>
                  <p className="text-red-600 font-semibold">
                    {errors?.lastname?.message}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    {...register("middlename")}
                    id="middlename"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none 
                    dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="middlename"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 
                    top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Middle Name
                  </label>
                  <p className="text-red-600 font-semibold">
                    {errors?.middlename?.message}
                  </p>
                </div>
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="tel"
                    pattern="[0][0-9]{10}"
                    {...register("contact_no")}
                    id="floating_phone"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 
                    appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 
                    focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="floating_phone"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
                    -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
                    peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    CellPhone number (098776543211)
                  </label>
                  <p className="text-red-600 font-semibold">
                    {errors?.contact_no?.message}
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <fieldset>
                    {/* <legend className="sr-only">Countries</legend> */}

                    <div className="flex items-center mb-4 mt-5">
                      <input
                        id="country-option-1"
                        type="radio"
                        {...register("gender")}
                        value="Male"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 
                      dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="country-option-1"
                        className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Male
                      </label>
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        id="country-option-2"
                        type="radio"
                        {...register("gender")}
                        value="Female"
                        className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 
                        dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="country-option-2"
                        className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Female
                      </label>
                    </div>
                  </fieldset>

                  <label
                    htmlFor="floating_company"
                    className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 
                    top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Gender
                  </label>
                  <p className="text-red-600 font-semibold">
                    {errors?.gender?.message}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 md:gap-6">
                  <div className="relative z-0 mb-6 w-full group">
                    <fieldset>
                      {/* <legend className="sr-only">Countries</legend> */}

                      {props.permissions?.map((p, index) => {
                        return (
                          <div
                            className="flex items-center mb-4 mt-5"
                            key={index}
                          >
                            <input
                              id="country-option-1"
                              type="radio"
                              {...register("permission")}
                              value={p.id}
                              className="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 
                        dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600"
                            />
                            <label
                              htmlFor="country-option-1"
                              className="block ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                            >
                              {p.name}
                            </label>
                          </div>
                        );
                      })}
                    </fieldset>

                    <label
                      htmlFor="floating_company"
                      className="peer-focus:font-medium absolute text-lg text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 
                    top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 
                    peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >
                      Permission
                    </label>
                    <p className="text-red-600 font-semibold">
                      {errors?.permission?.message}
                    </p>
                  </div>
                </div>
              </div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                htmlFor="user_avatar"
              >
                Upload avatar
              </label>
              <input
                className="block w-full mb-4 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                aria-describedby="user_avatar_help"
                id="user_avatar"
                type="file"
                onChange={imageCapture}
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
              onClick={() => props.setModalAdd(false)}
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

export default AddAdministrator;
