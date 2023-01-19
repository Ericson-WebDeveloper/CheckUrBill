import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/Auth/NavBar";
import SideBar from "../../components/Auth/SideBar";
import Spinner from "../../components/Spinner";
import { useAppSelector } from "../../feature/index";

type LayoutProps = {};

const Layout = (props: LayoutProps) => {
  const { loadingGLobal } = useAppSelector((state) => state.global);
  return (
    <div className="flex flex-col w-full h-screen">
      <>
        <NavBar />
        <SideBar />
      </>
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {loadingGLobal ? <Spinner /> : <Outlet />}
      </div>
    </div>
  );
};

export default Layout;
