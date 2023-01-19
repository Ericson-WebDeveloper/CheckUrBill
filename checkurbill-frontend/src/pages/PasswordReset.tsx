import React from 'react'
import { Link, useParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ErrorHandling } from '../helpers/errorHandling';
import { useResetPassRequestMutation } from '../services/auth-service';
import Spinner from '../components/modals/Spinner';
import { toast } from 'react-toastify';

type PasswordResetProps = {}

const schema = yup.object({
  password: yup
    .string()
    .required()
    .min(6, "Password length should be at least 6 characters")
    .max(15, "Password cannot exceed more than 12 characters"),
  confirm_password: yup
    .string()
    .required()
    .oneOf([yup.ref("password")], "Passwords do not match")
});




const PasswordReset = (props: PasswordResetProps) => {
  const { code } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<{password: string, confirm_password: string, code: string}>({
    resolver: yupResolver(schema),
  });
  const [resetPassRequest, {isLoading}] = useResetPassRequestMutation();

  const handleUpdatePass: SubmitHandler<{password: string, confirm_password: string, code: string}> = async (formdata) => {
    try {
      formdata = {
        ...formdata,
        code: code as string
      }
      await resetPassRequest(formdata).unwrap();
      toast.success('Reset Password Success. You can Login now!');
      reset();
      setTimeout(() => {
        window.location.href = '/'
      }, 1000);     
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

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
          <form onSubmit={handleSubmit(handleUpdatePass)} className='flex flex-col p-4 pt-4 w-[60%] md:-[40%] lg:w-[25%] h-[500px] bg-[#1F2937] rounded-2xl'>
            <h1 className='text-center text-3xl font-semibold font-serif text-gray-50'>Reset Your Password</h1>
            <br />
        
            <div className="mb-6 flex flex-col">
                <label  className="block mb-2 text-sm font-medium text-gray-50">Your Password</label>
                <input type="password" {...register("password")} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                <p className='text-red-600'>{errors?.password?.message}</p>
            </div>
            <div className="mb-6 flex flex-col">
                <label  className="block mb-2 text-sm font-medium text-gray-50">Confirm Password</label>
                <input type="password" {...register("confirm_password")} id="default-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                <p className='text-red-600'>{errors?.confirm_password?.message}</p>
            </div>
            <br />
            <p className='text-white font-serif'>
              <Link to='/'>Login</Link></p>
            <br />
            <button type="submit" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium 
            rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Reset</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordReset