import React from 'react'
import { Navbar } from 'flowbite-react';

type NavBarProps = {
  setCollapse: React.Dispatch<React.SetStateAction<boolean>>;
  collapse: boolean
}

const NavBar = ({setCollapse, collapse}: NavBarProps) => {
  return (
    <>
        <Navbar className='sticky top-0 z-50'>
            <Navbar.Brand href="/" className="flex items-center">
                <img src="https://flowbite.com/docs/images/logo.svg" className="mr-3 h-9" alt="Flowbite Logo" />
                    <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
                    CheckUrBill
                    </span>
            </Navbar.Brand>
            
            <button typeof='button' onClick={() => setCollapse(!collapse)} className="relative middle none font-sans font-medium text-center uppercase transition-all disabled:opacity-50 
            disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-blue-gray-500 
            hover:bg-blue-gray-500/10 active:bg-blue-gray-500/30 grid xl:hidden text-white" type="button" style={{ position: 'relative', overflow: 'hidden' }}>
              <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"><svg xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" strokeWidth="3" className="h-6 w-6 text-blue-gray-500">
                <path fillRule="evenodd" d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 
                01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z" 
                clipRule="evenodd"></path></svg></span>
            </button>
        </Navbar>
    </>
  )
}

export default NavBar