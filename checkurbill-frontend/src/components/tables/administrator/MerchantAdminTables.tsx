import React from "react";
import { MerchantAdminInterface } from "../../../services/merchant-service";
import { useAppSelector } from "../../../feature/store";
import { have } from "../../../helpers/can";
import { useResendActivationMutation } from "../../../services/auth-service";
import { toast } from "react-toastify";
import Spinner from "../../modals/Spinner";
import { useActivateAdminUserMutation, useDeActivateAdminUserMutation } from "../../../services/administrator-service";
import { useSearchParams } from "react-router-dom";
import { ErrorHandling } from "../../../helpers/errorHandling";

type MerchantAdminTablesProps = {
  datas: MerchantAdminInterface[] | null;
};

const MerchantAdminTables = (props: MerchantAdminTablesProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [resendActivation, { isLoading: resendMailLoading }] =
    useResendActivationMutation();
    const [deActivateAdminUser, {isLoading: deActivateAccountLoading}] = useDeActivateAdminUserMutation();
    const [activateAdminUser, {isLoading: activatingAccountLoading}] = useActivateAdminUserMutation();
    const [getPage, setPage] = useSearchParams();

  const handleResenEmail = async (email: string): Promise<void> => {
    try {
      await resendActivation({ email }).unwrap();
      toast.success("Email Re-send Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleDeactivatingAdmin = async (user_id: string, email: string) => {
    if(!window.confirm("Are you sure to deactivate this account.")) {
      return false;
    }
    try {
      let response = await deActivateAdminUser({user_id, email}).unwrap();
      window.location.reload();
      toast.success(response?.message || 'Request Success');
      
      // getPage.delete('page');
      // setPage(getPage);
      // setPage({page: String(1)});
    } catch (error: any) {
      ErrorHandling(error);
    }
  }

  const handleActivatingAdmin = async (user_id: string, email: string) => {
    if(!window.confirm("Are you sure to activate this account.")) {
      return false;
    }
    try {
      let response = await activateAdminUser({user_id, email}).unwrap();
      window.location.reload();
      toast.success(response?.message || 'Request Success');
      // getPage.delete('page');
      // setPage(getPage);
      // setPage({page: String(1)});
    } catch (error: any) {
      ErrorHandling(error);
    }
  }


  if (resendMailLoading || deActivateAccountLoading || activatingAccountLoading) {
    return <Spinner />;
  }

  return (
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="py-3 px-6">
            Full Name
          </th>
          <th scope="col" className="py-3 px-6">
            Role's
          </th>
          <th scope="col" className="py-3 px-6">
            Permission's
          </th>
          <th scope="col" className="py-3 px-6">
            Status
          </th>
          <th scope="col" className="py-3 px-6">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {props.datas?.map((data, index) => {
          return (
            <tr className="bg-white w-full border-b dark:bg-gray-900 dark:border-gray-700" key={index}>
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {data?.firstname + " " + data?.lastname}
              </th>
              <td className="py-4 px-6">{data?.roles[0].name}</td>
              <td className="py-4 px-6">{data?.permissions[0].name}</td>
              <td className="py-4 px-6">{data?.status}</td>
              <td className="py-4 px-6">
                {have(userAuth?.permissions!, ["admin", "authorizer"]) ? (
                  data?.status === "Activated" ? (
                    data?.permissions[0].name === "admin" ?
                    <button
                      type="button" onClick={() => handleDeactivatingAdmin(data?.id, data?.email)}
                      className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none 
                    focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                mr-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                    >
                      DeActivate
                    </button> : null
                  ) : data?.status === "Deactivated" ? (
                    data?.permissions[0].name === "admin" ?
                    <button
                      type="button" onClick={() => handleActivatingAdmin(data?.id, data?.email)}
                      className="text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 
                focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 
                dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                    >
                      Activate
                    </button> : null
                  ) : data?.permissions[0].name === "admin" ? (
                    <button
                      type="button"
                      onClick={() => handleResenEmail(data?.email)}
                      className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 
                    focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80
                     font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Resend Email Verification
                    </button>
                  ) : null
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MerchantAdminTables;
