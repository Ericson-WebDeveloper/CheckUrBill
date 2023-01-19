import React from 'react'
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../feature/index';

type Props = {
    children: React.ReactNode;
}

const CheckUser = (props: Props) => {
    const {userAuth} = useAppSelector(state => state.auth);
    const location = useLocation();
    return userAuth || userAuth !== null ?
      <>{props.children}</>
    :
    <Navigate
      to="/"
      state={{ from: location }}
      replace
    />

 
}

export default CheckUser