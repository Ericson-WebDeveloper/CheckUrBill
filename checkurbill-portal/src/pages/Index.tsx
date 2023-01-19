import React from "react";
import Bill from "../assets/bill.png";
import Pay from "../assets/pay.png";
import EasyUse from "../assets/easy-use.png";
type IndexProps = {};

const Index = (props: IndexProps) => {
  return (
    <div className="flex flex-col space-y-12">
      <div className="jumbotron flex flex-col">
        <h1 className="text-4xl text-center font-semibold font-serif mt-24">
          Discover an exclusive way to pay your bills!
        </h1>
        <p className="text-lg text-center font-serif">
          Settle your payment right on the tip of your fingers and receive
          detailed billing online!
        </p>
        <br />
        <div className="text-center">
          <button
            type="button"
            className="text-white w-30 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 
            focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 
            mb-2"
          >
            Check Billers
          </button>
        </div>
      </div>
      <div className="process flex justify-center mt-20 space-x-32">
        <div className="flex flex-col text-center space-y-2">
          <img src={Bill} className="w-24 h-20 mx-auto" alt="" />
          <h1 className="text-3xl font-semibold font-serif">
            Bills and Payments
          </h1>
          <p className="tex">Check and Pay your bills anytime,</p>
          <p>anywhere using CheckurBills.</p>
        </div>
        <div className="flex flex-col text-center space-y-2">
          <img src={Pay} className="w-24 h-20 mx-auto" alt="" />
          <h1 className="text-3xl font-semibold font-serif">
            Cashless Transaction
          </h1>
          <p className="tex">Safe and Fast transaction to Pay your Bills at </p>
          <p>the comfort on your home.</p>
        </div>
        <div className="flex flex-col text-center space-y-2">
          <img src={EasyUse} className="w-24 h-20 mx-auto" alt="" />
          <h1 className="text-3xl font-semibold font-serif">Easy to Use</h1>
          <p className="tex">3 easy steps to settle your payment: Choose</p>
          <p>your Biller, Complete the form, and Process the</p>
          <p>Payment.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
