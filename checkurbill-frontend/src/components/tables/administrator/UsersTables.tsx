import React from "react";
import UpgradeIcon from "@mui/icons-material/Upgrade";
import {
  useResendActivationMutation,
  UserSignInResponse,
} from "../../../services/auth-service";
import moment from "moment";
import { have } from "../../../helpers/can";
import { useAppSelector } from "../../../feature/store";
import Spinner from "../../modals/Spinner";
import { toast } from "react-toastify";
import {
  useActivateAdminUserMutation,
  useDeActivateAdminUserMutation,
  useDeleteAdminUserMutation,
} from "../../../services/administrator-service";
import { useSearchParams } from "react-router-dom";
import { ErrorHandling } from "../../../helpers/errorHandling";

type Props = {
  type: string | undefined;
  datas: [] | UserSignInResponse[] | null;
};

const UsersTables = (props: Props) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [resendActivation, { isLoading }] = useResendActivationMutation();
  const [deleteAdminUser, { isLoading: deleteAdminLoading }] =
    useDeleteAdminUserMutation();
  const [deActivateAdminUser, { isLoading: deActivateAccountLoading }] =
    useDeActivateAdminUserMutation();
  const [activateAdminUser, { isLoading: activatingAccountLoading }] =
    useActivateAdminUserMutation();
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
    if (!window.confirm("Are you sure to deactivate this account.")) {
      return false;
    }
    try {
      let response = await deActivateAdminUser({ user_id, email }).unwrap();
      toast.success(response?.message || "Request Success");
      setPage({ page: String(1) });
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleActivatingAdmin = async (user_id: string, email: string) => {
    if (!window.confirm("Are you sure to activate this account.")) {
      return false;
    }
    try {
      let response = await activateAdminUser({ user_id, email }).unwrap();
      toast.success(response?.message || "Request Success");
      setPage({ page: String(1) });
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handleDeletingAdmin = async (user_id: string, email: string) => {
    if (!window.confirm("Are you sure to delete this.")) {
      return false;
    }
    try {
      let response = await deleteAdminUser({ user_id, email }).unwrap();
      toast.success(response?.message || "Request Success");
      setPage({ page: String(1) });
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  if (
    isLoading ||
    deleteAdminLoading ||
    deActivateAccountLoading ||
    activatingAccountLoading
  ) {
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
              Roles
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Date Created
            </th>
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {props?.datas?.map((data, index) => {
            return (
              <tr
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={index}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {`${data?.user?.firstname} ${data?.user?.lastname}`}
                </th>
                <td className="py-4 px-6">{data?.user?.email}</td>
                <td className="py-4 px-6">{props.type}</td>
                <td className="py-4 px-6">{data?.user?.status}</td>
                <td className="py-4 px-6">
                  {moment(data?.user?.created_at).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                </td>
                <td className="py-4 px-6 flex">
                  {have(userAuth?.permissions!, ["admin"]) ? (
                    <button
                      type="button"
                      onClick={() =>
                        handleDeletingAdmin(data?.user?.id, data?.user?.email)
                      }
                      className="justify-center items-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 
                          hover:bg-gradient-to-br focus:ring-4 
                  focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg 
                  dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 flex"
                    >
                      Delete
                    </button>
                  ) : null}

                  {have(userAuth?.permissions!, ["admin"]) ? (
                    data?.user?.status === "Activated" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleDeactivatingAdmin(
                            data?.user?.id,
                            data?.user?.email
                          )
                        }
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Deactivate
                      </button>
                    ) : null
                  ) : null}

                  {have(userAuth?.permissions!, ["admin"]) ? (
                    data?.user?.status === "Not Activated" ? (
                      <button
                        type="button"
                        onClick={() => handleResenEmail(data?.user?.email!)}
                        className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Resend Email Verification
                      </button>
                    ) : null
                  ) : null}

                  {have(userAuth?.permissions!, ["admin"]) ? (
                    data?.user?.status !== "Not Activated" &&
                    data?.user?.status !== "Activated" ? (
                      <button
                        type="button"
                        onClick={() =>
                          handleActivatingAdmin(
                            data?.user?.id,
                            data?.user?.email
                          )
                        }
                        className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br
                         focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 
                         dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                      >
                        Activate
                      </button>
                    ) : null
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

export default UsersTables;
