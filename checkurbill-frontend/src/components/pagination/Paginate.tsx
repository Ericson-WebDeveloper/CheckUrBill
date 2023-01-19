import React from "react";
import { useSearchParams } from "react-router-dom";

type Props = {
  currentPage: number;
  next_page_url: string | null;
  prev_page_url: string | null;
};

const Paginate = (props: Props) => {
    const [getPage, setPage] = useSearchParams();

    const handlePageNumber = (page: string) => {
      if (getPage.get("search") && getPage.get("search") !== null) {
        setPage({ search: getPage.get("search")!, page });
      } else {
        setPage({ page });
      }
    }
  return (
    <nav aria-label="Page navigation example">
      <ul className="inline-flex -space-x-px">
        {props.prev_page_url ? (
          <li onClick={() => handlePageNumber(String(props.currentPage - 1))}>
            <span className="cursor-pointer px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 
            hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Previous
            </span>
          </li>
        ) : null} 

        <li>
          <span
            aria-current="page"
            className="px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
          >
            {props.currentPage}
          </span>
        </li>

        {props.next_page_url ? (
          <li onClick={() => handlePageNumber(String(props.currentPage + 1))}>
            <span className="cursor-pointer px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              Next
            </span>
          </li>
        ) : (
          <li className="opacity-0">
            <span className="px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"></span>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Paginate;
