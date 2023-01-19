import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { toast } from "react-toastify";
import ErrorHandling from "../helper/ErrorHandling";
import { useLoginUserMutation } from "../services/auth-service";
import Spinner from "../components/Spinner";
import SignInSuccess from "../hooks/SIgnInSuccess";


type LoginProps = {};

export interface SignInData {
  email: string;
  password: string;
}

const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required(),
});

const Login = (props: LoginProps) => {
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<SignInData>({
    resolver: yupResolver(schema)
  });
  const {setUpToken, setUpCredentials} = SignInSuccess();
  const [loginUser, {isLoading}] = useLoginUserMutation();

  const {ErrorHandlingNotif} = ErrorHandling();

  const handlingLogin: SubmitHandler<SignInData> = async (formdata) => {
    try {
      let response = await loginUser(formdata).unwrap();
      setUpToken(response?.data?.token!);
      setUpCredentials(response?.data?.user!);
      toast.success(response?.message || 'Request Success');
      reset();
      window.location.href = '/app/auth';
    } catch (error: any) {
      ErrorHandlingNotif(error);
    }
  }

  if(isLoading) {
    return <Spinner />
  }

  return (
    <div className="flex h-auto pt-8">
      <div className="flex flex-col lg:flex-row space-x-0 lg:space-x-12 w-full container mx-auto lg:mx-[100px] xl:mx-[150px]">
        <div className="lg:h-screen w-full flex flex-col">
          <h1 className="text-5xl text-semibold font-mono">CheckUrBills</h1>
          <br />
          <p className="text-lg text-justify">
            Receive your paperless bills online via CheckUrBills and pay
            cashless with hundreds of our partnered merchants!
          </p>
        </div>
        <div className="lg:h-screen w-full">
          <h1 className="text-4xl font-semibold font-mono">SignIn Here</h1>
          <br />
          <form onSubmit={handleSubmit(handlingLogin)} className="border-2 border-gray-300 p-6 rounded-lg shadow-xl">
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

export default Login;
