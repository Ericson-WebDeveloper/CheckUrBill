import React from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import {
  SET_START_LOADING,
  SET_STOP_LOADING,
} from "../../feature/global/globalSlice";
import { useAppSelector, useAppDispatch } from "../../feature/index";
import SignOutHooks from "../../hooks/SIgnOutHooks";
import { useLogoutUserMutation } from "../../services/auth-service";
import Spinner from "../Spinner";
type NavBarProps = {};

const NavBar = (props: NavBarProps) => {
  const { userAuth } = useAppSelector((state) => state.auth);
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { loadingGLobal } = useAppSelector((state) => state.global);
  const { handleSignOut } = SignOutHooks();
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      dispatch(SET_START_LOADING());
      await logoutUser();
      handleSignOut();
    } catch (error) {
      handleSignOut();
    } finally {
      dispatch(SET_STOP_LOADING());
    }
  };

  // if(isLoading) {
  //   return <Spinner />
  // }

  return (
    <>
      <nav className="fixed w-full px-2 py-4 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 border-2">
        <div className="container flex flex-wrap items-center justify-between">
          <a href="/app/auth" className="flex items-center">
            <img
              src={Logo}
              className="h-28 w-36 mr-3 ml-0 lg:ml-16"
              alt="CheckUrBills"
            />
            {/* <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
            Flowbite
          </span> */}
          </a>
          <button
            // data-collapse-toggle="navbar-multi-level"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 
          focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            // aria-controls="navbar-multi-level"
            aria-expanded="false"
            data-drawer-target="drawer-navigation"
            data-drawer-show="drawer-navigation"
            aria-controls="drawer-navigation"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 
              0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className="hidden w-full md:block md:w-auto"
            id="navbar-multi-level"
          >
            <ul className="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to={`/app/auth`}
                  className="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-white 
                dark:bg-blue-600 md:dark:bg-transparent"
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li>
                <button
                  id="dropdownNavbarLink"
                  data-dropdown-toggle="dropdownNavbar"
                  className="flex items-center justify-between w-full py-2 pl-3 pr-4 font-medium text-gray-700 border-b border-gray-100 hover:bg-gray-50 
                md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white 
                dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 
                  0 00-7-7z"
                    ></path>
                  </svg>
                  Hi {userAuth?.firstname || "--"}{" "}
                  <svg
                    className="w-4 h-4 ml-1"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </button>

                <div
                  id="dropdownNavbar"
                  className="z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-400"
                    aria-labelledby="dropdownLargeButton"
                  >
                    {/* <li>
                    <a
                      href="#"
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Dashboard
                    </a>
                  </li> */}
                    <li aria-labelledby="dropdownNavbarLink">
                      <button
                        id="doubleDropdownButton"
                        data-dropdown-toggle="doubleDropdown"
                        data-dropdown-placement="right-start"
                        type="button"
                        className="flex items-center justify-between w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        My Account
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          ></path>
                        </svg>
                      </button>
                      <div
                        id="doubleDropdown"
                        className="z-10 hidden bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700"
                      >
                        <ul
                          className="py-1 text-sm text-gray-700 dark:text-gray-200"
                          aria-labelledby="doubleDropdownButton"
                        >
                          <li>
                            <Link
                              to={`/app/auth/account`}
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                            >
                              Account Info
                            </Link>
                          </li>
                          <li>
                            <Link
                              to={`/app/auth/update/credentials`}
                              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                            >
                              Update Credentials
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                    {/* <li className="cursor-pointer">
                    <span
                      className="block px-4 py-2 hover:bg-gray-200 text-red-500"
                    >
                      Logout
                    </span>
                  </li> */}
                  </ul>
                  <div className="py-1">
                    <span
                      onClick={handleLogout}
                      className="block cursor-pointer px-4 py-2 text-sm hover:bg-gray-200 text-red-500"
                    >
                      Sign out
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
