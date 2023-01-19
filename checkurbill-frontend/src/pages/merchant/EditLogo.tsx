import React from 'react'
import { motion } from "framer-motion";

type EditLogoProps = {}

const EditLogo = (props: EditLogoProps) => {
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: window.innerWidth, transition: { duration: 0.5 } }}
      className="w-full h-[80vh]"
    >
      {/* add in database upload data with id, ref_id, text, etc.... */}
      <div className="flex flex-col mb-14 space-y-4">
        <h1 className="text-4xl font-serif font-semibold">
          Upload New Company Logo
        </h1>
        {/* upload bill */}

        <form>
          <div className="relative z-0 mb-6 w-full group">
            <input
              type="text"
              id="remarks"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 
              border-gray-300 appearance-none 
              focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
             
            />
            <label
              htmlFor="floating_password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Remarks
            </label>
          </div>
         

          
          <div className="relative z-0 mb-6 w-full group">
            <label
              htmlFor="floating_repeat_password"
              className="peer-focus:font-medium text-sm text-gray-500 dark:text-gray-400 duration-300 transform 
              -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 
              peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              File
            </label>
            <input
              className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer 
              dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="user_avatar_help"
              id="bills"
              type="file"
              
            />
          </div>

          <button
            type="button" 
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Submit
          </button>
        </form>

        <div />
      </div>
      {/* view modal */}
    </motion.div>
  )
}

export default EditLogo