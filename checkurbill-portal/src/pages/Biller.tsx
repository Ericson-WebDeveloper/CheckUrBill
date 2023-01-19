import React from "react";
import { useFetchBillersCategoriesQuery } from "../services/merchant-service";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";

type BillerProps = {};

const Biller = (props: BillerProps) => {
  const { category } = useParams();
  const { data: billers, isLoading } = useFetchBillersCategoriesQuery(
    category || ""
  );

  if (isLoading) {
    return <Spinner />;
  }
  return (
    <div className="flex h-auto pt-8">
      <div className="flex flex-col container mx-auto lg:mx-[100px] xl:mx-[150px]">
        <div className="flex w-full justify-center items-center">
          <h1 className="text-3xl font-mono md:text-6xl">{category}</h1>
        </div>
        <br />
        <br />
        <br />
        <hr></hr>
        <br />
        <div className="flex flex-col w-full">
          {billers && billers?.data?.length! > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-2 lg:gap-4">
              {/* biller Card */}
              {billers?.data?.map((biller, index) => {
                return (
                  <div
                    key={index}
                    className="w-[300px] lg:w-[270px] xl:w-[280px] mx-auto cursor-pointer hover:scale-x-[105%] hover:shadow-lg 
          bg-white border border-gray-200 rounded-lg shadow-md 
          dark:bg-gray-800 dark:border-gray-700 p-4"
                  >
                    <span className="w-full text-center">
                      <img
                        className="rounded-t-lg mx-auto h-32 w-42"
                        alt=""
                        src={biller?.detail_logo}
                      />
                    </span>
                    <div className="p-5">
                      <span className="flex w-full justify-center items-center">
                        <h5 className="mb-2 text-sm md:text-xl lg:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                          {biller?.merchant_name}
                        </h5>
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* biller Card */}
            </div>
          ) : (
            <h1 className="text-3xl font-serif text-center mx-5 mb-56">
              Please bear with us as we continue to improve our system to bring
              you better experience and deliver satisfaction!
            </h1>
          )}
        </div>
      </div>
    </div>
  );
};

export default Biller;
