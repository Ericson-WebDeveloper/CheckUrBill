import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import StorefrontIcon from "@mui/icons-material/Storefront";
import GroupIcon from "@mui/icons-material/Group";
import { useAppSelector } from "../../feature/store";
import Diversity3Icon from "@mui/icons-material/Diversity3";
import PaidIcon from '@mui/icons-material/Paid';

type SideBarLinkProps = {
  // user: UserInterface | null;
  // dispatch: ThunkDispatch<any, undefined, AnyAction> & Dispatch<AnyAction>;
  // SET_PAGE: ActionCreatorWithPayload<string, string>;
  setCollapseShow: React.Dispatch<React.SetStateAction<string>>;
};

const SideBarLink = ({ setCollapseShow }: SideBarLinkProps) => {
  let activeStyle = {
    color: "blue",
    // backgroundColor: "#38445E"
  };
  const path = useLocation();
  const { userAuth } = useAppSelector((state) => state.auth);
  const roles = userAuth?.roles;
  const permissions = userAuth?.permissions;
  return roles && roles![0].name === "administrator" ? (
    <>
      <li
        className="flex items-center text-md md:text-lg font-serif p-2 text-slate-50 md:space-x-2 rounded-lg
    transform hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black"
      >
        <DashboardCustomizeIcon
          className={`${path.pathname === "/app" ? "text-[#1E20DF]" : ""}`}
        />
        <NavLink
          to="/app"
          style={({ isActive }) =>
            path.pathname === "/app" ? activeStyle : undefined
          }
          onClick={() => {
            setCollapseShow("hidden");
            // dispatch(SET_PAGE("DashBoard"));
          }}
          // className={`${"active" ? " text-blue-600" : ""}`}
        >
          Dashboard
        </NavLink>
      </li>
      <li
        className="flex items-center text-md md:text-lg font-serif p-2 text-slate-50 md:space-x-2 rounded-lg
    transform hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black"
      >
        <StorefrontIcon
          className={`${
            path.pathname === "/app/merchants" ? "text-[#1E20DF]" : ""
          }`}
        />
        <NavLink
          to="/app/merchants"
          style={({ isActive }) =>
            path.pathname === "/app/merchants" ? activeStyle : undefined
          }
          onClick={() => {
            setCollapseShow("hidden");
            // dispatch(SET_PAGE("DashBoard"));
          }}
          // className={`${"active" ? " text-blue-600" : ""}`}
        >
          Merchants
        </NavLink>
      </li>
      <li
        className={`flex flex-col space-y-2 text-md md:text-lg font-serif p-2 
         text-slate-50 md:space-x-2 rounded-lg cursor-pointer 
         `}
      >
        <span
          id="dropdownDividerButton"
          data-dropdown-toggle="dropdownDivider"
          className={`text-md ${
            path.pathname.match("/app/users") ? "text-[#1E20DF]" : ""
          } 
          md:text-lg focus:ring-4 focus:outline-none rounded-lg text-center inline-flex items-center 
          transform hover:translate-x-1 transition-transform ease-in duration-200 hover:p-2 hover:bg-slate-200 hover:text-black`}
          onClick={() => {
            document
              .querySelector(".usersdropdownDivider")
              ?.classList.toggle("hidden");
          }}
        >
          <GroupIcon className="mr-2" />
          Users
          <svg
            className="ml-2 w-4 h-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>{" "}
        {/* id="usersdropdownDivider" */}
        <div
          className="usersdropdownDivider hidden z-10 w-[190px] bg-white rounded-2xl divide-y divide-gray-100 shadow dark:bg-gray-700 
        dark:divide-gray-600"
        >
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`users/${"admin"}`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-2xl
                ${
                  path.pathname === "/app/users/admin"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Administrator
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`users/${"uploader"}`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-2xl
                ${
                  path.pathname === "/app/users/uploader"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Uploader
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`users/${"authorizer"}`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-2xl
                ${
                  path.pathname === "/app/users/authorizer"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Authorizer
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li
        className="flex flex-col space-y-2 text-md md:text-lg font-serif p-2 text-slate-50 md:space-x-2 rounded-lg transform 
      hover:translate-x-1 transition-transform ease-in duration-200 "
      >
        <span
          id="dropdownDividerButton"
          data-dropdown-toggle="dropdownDivider"
          className={`text-md ${
            path.pathname.match("/app/profile") ? "text-[#1E20DF]" : ""
          } 
          md:text-lg focus:ring-4 focus:outline-none rounded-lg text-center inline-flex items-center 
          cursor-pointer transform hover:translate-x-1 transition-transform ease-in duration-200 hover:p-2 hover:bg-slate-200 hover:text-black`}
          onClick={() => {
            document
              .querySelector(".profiledropdownDivider")
              ?.classList.toggle("hidden");
          }}
        >
          <GroupIcon className="mr-2" />
          Profile
          <svg
            className="ml-2 w-4 h-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>{" "}
        {/* id="usersdropdownDivider" */}
        <div
          className="profiledropdownDivider hidden z-10 w-[190px] bg-white divide-y divide-gray-100 shadow dark:bg-gray-700 
        dark:divide-gray-600 rounded-2xl"
        >
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`profile/change-info`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-2xl 
                ${
                  path.pathname === "/app/profile/change-info"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Update Info
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`profile/change-password`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white rounded-2xl 
                ${
                  path.pathname === "/app/profile/change-password"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Update Password
              </Link>
            </li>
          </ul>
        </div>
      </li>
    </>
  ) : roles && roles![0].name === "merchant" ? (
    <>
      <li
        className={`flex items-center text-md md:text-lg font-serif p-2 text-slate-50 md:space-x-2 rounded-lg
    transform hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black 
    ${path.pathname === "/app/merchant" ? "bg-[#38445E]" : ""}`}
      >
        <DashboardCustomizeIcon className="mr-2" />
        <NavLink
          to="/app/merchant"
          // style={({ isActive }) => (path.pathname === "/app/merchant" ? activeStyle : undefined)}
          onClick={() => {
            setCollapseShow("hidden");
            // dispatch(SET_PAGE("DashBoard"));
          }}
          // className={`${"active" ? " text-blue-600" : ""}`}
        >
          Dashboard
        </NavLink>
      </li>
      <li
        className={`flex items-center text-md md:text-lg font-serif p-2 text-slate-50 md:space-x-2 rounded-lg
    transform hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black 
    ${path.pathname === "/app/merchant/users" ? "bg-[#38445E]" : ""}`}
      >
        <GroupIcon className="mr-2" />
        <NavLink
          to="/app/merchant/users"
          // style={({ isActive }) => (path.pathname === "/app/merchant/users" ? activeStyle : undefined)}
          onClick={() => {
            setCollapseShow("hidden");
            // dispatch(SET_PAGE("DashBoard"));
          }}
          // className={`${"active" ? " text-blue-600" : ""}`}
        >
          Users
        </NavLink>
      </li>

      <li className={`flex flex-col space-y-2 `}>
      <div
          className={`text-md md:text-lg font-serif px-2 pt-2 pb-1 text-slate-50 md:space-x-2 rounded-lg transform 
      hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black ${
        path.pathname.match("/app/merchant/members") ? "bg-[#38445E]" : ""
      }`}
        ><span
          id="dropdownDividerButton"
          data-dropdown-toggle="dropdownDivider"
          className="text-md md:text-lg focus:ring-4 focus:outline-none rounded-lg text-center inline-flex items-center cursor-pointer"
          onClick={() => {
            document
              .querySelector(".membersdropdownDivider")
              ?.classList.toggle("hidden");
          }}
        >
          <Diversity3Icon className="mr-2" />
          Members
          <svg
            className="ml-2 w-4 h-4"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </span>{" "}
          </div>
        

        {/* id="usersdropdownDivider" */}
        <div
          className="membersdropdownDivider hidden ml-4 z-10 w-[190px] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 
        dark:divide-gray-600"
        >
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/members`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/members"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                List
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/member/upload-members`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/member/upload-members"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Upload Members
              </Link>
            </li>
          </ul>
        </div>
      </li>

      <li className={`flex flex-col space-y-2`}>
        <div
          className={`text-md md:text-lg font-serif px-2 pt-2 pb-1 text-slate-50 md:space-x-2 rounded-lg transform 
      hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black ${
        path.pathname.match("/app/merchant/bills") ? "bg-[#38445E]" : ""
      }`}
        >
          <span
            id="dropdownDividerButton"
            data-dropdown-toggle="dropdownDivider"
            className="text-md md:text-lg focus:ring-4 focus:outline-none rounded-lg text-center inline-flex items-center cursor-pointer"
            onClick={() => {
              document
                .querySelector(".billsdropdownDivider")
                ?.classList.toggle("hidden");
            }}
          >
            <PaidIcon className="mr-2" />
            Bills
            <svg
              className="ml-2 w-4 h-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </span>{" "}
        </div>
        {/* id="usersdropdownDivider" */}
        <div
          className="billsdropdownDivider hidden ml-4 z-10 w-[190px] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 
        dark:divide-gray-600"
        >
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/bills`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/bills"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                List
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/bill/upload-bills`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/member/upload-bills"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Upload Bills
              </Link>
            </li>
          </ul>
        </div>
      </li>

      <li className="flex flex-col space-y-2">
        <div
          className={` text-md md:text-lg font-serif px-2 pt-2 pb-1 text-slate-50 md:space-x-2 rounded-lg transform 
      hover:translate-x-1 transition-transform ease-in duration-200 hover:bg-slate-200 hover:text-black ${
        path.pathname.match("/app/merchant/profile") ? "bg-[#38445E]" : ""
      }`}
        >
          <span
            // id="dropdownDividerButton"
            // data-dropdown-toggle="dropdownDivider"
            className="text-md md:text-lg focus:ring-4 focus:outline-none rounded-lg text-center inline-flex items-center cursor-pointer"
            onClick={() => {
              document
                .querySelector(".merchantprofiledropdownDivider")
                ?.classList.toggle("hidden");
            }}
          >
            <GroupIcon className="mr-2" />
            Profile
            <svg
              className="ml-2 w-4 h-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              ></path>
            </svg>
          </span>{" "}
        </div>

        {/* id="usersdropdownDivider" */}
        <div
          className="merchantprofiledropdownDivider ml-4 hidden z-10 w-[190px] bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 
        dark:divide-gray-600"
        >
          <ul
            className="py-1 text-sm text-gray-700 dark:text-gray-200"
            aria-labelledby="dropdownDividerButton"
          >
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/profile/change-info`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/profile/change-info"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Update Info
              </Link>
            </li>
            <li>
              <Link
                onClick={() => setCollapseShow("hidden")}
                to={`/app/merchant/profile/change-password`}
                className={`block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white 
                ${
                  path.pathname === "/app/merchant/profile/change-password"
                    ? "dark:bg-gray-600 dark:text-white"
                    : ""
                }`}
              >
                Update Password
              </Link>
            </li>
          </ul>
        </div>
      </li>
    </>
  ) : null;
};

export default SideBarLink;
