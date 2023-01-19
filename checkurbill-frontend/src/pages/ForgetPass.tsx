import React from 'react'
import { Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSendResetPassRequestMutation } from '../services/auth-service';
import Spinner from '../components/modals/Spinner';
import { toast } from 'react-toastify';

type ForgetPassProps = {}

const schema = yup.object({
  email: yup.string().required('Email is required').email('Email is invalid'),
})

const ForgetPass = (props: ForgetPassProps) => {

  const { register, handleSubmit, watch, formState: { errors } } = useForm<{email:string}>({
    resolver: yupResolver(schema)
  });
  const [sendResetPassRequest, {isLoading}] = useSendResetPassRequestMutation();

  const handleResetPassRequest: SubmitHandler<{email:string}> = async (formdata) => {
    try {
      let response = await sendResetPassRequest(formdata).unwrap();
      toast.success(response?.message || 'Request Success');
    } catch (error: any) {
      toast.error('Reset Password Request Failed. please try again.')
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
          <form onSubmit={handleSubmit(handleResetPassRequest)} className='flex flex-col p-4 pt-4 w-[30%] h-[500px] bg-[#1F2937] rounded-2xl'>
            <h1 className='text-center text-3xl font-semibold font-serif text-gray-50'>Forget Password</h1>
            <br />
            <div className="mb-6 flex flex-col">
                <label  className="block mb-2 text-sm font-medium text-gray-50">Your Email</label>
                <input type="text" {...register('email')} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 " />
                <p className='text-red-500 text-sm'>{errors?.email?.message}</p>
            </div>
            <p className='text-white font-sans'>Request an reset password</p>
            <br />
            <p className='text-white font-serif hover:text-blue-600'><Link to='/'>Have Account?</Link></p>
            <br />
            <button type="submit" className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium 
            rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Send Request</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgetPass