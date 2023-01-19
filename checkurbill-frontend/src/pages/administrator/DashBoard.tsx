import { Accordion, Button, Modal } from "flowbite-react";
import React, { useState } from "react";
import Chart from "../../components/Chart";
import { motion } from "framer-motion";
import Spinner from "../../components/modals/Spinner";
import { useGetDashBoardDataQuery, UserPerRoles, UserPerRolesPermissions } from "../../services/administrator-service";
import { MembersDashInteraface, MerchantUserPerPermissions } from "../../services/merchant-service";

type Props = {};

const DashBoard = (props: Props) => {
  const [openModal, SetOpenModal] = useState(false);
  const {data, isLoading} = useGetDashBoardDataQuery();
  if(isLoading) {
    return <Spinner />
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="flex w-full h-[80vh]"
    >
      <div className="flex flex-col lg:flex-row p-8 w-full items-center h-[500px]">
        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full lg:w-1/2 ">
          <Chart
            datas={data?.data?.user_per_roles || null}
            field={"name"}
            field2={"count_total"}
          />
        </div>
        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full lg:w-1/2 ">
          <Chart
            datas={data?.data?.user_per_roles_permissions || null}
            field={"role"}
            field2={"count_total"}
            field3={"permission"}
          />
        </div>
      </div>
      {/* <Spinner /> */}
    </motion.div>
  );
};

export default DashBoard;
