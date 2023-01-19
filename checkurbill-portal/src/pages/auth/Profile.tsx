import React from "react";
import { useAppSelector } from "../../feature";

type ProfileProps = {};

const Profile = (props: ProfileProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  return (
    <div className="container mx-auto">
      <div className="flex w-full h-[200px]">
        <div className="w-full flex flex-col p-6 space-y-3 bg-white border border-gray-200 rounded-lg shadow-md 
        dark:bg-gray-800 dark:border-gray-700">
          <span>
            <h5 className="mb-2 text-2xl font-bold tracking-tight text-[rgb(64,47,131)]">
              PERSONAL INFO
            </h5>
          </span>
          <div className="flex w-full">
            <span className="flex flex-col basis-2/6">
              <h5 className="text-lg tracking-tight">PERSONAL INFO</h5>
              <h5 className="text-lg font-bold tracking-tight ">
                {userAuth?.firstname+ ' ' +userAuth?.lastname}
              </h5>
            </span>
            <span className="flex flex-col basis-2/6">
              <h5 className="text-lg tracking-tight">EMAIL</h5>
              <h5 className="text-lg font-bold tracking-tight ">
                {userAuth?.email}
              </h5>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
