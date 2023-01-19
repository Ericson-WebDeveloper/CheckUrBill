import moment from "moment";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";
import {
  BiilAccount,
  useFetchBillsMerchantMutation,
  useGetAccountsQuery,
} from "../../services/account-service";

type BillHistoryProps = {};

const BillHistory = (props: BillHistoryProps) => {
  const [filterMerchant, setFilterMerchant] = useState<string>("");
  const { data: accounts, isLoading: accountLoading } = useGetAccountsQuery();
  const [fetchBillsMerchant, { isLoading: billLoading }] =
    useFetchBillsMerchantMutation();
  const [bills, setBills] = useState<null | BiilAccount[]>(null);
  const filterBillMerchant = async (merchant_ref: string) => {
    let identifiers = merchant_ref.split("/");
    // let account = accounts?.data?.find(
    //   (account) => account.merchant_ref === identifiers[0]
    // );
    // if (!account) {
    //   return;
    // }
    if (!identifiers[0] || !identifiers[1]) {
      return;
    }
    try {
      let dataform = {
        merchant_ref: identifiers[0], // account?.merchant_ref!,
        account_no: identifiers[1] // account?.account_no as string,
      };
      let { data } = await fetchBillsMerchant(dataform).unwrap();
      setBills(data || null);
    } catch (error: any) {
      toast.error("Data Not Found");
      setBills(null);
    }
  };

  if (accountLoading || billLoading) {
    return (
      <div className="container mx-auto">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col space-y-3">
        <form action="">
          {/* <label
            htmlFor="countries"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Select an option
          </label> */}
          <select
            id="countries"
            onChange={(e) => filterBillMerchant(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 
            focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 
            dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          >
            <option value="">Filter by Merchant</option>
            {accounts?.data?.map((account, index) => {
              return (
                <option key={index} value={account?.merchant_ref+"/"+account?.account_no}>
                  {account?.merchant_name+" - "+account?.account_no}
                </option>
              );
            })}
          </select>
        </form>
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase dark:text-gray-400">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Transaction Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Bill From - To
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 bg-gray-50 dark:bg-gray-800"
                >
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {bills?.map((bill, index) => {
                return (
                  <tr
                    className="border-b border-gray-200 dark:border-gray-700"
                    key={index}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800"
                    >
                      {bill?.["Transaction Type"]}
                    </th>
                    <td className="px-6 py-4">{moment(bill?.["Bill From"]).format('MMMM Do YYYY')+' '+moment(bill?.["Bill To"]).format('MMMM Do YYYY')}</td>
                    <td className="px-6 py-4 bg-gray-50 dark:bg-gray-800">
                      {
                      bill?.Status}
                    </td>
                    <td className="px-6 py-4">{bill?.Amount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillHistory;
