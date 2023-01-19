import React, { useState } from "react";
import { motion } from "framer-motion";
import { useFetchMembersQuery } from "../../services/merchant-service";
import Spinner from "../../components/modals/Spinner";
import MembersTable from "../../components/tables/merchant/MembersTable";
import { useSearchParams } from "react-router-dom";
import Paginate from "../../components/pagination/Paginate";
import AddMember from "../../components/modals/merchant/AddMember";
import { have } from "../../helpers/can";
import { useAppSelector } from "../../feature/store";
import SearchInput from "../../components/SearchInput";

type MembersProps = {};

const Members = (props: MembersProps) => {
  const [modalAddMember, setModalAddMember] = useState(false);
  const [getPage] = useSearchParams();
  const { data: members, isLoading } = useFetchMembersQuery({
    page: getPage.get("page") || null, search: getPage.get("search") || null
  });
  const { userAuth } = useAppSelector((state) => state.auth);

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
        <h1 className="text-4xl font-serif font-semibold space-x-2 justify-center items-center">
          Member's List
          {have(userAuth?.permissions!, ["uploader"]) ? (
            <button
              onClick={() => setModalAddMember(true)}
              type="button"
              className="ml-2 text-white bg-gradient-to-br from-purple-600 to-blue-500 
            hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 
            font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              Add new Member
            </button>
          ) : null}
        </h1>
        <br />
        {/* <span className=""> */}
          <SearchInput placeholder="Search Members Account No, Name & Email" />
        {/* </span> */}
            
        <br />
        {/* add status in database default Activate */}
        {/* Admin & Authorizer can deactivate members */}
        {/* view member data page, history payment & Total Payments in all Role */}
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <MembersTable datas={members?.data?.data || null} />
        </div>
        <div className="flex justify-end items-center mt-6 mb-6">
          {members && members?.data?.data?.length! > 0 ? (
            <Paginate
              currentPage={members?.data?.current_page!}
              prev_page_url={members?.data?.prev_page_url || null}
              next_page_url={members?.data?.next_page_url || null}
            />
          ) : null}
        </div>
        <div />
      </div>
      <AddMember
        modalAddMember={modalAddMember}
        setModalAddMember={setModalAddMember}
      />
      {/* view modal */}
    </motion.div>
  );
};

export default Members;
