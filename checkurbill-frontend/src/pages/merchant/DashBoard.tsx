import React from "react";
import { motion } from "framer-motion";
import Chart from "../../components/Chart";
import { useGetMerchantDashBoardDataQuery } from "../../services/merchant-service";
import Spinner from "../../components/modals/Spinner";

type DashBoardProps = {};

const DashBoard = (props: DashBoardProps) => {
  const {data, isLoading} = useGetMerchantDashBoardDataQuery();

  if(isLoading) {
    return <Spinner />
  }

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="flex w-full max-h-fit"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 w-full">
        {/* <div className="justify-center items-center"> */}
        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full  ">
          <Chart
            datas={data?.data?.members || null}
            field={"name"}
            field2={"count_total"}
          />
        </div>
        <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full  ">
          <Chart
            datas={data?.data?.user_per_permissions || null}
            field={"permission"}
            field2={"count_total"}
          />
        </div>
        {/* <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full  ">
          <Chart
            datas={[{ name: "nanan", user_total: 1 }] || null}
            field={"name"}
            field2={"user_total"}
          />
        </div> */}
        {/* <div className="h-[300px] md:h-[400px] lg:h-[500px] w-full  ">
          <Chart
            datas={[{ name: "nanan", user_total: 1 }] || null}
            field={"name"}
            field2={"user_total"}
          />
        </div> */}
        {/* </div> */}
      </div>
      {/* <Spinner /> */}
    </motion.div>
  );
};

export default DashBoard;
