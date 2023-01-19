import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from 'react-router-dom';
import { useFetchUserCredentialQuery } from "../services/auth-service";
import { useAppDispatch } from "../feature/store";
import { SET_USER_AUTH } from "../feature/auth/auth";
import Spinner from "../components/modals/Spinner";

type PrefetchProps = {};

const Prefetch = (props: PrefetchProps) => {
  // const [loading, setLoading] = useState<boolean>(false);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const {isLoading, data, isError, isSuccess, error} = useFetchUserCredentialQuery(location.pathname);
  useEffect(() => {
    // const prefetchRequest = () => {
    //     setLoading(true);
    //     setTimeout(() => {
    //         setLoading(false);
    //     }, 10000);
    // }
    // prefetchRequest();
    if(isSuccess && data) {
      dispatch(SET_USER_AUTH(data.data!));
    }
    if(isError && error) {
      dispatch(SET_USER_AUTH(null));
      // check error if 401 to clear token
    }
  }, [isSuccess, data, dispatch, isError, error]);

  if(isLoading) {
    return <Spinner />
  }

  return (
    <>
      <Outlet />
    </>
  );
};

export default Prefetch;
