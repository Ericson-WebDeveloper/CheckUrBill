import React from 'react'
import { Outlet } from 'react-router-dom'
import AuthMiddleware from './AuthMiddleware'
import CheckUser from './CheckUser'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
type Props = {
    children: React.ReactNode;
}

const UserMiddleware = (props: Props) => {
  return (
    <AuthMiddleware>
        <CheckUser>
            {props?.children}
        </CheckUser>
        <ToastContainer />
    </AuthMiddleware>
  )
}

export default UserMiddleware