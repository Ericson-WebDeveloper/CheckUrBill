import React from "react";
import { useAppSelector } from "../../../feature/store";
import { have } from "../../../helpers/can";
import { Member } from "../../../models/Members";
import { useRemoveMemberMutation, useUpdatingMemberMutation } from "../../../services/merchant-service";
import { toast } from "react-toastify";
import Spinner from "../../modals/Spinner";
import { ErrorHandling } from "../../../helpers/errorHandling";
import { useNavigate } from "react-router-dom";

type MembersTableProps = {
  datas: null | Member[];
};

const MembersTable = (props: MembersTableProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [removeMember, { isLoading }] = useRemoveMemberMutation();
  const [updatingMember, {isLoading: updatingLoading}] = useUpdatingMemberMutation();
  const navigate = useNavigate();

  const handleRemove = async (email: string) => {
    if (!window.confirm("Are you sure to remove this member?")) {
      return false;
    }
    try {
      await removeMember({ email }).unwrap();
    } catch (error: any) {
      ErrorHandling(error);
    }
  };

  const handlingStatusUpdate = async(member: number, account_no: string, status: string) => {
    if (!window.confirm("Are you sure to update status of this member?")) {
      return false;
    }
    try {
      await updatingMember({member, account_no, status}).unwrap();
      toast.success('Update Request Success');
    } catch (error: any) {
      ErrorHandling(error);
    }
  } 

  if (isLoading || updatingLoading) {
    return <Spinner />;
  }

  return (
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
            Account
          </th>
          <th scope="col" className="py-3 px-6">
            Status
          </th>
          {have(userAuth?.permissions!, ["admin", "authorizer"]) ? (
            <th scope="col" className="py-3 px-6">
              Action
            </th>
          ) : null}
        </tr>
      </thead>
      <tbody>
        {props.datas?.map((member, index) => {
          return (
            <tr
              className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
              key={index}
            >
              <th
                scope="row"
                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {member?.first_name + " " + member?.last_name}
              </th>
              <td className="py-4 px-6">{member?.email}</td>
              <td className="py-4 px-6">{member?.account_no}</td>
              <td className="py-4 px-6">{member?.status}</td>
              {have(userAuth?.permissions!, ["admin", "authorizer"]) ? (
                <td className="py-4 px-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/app/merchant/members/${member?.email}`)}
                    className="text-white bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 hover:bg-gradient-to-br focus:ring-4 
                    focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg 
                    dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(member?.email)}
                    className="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 
                    focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-lg shadow-red-500/50 dark:shadow-lg 
                    dark:shadow-red-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    Deleted
                  </button>
                  {member?.status === "active" ? (
                    <button
                      type="button"
                      onClick={() => handlingStatusUpdate(member?.id, member?.account_no as string, 'warning')}
                      className="text-white bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 hover:bg-gradient-to-br 
                  focus:ring-4 focus:outline-none focus:ring-orange-300 dark:focus:ring-orange-800 shadow-lg shadow-orange-500/50 
                  dark:shadow-lg dark:shadow-orange-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Warning Status
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handlingStatusUpdate(member?.id, member?.account_no as string, 'active')}
                      className="text-white bg-gradient-to-r from-green-400 via-green-500 to-green-600 hover:bg-gradient-to-br focus:ring-4 
                    focus:outline-none focus:ring-green-300 dark:focus:ring-green-800 shadow-lg shadow-green-500/50 dark:shadow-lg dark:shadow-green-800/80 
                    font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      Active Status
                    </button>
                  )}
                </td>
              ) : null}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default MembersTable;
