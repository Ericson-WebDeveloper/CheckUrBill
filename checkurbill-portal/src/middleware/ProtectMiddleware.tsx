import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import ErrorBoundary from "../components/ErrorBoundary";
import { useAppSelector } from "../feature";

type ProtectedMiddlewareProps = {
  children: React.ReactNode; // 👈️ type children
};

const ProtectedMiddleware = (props: ProtectedMiddlewareProps) => {
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);

  if (token) {
    return <>{props.children}</>;
    // return <Outlet />;
  } else {
    return <Navigate to="/" state={{ from: location }} replace />;
  }
};

export default ProtectedMiddleware;
