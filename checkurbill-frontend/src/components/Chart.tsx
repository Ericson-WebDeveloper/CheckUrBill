import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { UserPerRoles, UserPerRolesPermissions } from "../services/administrator-service";
import { MembersDashInteraface, MerchantUserPerPermissions } from "../services/merchant-service";

ChartJS.register(ArcElement, Tooltip, Legend);

interface users {
  name: string;
  user_total: number;
}

type ChartProps<T> = {
  datas: T[] | null;
  field: string;
  field2: string;
  field3?: string;
};

const Chart = <T extends UserPerRoles|UserPerRolesPermissions|MembersDashInteraface|MerchantUserPerPermissions>({ datas, field, field2, field3 }: ChartProps<T>) => {
  const key1 = field as string;
  const key2 = field2 as string;
  const key3 = field3 ? field3 as string : '';
  
  const data = {
    labels: datas?.map((data) => {
      if(field3) {
        return [`${data[key1 as keyof typeof data] + '/' +data[key3 as keyof typeof data]}`]
      }
       return data[key1 as keyof typeof data]
    }),
    datasets: [
      {
        label: "#",
        data: datas?.map((data) => data[key2 as keyof typeof data]),
        backgroundColor: [
          "rgb(192,80,78)",
          "rgb(109,120,173)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(81, 254, 53, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(254, 172, 53, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 65, 134, 0.2)",
          "rgba(253, 65, 255, 0.2)",
          "rgba(255, 99, 65, 0.2)",
          "rgba(233, 255, 65, 0.2)",
          "rgba(39, 245, 204, 0.2)",
        ],
        borderColor: [
          "rgb(192,80,78)",
          "rgb(109,120,173)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(81, 254, 53, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(254, 172, 53, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(255, 65, 134, 1)",
          "rgba(253, 65, 255, 1)",
          "rgba(255, 99, 65, 1)",
          "rgba(233, 255, 65, 1)",
          "rgba(39, 245, 204, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Doughnut
      data={data}
      width={50}
      height={50}
      options={{ maintainAspectRatio: false }}
    />
  );
};

export default Chart;
