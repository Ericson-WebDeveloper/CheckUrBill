import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MerchantList } from "../../../services/administrator-service";
import moment from "moment";
import { have } from "../../../helpers/can";
import { useAppSelector } from "../../../feature/store";

type Props = {
  datas: MerchantList[] | null;
  setFetchingMerchantAPI: (open: boolean, merchant_code?: string) => void;
  setModalEditInfo: (open: boolean, merchant_code?: string) => Promise<void>;
  setActivateMerchantModal: (open: boolean, merchant_code?: string) => Promise<void>;
  setCreateAdminMerchantModal: (open: boolean, merchant_code?: string) => Promise<void>;
};

const MerchantTable = (props: Props) => {
  const navigate = useNavigate();
  const { userAuth } = useAppSelector((state) => state.auth);
  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-6">
            Logo
          </th>
          <th scope="col" className="py-3 px-6">
            Company Name
          </th>
          <th scope="col" className="py-3 px-6">
            Authorizer
          </th>
          <th scope="col" className="py-3 px-6">
            Status
          </th>
          <th scope="col" className="py-3 px-6">
            On Board Date
          </th>
          <th scope="col" className="py-3 px-6">
            Action
          </th>
        </tr>
      </thead>

      <tbody>
        {props?.datas?.map((merchant, index) => {
          return (
            <tr
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              key={index}
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                <img
                  src={merchant?.detail_logo}
                  alt="Company Logo"
                  className="w-[70px] h-[70px]"
                />
              </th>
              <td className="py-4 px-6">{merchant?.merchant_name}</td>
              <td className="py-4 px-6"> </td>
              <td className="py-4 px-6">{merchant?.status}</td>
              <td className="py-4 px-6">
                {moment(merchant?.created_at).format('MMM Do YYYY, h:mm a')}
              </td>
              <td className="py-4 px-6 flex flex-col">
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/app/merchant-users/${merchant?.merchant_ref}`)
                  }
                  className=" text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 focus:ring-4 focus:outline-none 
        focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-purple-400 dark:text-purple-400 
        dark:hover:text-white dark:hover:bg-purple-500 dark:focus:ring-purple-900"
                >
                  User Lists
                </button>

                {/* authorizer only */}
                {merchant?.status === "Deactivated" ||
                merchant?.status === "Not Activated" ? (
                  have(userAuth?.permissions!, ["authorizer"]) ? (
                    <button
                      type="button" onClick={() => props.setActivateMerchantModal(true, merchant?.merchant_code)}
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 
                focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 
                dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                      Activate
                    </button>
                  ) : null
                ) : have(userAuth?.permissions!, ["authorizer"]) ? (
                  <>
                    <button
                    type="button" onClick={() => props.setActivateMerchantModal(true, merchant?.merchant_code)}
                    className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                  >
                    DeActivate
                  </button>
                  <button
                  type="button" onClick={() => props.setCreateAdminMerchantModal(true, merchant?.merchant_code)}
                  className="text-red-700 hover:text-white border border-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              mr-2 mb-2 dark:border-yellow-500 dark:text-yellow-500 dark:hover:text-white dark:hover:bg-yellow-600 dark:focus:ring-yellow-900"
                >
                  Create Admin
                </button>
                  </>
                ) : null}
                {/* administrator admin or authorizer */}
                {have(userAuth?.permissions!, ["authorizer", "admin"]) ? (
                  <>
                    <button
                      type="button" onClick={() => props.setModalEditInfo(true, merchant?.merchant_code)}
                      className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 
                dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600
                 dark:focus:ring-green-800"
                    >
                      Update Info
                    </button>
                    {/* administrator admin or authorizer */}
                    <button
                      type="button" onClick={() => props.setFetchingMerchantAPI(true, merchant?.merchant_code)}
                      className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 
                dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600
                 dark:focus:ring-green-800"
                    >
                      Update API URL & Schema
                    </button>
                  </>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MerchantTable;
