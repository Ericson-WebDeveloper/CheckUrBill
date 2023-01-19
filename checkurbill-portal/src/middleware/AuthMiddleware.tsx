import React, { useEffect } from 'react'
import { useLoaderData, Outlet, useLocation } from 'react-router-dom';
import { UserAuthHooks } from '../hooks/AuthHooks'
import { IGenericResponse } from '../models/response/Response';
import { useGetUserAuthQuery } from '../services/auth-service';
import { useAppDispatch } from '../feature/index';
import { SET_TOKEN, SET_USER_AUTH } from '../feature/auth/auth';
import Spinner from '../components/Spinner';

type Props = {
  children: React.ReactNode; // 👈️ type children
}

const AuthMiddleware = (props: Props) => {
    // const data = useLoaderData() as IGenericResponse<UserAuthHooks> | null;
    const location = useLocation();
    const dispatch = useAppDispatch();
    const {data, isLoading, isError, isSuccess, error} = useGetUserAuthQuery(location.pathname);

    useEffect(() => {
      if(isSuccess && data) {
        dispatch(SET_USER_AUTH(data.data!));
      }
      if(isError && error) {
        const errorData: any = error;
        if(errorData?.status && errorData?.status === 401) {
          dispatch(SET_USER_AUTH(null));
          dispatch(SET_TOKEN(null));
        }
        dispatch(SET_USER_AUTH(null));
        // check error if 401 to clear token
      }
    }, [isSuccess, data, dispatch, isError, error]);

    if(isLoading) {
      return <Spinner />
    }
    return (
      <>
        {props?.children}
      </>
    )
}

export default AuthMiddleware