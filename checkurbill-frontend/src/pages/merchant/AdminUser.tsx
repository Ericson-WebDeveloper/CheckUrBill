import React, { useState } from "react";
import { motion } from "framer-motion";
import AddAdministrator from "../../components/modals/merchant/AddAdministrator";
import AdminsTable from "../../components/tables/merchant/AdminsTable";
import { usePermissionsQuery } from "../../services/role-permission-service";
import Spinner from "../../components/modals/Spinner";
import { useAdminMerchantListsQuery } from "../../services/merchant-service";
import { useAppSelector } from '../../feature/store';
import { useSearchParams } from "react-router-dom";
import Paginate from "../../components/pagination/Paginate";

type AdminUserProps = {};

const AdminUser = (props: AdminUserProps) => {
  const [modalAdd, setModalAdd] = useState<boolean>(false);
  const {userAuth} = useAppSelector(state => state.auth);
  const [getPage] = useSearchParams();
  const { data: permissions, isLoading: fetchPermissionsLoading } = usePermissionsQuery();
  const {data: admins, isLoading: adminFetchingLoading} =  useAdminMerchantListsQuery({merchant_ref: userAuth?.info?.merchant_ref || '', page: getPage.get('page') || null})
  if(fetchPermissionsLoading || adminFetchingLoading) {
    return <Spinner />
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
          Admin User's List
          <button
            onClick={() => setModalAdd(true)}
            type="button"
            className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Add new Administrator
          </button>
        </h1>
        {/* update, create, deactivated only admin */}
        {/* uploader & authorizer only see list */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <AdminsTable datas={admins?.data?.data || null} />
        </div>
        <div className="flex justify-end items-center mt-6">
          {(admins && admins?.data?.data?.length! > 0) ? <Paginate currentPage={admins?.data?.current_page!} 
          prev_page_url={admins?.data?.prev_page_url || null} next_page_url={admins?.data?.next_page_url || null}  /> : null}
        </div>
        <div />
      </div>
      <AddAdministrator modalAdd={modalAdd} setModalAdd={setModalAdd} permissions={permissions?.data?.permissions || null} />
    </motion.div>
  );
};

export default AdminUser;
