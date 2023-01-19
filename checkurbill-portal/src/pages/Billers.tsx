import React from "react";
import ElectricUtilities from "../assets/tower.png";
import Spinner from "../components/Spinner";
import { useFetchBillerCategoriesQuery } from "../services/merchant-service";
import { useNavigate } from 'react-router-dom';
type BillersProps = {};

const Billers = (props: BillersProps) => {
  const { data: categories, isLoading } = useFetchBillerCategoriesQuery();
  const navigate = useNavigate();
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="flex h-auto pt-8">
      <div className="flex flex-col container mx-auto lg:mx-[100px] xl:mx-[150px]">
        <div className="flex w-full justify-center items-center">
          <h1 className="text-3xl font-mono md:text-6xl">Biller Categories</h1>
        </div>
        <br />
        <br />
        <br />
        <hr></hr>
        <br />
        <div className="flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-2 lg:gap-4">
            {/* biller Card */}
            {categories?.data?.map((category, index) => {
              return (
                <div
                  key={index}
                  onClick={() => navigate(`/biller/${category?.merchant_category_name}`)}
                  className="w-[300px] lg:w-[270px] xl:w-[280px] mx-auto cursor-pointer hover:scale-x-[105%] hover:shadow-lg 
          bg-white border border-gray-200 rounded-lg shadow-md 
          dark:bg-gray-800 dark:border-gray-700 p-4"
                >
                  <span className="w-full text-center">
                    <img
                      className="rounded-t-lg mx-auto h-32 w-42"
                      src={category?.icon}
                      alt=""
                    />
                  </span>
                  <div className="p-5">
                    <span className="flex w-full justify-center items-center">
                      <h5 className="mb-2 text-sm md:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {category?.merchant_category_name}
                      </h5>
                    </span>
                  </div>
                </div>
              );
            })}

            {/* biller Card */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billers;
