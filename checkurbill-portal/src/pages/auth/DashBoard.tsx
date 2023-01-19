import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useAppSelector } from "../../feature";
import { UserAuthHooks } from "../../hooks/AuthHooks";
import BillHistory from "./BillHistory";
import Help from "./Help";
import Index from "./Index";

type DashBoardProps = {};

const DashBoard = (props: DashBoardProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [component, setComponent] = useState<"Index" | "History" | "Help">(
    "Index"
  );
  // const data = useLoaderData() as UserAuthHooks;
  // console.log(data);

  return (
    <div className="flex flex-col w-full h-screen mt-[150px]">
      {/*  */}
      <div className="w-full h-[250px] bg-[#DACDE6] p-4">
        <div className="flex flex-col h-full container mx-auto px-10 justify-between">
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold font-mono text-[#402F83]">
              Hi {userAuth?.firstname || "--"}
            </h1>
            {/* <h1 className="text-lg font-bold font-mono text-[#402F83]">Account No: 8778278424</h1> */}
            <p className="flex space-x-1 items-center text-[#209883]">
              <svg
                className="w-3 h-3 text-[#209883] fill-[#209883]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <label className="font-semibold font-mono">Active</label>
            </p>
          </div>
          <div className="flex w-full">
            <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
              <ul className="flex flex-wrap -mb-px">
                <li className="mr-2 cursor-pointer">
                  <span
                    onClick={() => setComponent("Index")}
                    className={`inline-block p-4 text-gray-600 rounded-t-lg border-b-4 
                  ${
                    component === "Index"
                      ? `border-green-600 active dark:text-green-500 dark:border-green-500`
                      : ""
                  }`}
                  >
                    DASHBOARD
                  </span>
                </li>
                <li className="mr-2 cursor-pointer">
                  <span
                    onClick={() => setComponent("History")}
                    className={`inline-block p-4 text-gray-600 rounded-t-lg border-b-4 
                    ${
                      component === "History"
                        ? `border-green-600 active dark:text-green-500 dark:border-green-500`
                        : ""
                    }`}
                    aria-current="page"
                  >
                    BILL HISTORY
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      {/* content */}
      <div className="flex h-full w-full pt-6">
        {component === "Index" ? (
          <Index />
        ) : component === "History" ? (
          <BillHistory />
        ) : (
          <Help />
        )}
      </div>
    </div>
  );
};

export default DashBoard;
