import React from "react";
import {
  MerchantAdminInterface,
  useResendActivationMutation,
  useUserAdminActivationMutation,
  useUserAdminDeActivationMutation,
} from "../../../services/merchant-service";
import { UserSignInResponse } from "../../../services/personal-service";
import Spinner from "../../modals/Spinner";
import { toast } from "react-toastify";
import { useAppSelector } from "../../../feature/store";
import { have } from "../../../helpers/can";
import { ErrorHandling } from "../../../helpers/errorHandling";

type AdminsTableProps = {
  datas: [] | MerchantAdminInterface[] | null;
};

const AdminsTable = (props: AdminsTableProps) => {
  const [resendActivation, { isLoading: resendLoading }] =
    useResendActivationMutation();
  const [userAdminActivation, { isLoading: activateLoading }] =
    useUserAdminActivationMutation();
  const [userAdminDeActivation, { isLoading: deActivateLoading }] =
    useUserAdminDeActivationMutation();

  const { userAuth } = useAppSelector((state) => state.auth);
  const handleResenEmail = async (email: string) => {
    if (!window.confirm("Are you sure to re send an email!")) {
      return false;
    }
    try {
      await resendActivation({ email }).unwrap();
      toast.success("Email Re-send to User");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleActivationRequest = async (
    user_id: string,
    merchant_ref: string
  ) => {
    if (!window.confirm("Are you sure to activate this account!")) {
      return false;
    }
    try {
      await userAdminActivation({ user_id, merchant_ref }).unwrap();
      toast.success("Activating Account Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleDeActivationRequest = async (
    user_id: string,
    merchant_ref: string
  ) => {
    if (!window.confirm("Are you sure to deactivate this account!")) {
      return false;
    }
    try {
      await userAdminDeActivation({ user_id, merchant_ref }).unwrap();
      toast.success("Activating Account Success");
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  if (resendLoading || activateLoading || deActivateLoading) {
    return <Spinner />;
  }

  return (
    <>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Email
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Permission
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props.datas?.map((data, index) => {
            return (
              <tr
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={index}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <span className="flex space-x-2 items-center">
                    <img
                      src={data?.info?.avatar}
                      className="w-14 h-16"
                      alt=""
                    />
                    <span>{data?.firstname + " " + data?.lastname}</span>
                  </span>
                </th>
                <td className="py-4 px-6">{data?.email}</td>
                <td className="py-4 px-6">{data?.status}</td>
                <td className="py-4 px-6 items-center">
                  {data?.permissions
                    ?.map(function (p) {
                      return p.name;
                    })
                    .join(",")}
                </td>
                <td className="py-4 px-6 w-full flex flex-col lg:flex-row items-center mb-2">
                  {have(userAuth?.permissions!, ["admin"]) ? (
                    <>
                      {data?.status === "Not Activated" ? (
                        <button
                          type="button"
                          onClick={() => handleResenEmail(data?.email!)}
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Resend Email Verification
                        </button>
                      ) : data?.status === "Activated" ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleDeActivationRequest(
                              data?.id,
                              data?.info?.merchant_ref
                            )
                          }
                          className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            handleActivationRequest(
                              data?.id,
                              data?.info?.merchant_ref
                            )
                          }
                          className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br
                         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 
                         dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                        >
                          Activate
                        </button>
                      )}
                    </>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default AdminsTable;
