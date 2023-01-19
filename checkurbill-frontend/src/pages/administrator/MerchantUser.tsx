import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useMerchantAdminListQuery } from "../../services/merchant-service";
import Spinner from "../../components/modals/Spinner";
import MerchantAdminTables from "../../components/tables/administrator/MerchantAdminTables";
import Paginate from "../../components/pagination/Paginate";

type MerchantUserProps = {};

// use query parameter for identify merchant
const MerchantUser = (props: MerchantUserProps) => {
  const { merchant_code } = useParams();
  const [getPage, setPage] = useSearchParams();

  const {data: adminMerchants, isLoading, isError, error} = useMerchantAdminListQuery({merchant_ref: merchant_code as string, 
    page: getPage.get('page') ||  null})

  if(isLoading) {
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
          Merchants User's List {merchant_code || ""}
          {/* <button
            onClick={() => setModalAddUser(true)}
            type="button"
            className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
          >
            Add new User Admin
          </button> */}
        </h1>
        {/* deactivated only admin & authorizer */}
        {/* uploader only see list */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg mb-8" >
          <MerchantAdminTables datas={adminMerchants?.data?.data || null} />
        </div>
        <div className="flex justify-end items-center mb-4">
          {adminMerchants && adminMerchants?.data?.data?.length! > 0 ? (
            <Paginate
              currentPage={adminMerchants?.data?.current_page!}
              prev_page_url={adminMerchants?.data?.prev_page_url!}
              next_page_url={adminMerchants?.data?.next_page_url!}
            />
          ) : null}
        </div>
        <div />
      </div>
    </motion.div>
  );
};

export default MerchantUser;
