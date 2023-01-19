import moment from "moment";
import React from "react";
import { BillPayment } from "../../models/Bills";

type PaymentHistoryProps = {
  datas: BillPayment[] | null;
};

const PaymentHistory = (props: PaymentHistoryProps) => {
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Payment Ref#
            </th>
            <th scope="col" className="py-3 px-6">
              Remarks
            </th>
            <th scope="col" className="py-3 px-6">
              Amount
            </th>
            <th scope="col" className="py-3 px-6">
              Transaction Fee
            </th>
            <th scope="col" className="py-3 px-6">
              Payment Platform
            </th>
            <th scope="col" className="py-3 px-6">
              Payment Date
            </th>
            <th scope="col" className="py-3 px-6"></th>
          </tr>
        </thead>
        <tbody>
          {props?.datas?.map((payment, index) => {
            return (
              <tr
                key={index}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="py-4 px-6">#{payment?.payment_ref_no}</td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      payment?.remarks === "Success"
                        ? "bg-green-500"
                        : payment?.remarks === "Pending" ||
                          payment?.remarks === "In-Process"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    } mr-2`}></div>{" "}
                    <span className={`${
                      payment?.remarks === "Success"
                        ? "text-green-500"
                        : payment?.remarks === "Pending" ||
                          payment?.remarks === "In-Process"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}>{payment?.remarks}</span>
                  </div>
                </td>
                <td className="py-4 px-6">{payment?.amount}</td>
                <td className="py-4 px-6">{payment?.transaction_fee}</td>
                <td className="py-4 px-6">{payment?.payment_option}</td>
                <th scope="col" className="py-3 px-6">
                  <>
                    {moment(payment?.transaction_payment_date).format(
                      "MMMM Do YYYY h:mm:ss a"
                    )}
                  </>
                </th>
                <td className="py-4 px-6">
                  <span className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                    Edit user
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PaymentHistory;
