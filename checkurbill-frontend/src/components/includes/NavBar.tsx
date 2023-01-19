import React from "react";
import { useNavigate } from "react-router-dom";
import { CLEAR_CREDENTIALS, RESET_STATE } from "../../feature/auth/auth";
import { useLogoutUserMutation } from "../../services/auth-service";
import { useAppDispatch, useAppSelector } from '../../feature/store';
import Spinner from "../modals/Spinner";

type NavBarProps = {
  setCollapseShow: React.Dispatch<React.SetStateAction<string>>;
};

const NavBar = ({ setCollapseShow }: NavBarProps) => {
  const dispatch = useAppDispatch();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const {userAuth} = useAppSelector(state => state.auth);
  let navigate = useNavigate();
  const signOutUser = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(RESET_STATE());
      navigate("/");
      window.location.reload();
    } catch (error) {
      navigate("/");
    } finally {
      dispatch(CLEAR_CREDENTIALS());
    }
  };

  if(isLoading) {
    return <Spinner />
  }
  return (
    <>
      <div className="fixed w-full bg-[#F9F4E5]">
        <div className="flex justify-between items-center md:justify-end p-4 md:mr-72 relative">
          <h1 className="hidden md:block mr-auto font-bold font-serif">
            {"Page Name"}
          </h1>
          <span
            className="ml-6 text-black block md:hidden cursor-pointer"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </span>
          <span className="flex items-center">
            <form action="" className="hidden md:block mr-4">
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search Page"
                className="p-2 w-[230px] rounded-3xl border-2 focus:w-[280px] border-gray-400 focus:border-none focus:outline-none"
              />
            </form>

            <div className="relative inline-block text-left z-0">
              <div>
                <img
                  src={userAuth?.info?.avatar || "https://via.placeholder.com/15"}
                  onClick={() =>
                    document
                      .getElementById("profileDrawer")
                      ?.classList.toggle("hidden")
                  }
                  className="w-[45px] h-[40px] rounded-full cursor-pointer"
                  alt=""
                />
              </div>

              <div
                id="profileDrawer"
                className="hidden origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 
                    ring-black ring-opacity-5 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
                tabIndex={-1}
              >
                <span
                  onClick={() => signOutUser()}
                  className="text-sm py-2 px-4 font-normal block w-full 
                    whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Sign Out
                </span>
                <span
                  className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 
                    hover:bg-gray-100 cursor-pointer"
                >
                  Profile
                </span>
                <span
                  className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700 hover:bg-gray-100 cursor-pointer"
                >
                  Setting
                </span>
              </div>
            </div>
          </span>
        </div>
      </div>
    </>
  );
};

export default NavBar;
