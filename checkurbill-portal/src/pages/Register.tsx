import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useRegisterUserMutation } from "../services/auth-service";
import { toast } from "react-toastify";
import ErrorHandling from "../helper/ErrorHandling";
import Spinner from "../components/Spinner";


type RegisterProps = {};

export interface SignUpData {
  firstname: string;
  lastname: string;
  middlename:string;
  email: string;
  password: string;
}
const schema = yup.object({
  firstname: yup.string().required(),
  lastname: yup.string().required(),
  middlename: yup.string().required(),
  email: yup.string().required().email(),
  password: yup.string().required().
  min(6, "Password cannot exceed minimum than 6 characters")
  .max(15, "Password cannot exceed more than 12 characters"),
});


const Register = (props: RegisterProps) => {
  const [registerUser, {isLoading}] = useRegisterUserMutation();
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<SignUpData>({
    resolver: yupResolver(schema)
  });
  const {ErrorHandlingNotif} = ErrorHandling();

  const handlingRegister: SubmitHandler<SignUpData> = async (formdata) => {
    try {
      let response = await registerUser(formdata).unwrap();
      toast.success(response?.message || 'Request Success');
      reset();
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  }

  if(isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex h-auto pt-8 pb-10">
      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-12 space-y-8 lg:space-y-0 w-full container mx-auto lg:mx-[100px] xl:mx-[150px]">
        <div className="lg:h-screen w-full flex flex-col">
          <h1 className="text-5xl text-semibold font-mono">CheckUrBills</h1>
          <br />
          <p className="text-lg text-justify">
            Receive your paperless bills online via CheckUrBills and pay
            cashless with hundreds of our partnered merchants!
          </p>
        </div>
        <div className="lg:h-screen w-full">
          <h1 className="text-4xl font-semibold font-mono">SignUp Here</h1>
          <br />
          <form onSubmit={handleSubmit(handlingRegister)} className="border-2 border-gray-300 p-6 rounded-lg shadow-xl">
          <div className="mb-6">
              <label
                htmlFor="firstname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstname"
                {...register('firstname')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
   focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark
   :focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
              />
              <p className="text-red-400">{errors?.firstname?.message}</p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="middlename"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Middle Name
              </label>
              <input
                type="text"
                id="middlename"
                {...register('middlename')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
   focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark
   :focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
        
              />
              <p className="text-red-400">{errors?.middlename?.message}</p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="lastname"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastname"
                {...register('lastname')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
   focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark
   :focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
              
              />
              <p className="text-red-400">{errors?.lastname?.message}</p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your email
              </label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
   focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark
   :focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="name@flowbite.com"
            
              />
              <p className="text-red-400">{errors?.email?.message}</p>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Your password
              </label>
              <input
                type="password"
                id="password"
                {...register('password')}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
  focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
  dark:focus:ring-blue-500 dark:focus:border-blue-500"
                
              />
              <p className="text-red-400">{errors?.password?.message}</p>
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
  );
};

export default Register;
