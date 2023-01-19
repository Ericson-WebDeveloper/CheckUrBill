import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../feature/store";
import { Role } from "../models/Roles";

type RoleMiddlewareProps = {
  allowedRoles: Array<string>;
};

const RoleMiddleware = (props: RoleMiddlewareProps) => {
  const location = useLocation();
  const { userAuth } = useAppSelector((state) => state.auth);
  return userAuth?.roles?.find((role: Role) =>
    props.allowedRoles?.includes(role.name)
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

export default RoleMiddleware;
