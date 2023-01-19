import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../../components/includes/NavBar";
import SideBar from "../../components/includes/SideBar";
import "flowbite";
import { motion } from "framer-motion";

type LayoutProps = {};

function Layout(props: LayoutProps) {
  const [collapseShow, setCollapseShow] = React.useState<string>("hidden");
  return (
    <div className="flex max-h-max w-full">
      {/* sidebar */}
      <SideBar collapseShow={collapseShow} setCollapseShow={setCollapseShow} />
      {/* content */}
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {/* top Nav */}
        <NavBar setCollapseShow={setCollapseShow} />
        {/* content */}
        <div className="h-screen w-[100%] px-8 pt-24 pb-8 bg-[#F1F5F9]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
