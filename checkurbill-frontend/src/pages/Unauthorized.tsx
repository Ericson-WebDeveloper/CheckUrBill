import React from "react";
import { useNavigate } from "react-router-dom";
import "./unauthorized.css";

type UnauthorizedProps = {};

const Unauthorized = (props: UnauthorizedProps) => {
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-gradient-to-r from-purple-300 to-blue-200">
        <div className="w-9/12 m-auto py-16 min-h-screen flex items-center justify-center">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg pb-8">
            <div className="border-t border-gray-200 text-center pt-8">
              <h1 className="text-9xl font-bold text-purple-400">403</h1>
              <h1 className="text-6xl font-medium py-8">oops! Page not available</h1>
              <p className="text-2xl pb-8 px-12 font-medium">
                Oops! The page you are looking for was not accessible to you. It might you not have right authorization in page.
              </p>
              <button type="button" onClick={() => navigate(-1)} className="bg-gradient-to-r from-purple-400 to-blue-500 
              hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-6">
                BACK HOME
              </button>
              <button className="bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-500 text-white font-semibold px-6 py-3 rounded-md">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
