import React from 'react'
import { BillCostumer } from '../../../models/Bill'
import moment from 'moment';

type BillCostumerTablesProps = {
  datas: BillCostumer[] | null;
}

const BillCostumerTables = (props: BillCostumerTablesProps) => {
  return (
    <>
     <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Transaction Type
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Account No
            </th>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Amount
            </th>
            <th scope="col" className="py-3 px-6">
              Bill Fromn - To
            </th>
            <th scope="col" className="py-3 px-6">
              Due Date
            </th>
            {/* delete button if have any issue. and make a new upload bill */}
            {/* or add column in db as deleted and dont sama sa normal fetching bills */}
            {/* <th scope="col" className="py-3 px-6">
              Action
            </th> */}
          </tr>
        </thead>
        <tbody>
          {props?.datas?.map((bill, index) => {
            return  <tr
                className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                key={index}
              >
                <th
                  scope="row"
                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {bill?.['Transaction Type']}
                </th>
                <td className="py-4 px-6">
                    {bill?.Status}
                    </td>
                <td className="py-4 px-6">
                  {bill?.['Account No']}
                </td>
                <td className="py-4 px-6">
                {bill?.['Name']}
                </td>
                <td className="py-4 px-6">
                  {bill?.Amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className="py-4 px-6">
                  {moment(bill?.['Bill From']).format("MMMM Do YYYY")+"-"+moment(bill?.['Bill To']).format("MMMM Do YYYY")}
                </td>
                <td className="py-4 px-6">
                  {moment(bill?.['Due Date']).format("MMMM Do YYYY")}
                </td>
              </tr>
            
          })} 
        </tbody>
      </table>
    </>
  )
}

export default BillCostumerTables