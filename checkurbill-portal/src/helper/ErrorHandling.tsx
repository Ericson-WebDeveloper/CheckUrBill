import { toast } from "react-toastify";

import React from 'react'

const ErrorHandling = () => {
  const ErrorHandlingNotif = (error: any) => {
    if ("response" in error) {
      // axios error handling
      if (error?.response?.status === 422) {
        // const response: any = error?.data;
        //   let errors: Array<any> = response?.errors;
        //   let keys = Object.keys(response.errors);
        //   keys.forEach((key) => {
        //     let key1 = key as string;
        //     toast.error(errors[key1 as keyof typeof errors][0]);
        //   });
        let errors = error?.response?.data?.errors;
        let keys = Object.keys(errors);
        keys?.forEach((key, index) => {
          toast.error(errors[key][0] || "", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        });
      } else if (error?.response?.status === 400) {
        return toast.error(error?.data?.message || error?.data?.error, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      } else if (error?.response?.status === 403) {
        return toast.error(
          `You don't have permission/role to access / on this server.`,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
        // You don't have permission/role to access / on this server.
      } else if (error?.response?.status === 401) {
        // unauthenticated
        toast.error(
          `You are unauthenticated. you are forcing to logout or refreshing you auth session.`,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
        // do the refreshing if have ever like this functionality
      } else {
        // unexpected error
        toast.error(
          error?.response?.message ||
            error?.response?.error ||
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Server Error. Request Failed",
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
      }
    } else if ("status" in error) {
      // rtk query
      if (error?.status === 422) {
        // const response: any = error?.data;
        //   let errors: Array<any> = response?.errors;
        //   let keys = Object.keys(response.errors);
        //   keys.forEach((key) => {
        //     let key1 = key as string;
        //     toast.error(errors[key1 as keyof typeof errors][0]);
        //   });
  
        let errors = error?.data?.errors;
        let keys = Object.keys(errors);
  
        keys?.forEach((key, index) => {
          toast.error(errors[key][0] || "", {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          });
        });
      } else if (error?.status === 400) {
        toast.error(error?.data?.message, {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
        });
      } else if (error?.status === 403) {
        toast.error(
          `You don't have permission/role to access / on this server.`,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
        // You don't have permission/role to access / on this server.
      } else if (error?.status === 401) {
        // unauthenticated
        toast.error(
          `You are unauthenticated. you are forcing to logout or refreshing you auth session.`,
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
        // do the refreshing if have ever like this functionality
      } else {
        // unexpected error
        toast.error(
          error?.message ||
            error?.error ||
            error?.data?.message ||
            error?.data?.error ||
            "Server Error. Request Failed",
          {
            position: "top-right",
            autoClose: false,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
          }
        );
      }
    } else {
      // unexpected error
      toast.error(
        error?.message || error?.error || "Server Error. Request Failed",
        {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
        }
      );
    }
  };
  return {ErrorHandlingNotif}
}

export default ErrorHandling