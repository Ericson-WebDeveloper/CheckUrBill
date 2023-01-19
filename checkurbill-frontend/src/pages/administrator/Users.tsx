import React, { useState } from "react";
import { useParams, useSearchParams } from 'react-router-dom';
import AddUser from "../../components/modals/administrator/AddUser";
import { motion } from "framer-motion";
import UsersTables from "../../components/tables/administrator/UsersTables";
import { usePermissionsQuery } from "../../services/role-permission-service";
import { Spinner } from "flowbite-react";
import { useAdminsUserListQuery } from "../../services/administrator-service";
import Paginate from "../../components/pagination/Paginate";
type UsersProps = {};

//  only for administrator admin role
const Users = (props: UsersProps) => {
  const { type } = useParams();
  const [getPage] = useSearchParams();
  const { data: permissions, isLoading } = usePermissionsQuery();
  const { data: administrators, isLoading: loadingAdminsUsers } =
    useAdminsUserListQuery({type: type as string, page: getPage.get('page')});
  const [modalAddUser, setModalAddUser] = useState<boolean>(false);

  if (isLoading || loadingAdminsUsers) {
    return <Spinner />;
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-[80vh]"
    >
      <div className="flex flex-col mb-14">
        <h1 className="text-4xl font-serif font-semibold space-x-2">
          User's List
          <button
            onClick={() => setModalAddUser(true)}
            type="button"
            className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Add new User Admin
          </button>
        </h1>
        {/* update, create, deactivated only admin */}
        {/* uploader & authorizer only see list */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          {/* add button for nto verified yet account a resend email verification */}
          <UsersTables type={type} datas={administrators?.data?.data ? administrators?.data?.data : null} />
        </div>
        <div className="flex justify-end items-center mt-6">
          {(administrators && administrators?.data?.data?.length! > 0) ? <Paginate currentPage={administrators?.data?.current_page!} 
          prev_page_url={administrators?.data?.prev_page_url} next_page_url={administrators?.data?.next_page_url}  /> : null}
        </div>
        <div />
      </div>
      <AddUser
        type={type}
        modalAddUser={modalAddUser}
        setModalAddUser={setModalAddUser}
        permissions={permissions}
      />
    </motion.div>
  );
};

export default Users;
