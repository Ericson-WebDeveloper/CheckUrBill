import React from "react";
import { motion } from "framer-motion";
import { useBillListsQuery } from "../../services/merchant-uploading-service";
import Spinner from "../../components/modals/Spinner";
import BillTables from "../../components/tables/merchant/BillTables";
import Paginate from "../../components/pagination/Paginate";
import { useSearchParams } from "react-router-dom";

type BillsProps = {};

const Bills = (props: BillsProps) => {
  const [getPage] = useSearchParams();
  const { data: bills, isLoading } = useBillListsQuery(
    getPage.get("page") || null
  );

  // add bills table with id, merchant_ref, user_id, description, name of file, date created & updated
  // seperate un mismong mga bills coming from excel file na naupload
  // add bills_data -> id, bill_id, merchant_ref, user_id, the rest was depend from excel file uploaded

  if (isLoading) {
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
          Bills Uploaded List's
        </h1>
        {/* list */}
        {/* button approve, reject, delete only for authorizer */}
        {/* button view for all roles -> having a parameters identifier of bills batchno  */}
        {/* $count = $csv->countBillsBatch();
            $countBill = $count->count + 1;
            $date_uploaded = $users->currentDate();
            $batch_no = "BN" . date('Y') . date('m') . date('d') . $countBill;
         */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <BillTables datas={bills?.data?.data || null} />
        </div>
        <div className="flex justify-end items-center mt-6 mb-6">
          {bills && bills?.data?.data?.length! > 0 ? (
            <Paginate
              currentPage={bills?.data?.current_page!}
              prev_page_url={bills?.data?.prev_page_url || null}
              next_page_url={bills?.data?.next_page_url || null}
            />
          ) : null}
        </div>
        <div />
      </div>
      {/* view modal */}
    </motion.div>
  );
};

export default Bills;
