import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../feature/store";
import { Permission } from "../models/Permission";

type Props = {
  allowedPermissions: Array<string>;
};

const PermissionMiddleware = (props: Props) => {
  const location = useLocation();
  const { userAuth } = useAppSelector((state) => state.auth);
  return userAuth?.permissions?.find((permission: Permission) =>
    props.allowedPermissions?.includes(permission.name)
  ) ? (
    <Outlet />
  ) : (
    <Navigate
      to="/application/user/unauthorized"
      state={{ from: location }}
      replace
    />
  );
};

export default PermissionMiddleware;
