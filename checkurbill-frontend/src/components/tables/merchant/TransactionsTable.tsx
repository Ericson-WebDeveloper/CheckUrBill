import moment from 'moment'
import React from 'react'
import { ITransaction } from '../../../models/Transaction'

type TransactionsTableProps = {
    datas: ITransaction[] | null
}

const TransactionsTable = (props: TransactionsTableProps) => {
  return (
    <>
    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">
              Transaction Type
            </th>
            <th scope="col" className="py-3 px-6">
              Account No
            </th>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Status
            </th>
            <th scope="col" className="py-3 px-6">
              Amount
            </th>
            <th scope="col" className="py-3 px-6">
              Trans Fee.
            </th>
            <th scope="col" className="py-3 px-6">
              Payment Ref#
            </th>
            <th scope="col" className="py-3 px-6">
              Trans Date
            </th>
            <th scope="col" className="py-3 px-6">
              Payment Date
            </th>
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
                    {bill?.['Account No']}
                    </td>
                <td className="py-4 px-6">
                  {bill?.Name}
                </td>
                <td className="py-4 px-6">
                {bill?.remarks}
                </td>
                <td className="py-4 px-6">
                  {bill?.amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className="py-4 px-6">
                  {bill?.transaction_fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td className="py-4 px-6">
                {bill?.payment_ref_no}
                </td>
                <td className="py-4 px-6">
                  {bill?.transaction_date ? moment(bill?.transaction_date).format("MMMM Do YYYY") : ''}
                </td>
                <td className="py-4 px-6">
                  {bill?.transaction_payment_date ? moment(bill?.transaction_payment_date).format("MMMM Do YYYY") : ''}
                </td>
              </tr>
            
          })} 
        </tbody>
      </table>
    </>
  )
}

export default TransactionsTable