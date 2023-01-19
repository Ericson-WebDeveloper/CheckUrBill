import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUpdateAccountUserMutation } from "../../services/auth-service";
import Spinner from "../../components/Spinner";
import { toast } from 'react-toastify';
import ErrorHandling from "../../helper/ErrorHandling";

type Props = {};

export interface AccountUpdateInterface {
  firstname: string;
  lastname: string;
  middlename: string;
  email: string;
}

const schema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  middlename: yup.string().required(),
  email: yup.string().required().email(),
});

const ProfileUpdate = (props: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AccountUpdateInterface>({
    resolver: yupResolver(schema),
  });
  const {ErrorHandlingNotif} = ErrorHandling();
  const  [updateAccountUser, {isLoading}] = useUpdateAccountUserMutation();
  const handlingUpdate: SubmitHandler<AccountUpdateInterface> = async(formdata) => {
    try {
        let response = await updateAccountUser(formdata).unwrap();
        reset();
        toast.success(response?.message || 'Request Success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    } catch (error: any) {
        ErrorHandlingNotif(error);
    }
  }

  if(isLoading) {
    return <div className="container mx-auto">
        <Spinner />
    </div>
    
  }

  return (
    <div className="container mx-auto">
      <div className="flex w-full h-auto">
        <div
          className="w-full flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md 
        dark:bg-gray-800 dark:border-gray-700"
        >
          <span>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-[rgb(64,47,131)]">
              UPDATE INFO
            </h5>
          </span>
          <div className="flex w-full">
            <form onSubmit={handleSubmit(handlingUpdate)} className="w-full">
              <div className="relative z-0 mb-6 w-full group">
                <input
                  type="email"
                  id="email"
                  {...register("email")}
                  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                />
                <label
                  htmlFor="email"
                  className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  Email address
                </label>
                <p className="text-red-400">{errors?.email?.message}</p>
              </div>
              <div className="grid md:grid-cols-2 md:gap-6">
                <div className="relative z-0 mb-6 w-full group">
                  <input
                    type="text"
                    id="firstname"
                    {...register("firstname")}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
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
                    {...register("lastname")}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
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
                    {...register("middlename")}
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                  />
                  <label
                    htmlFor="middlename"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >
                    Middle name
                  </label>
                  <p className="text-red-400">{errors?.middlename?.message}</p>
                </div>
              </div>{" "}
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
  );
};

export default ProfileUpdate;
