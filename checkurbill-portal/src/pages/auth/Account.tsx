import React, { useState } from 'react'
import { useAppSelector } from '../../feature';
import Profile from './Profile';
import ProfileUpdate from './ProfileUpdate';

type AccountProps = {}

const Account = (props: AccountProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [component, setComponent] = useState<"Index" | "Update Info">(
    "Index"
  );

  return (
    <div className="flex flex-col w-full h-screen mt-[150px]">
      {/*  */}
      <div className="w-full h-[250px] bg-[#DACDE6] p-4">
        <div className="flex flex-col h-full container mx-auto px-10 justify-between">
          <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold font-mono text-[#402F83]">
              ACCOUNT INFO
            </h1>
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
                    REGISTER INFO
                  </span>
                </li>
                <li className="mr-2 cursor-pointer">
                  <span
                    onClick={() => setComponent("Update Info")}
                    className={`inline-block p-4 text-gray-600 rounded-t-lg border-b-4 
                    ${
                      component === "Update Info"
                        ? `border-green-600 active dark:text-green-500 dark:border-green-500`
                        : ""
                    }`}
                    aria-current="page"
                  >
                    UPDATE INFO
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
          <Profile />
        ) :  
          <ProfileUpdate />
        }
      </div>
    </div>
  )
}

export default Account