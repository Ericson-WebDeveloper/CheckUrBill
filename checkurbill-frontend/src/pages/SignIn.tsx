import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useLoginUserMutation } from '../services/auth-service';
import Spinner from '../components/modals/Spinner';
import { useAppDispatch } from '../feature/store';
import { SET_TOKEN, SET_USER_AUTH } from '../feature/auth/auth';
import { redirectUrl } from '../helpers/redirect';
import { toast } from 'react-toastify';

type SignInProps = {}

export interface SignInData {
  email: string;
  password: string;
}
const schema = yup.object({
  email: yup.string().required().email(),
  password: yup.string().required().min(6, "Password cannot exceed minimum than 6 characters").max(15, "Password cannot exceed more than 12 characters"),
}).required();

const SignIn = (props: SignInProps) => {
  // {data, isError, isLoading, isSuccess, error}
  const [loginUser, {isLoading}] = useLoginUserMutation();
  const dispatch = useAppDispatch();
  let navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignInData>({
    resolver: yupResolver(schema)
  });

  const onSubmit: SubmitHandler<SignInData> = async (formData) => {
    try {
      let response = await loginUser(formData).unwrap();
      dispatch(SET_TOKEN(response?.data?.token!));
      dispatch(SET_USER_AUTH(response?.data?.user!));
      navigate(redirectUrl(response?.data?.user!.roles!));
    } catch (error: any) {
      toast.error(error?.data?.message || error?.data?.error);
    }
  };

  if(isLoading) {
    return <Spinner />
  }

  return (
    <div className='flex flex-col w-full'>
      <NavBar />
      <div className={`w-full space-x-4 pt-6 items-center justify-center dark:bg-login-bg bg-gray-100`}>
        <div className='items-center flex flex-col h-screen'>
          <h1 className='text-4xl font-semibold font-serif'>CheckUrBill</h1>
          <br />
          <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col p-4 pt-4 w-[60%] md:-[40%] lg:w-[25%] h-[500px] bg-[#1F2937] rounded-2xl'>
            <h1 className='text-center text-3xl font-semibold font-serif text-gray-50'>Sign in to your account</h1>
            <br />
            <div className="mb-6 flex flex-col">
                <label  className="block mb-2 text-sm font-medium text-gray-50">Your Email</label>
                <input type="text" {...register("email")} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                <p className='text-red-600'>{errors?.email?.message}</p>
            </div>
            <div className="mb-6 flex flex-col">
                <label  className="block mb-2 text-sm font-medium text-gray-50">Your Password</label>
                <input type="password" {...register("password")} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                <p className='text-red-600'>{errors?.password?.message}</p>
            </div>
            <br />
            <p className='text-white font-serif'><Link to='/forget-password'>Forget Password?</Link></p>
            <br />
            <button type="submit" className=" focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium 
            rounded-lg text-lg px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Sign In</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SignIn