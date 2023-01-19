import React from "react";

type Props = {};

const Spinner = (props: Props) => {
  return (
    <div
      id="boardmerchantmodal"
      tabIndex={-1}
      aria-hidden="true"
      className={`overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 p-4 w-full 
      md:inset-0 h-modal md:h-full transition delay-150 duration-300 ease-in-out opacity-50`}
    >
      <div className="relative mx-auto w-full max-w-2xl h-full md:h-auto">
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow dark:bg-black">
          {/* <!-- Modal header --> */}
          <div className="flex justify-center items-center p-4 rounded-t border-b dark:border-gray-600">
            <h3 className="text-4xl font-semibold text-white ">
              Request Processing...
            </h3>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-6 space-y-6 text-center text-gray-400">
            {/* <svg
              aria-hidden="true"
              role="status"
              className="inline mr-3 w-4 h-4 text-white animate-spin"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="#E5E7EB"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentColor"
              />
            </svg> */}
            <svg
              version="1.1"
              id="L2"
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              viewBox="0 0 100 100"
              enableBackground="new 0 0 100 100"
            >
              <circle
                fill="none"
                stroke="#fff"
                strokeWidth="4"
                strokeMiterlimit="10"
                cx="50"
                cy="50"
                r="48"
              />
              <line
                fill="none"
                strokeLinecap="round"
                stroke="#fff"
                strokeWidth="4"
                strokeMiterlimit="10"
                x1="50"
                y1="50"
                x2="85"
                y2="50.5"
              >
                <animateTransform
                  attributeName="transform"
                  dur="2s"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </line>
              <line
                fill="none"
                strokeLinecap="round"
                stroke="#fff"
                strokeWidth="4"
                strokeMiterlimit="10"
                x1="50"
                y1="50"
                x2="49.5"
                y2="74"
              >
                <animateTransform
                  attributeName="transform"
                  dur="15s"
                  type="rotate"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </line>
            </svg>
            {/* Loading... */}
          </div>
          {/* <!-- Modal footer --> */}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
