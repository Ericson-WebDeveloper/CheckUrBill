import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../feature/store";

type ProtectedMiddlewareProps = {};

const ProtectedMiddleware = (props: ProtectedMiddlewareProps) => {
  const location = useLocation();
  const { token, userAuth } = useAppSelector((state) => state.auth);

  if (token) {
    return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default ProtectedMiddleware;
