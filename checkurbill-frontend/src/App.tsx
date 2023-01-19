import React from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import SignIn from "./pages/SignIn";
import ForgetPass from "./pages/ForgetPass";
import "flowbite";
import Layout from "./pages/includes/Layout";
import DashBoard from "./pages/administrator/DashBoard";
import MerchantDashBoard from "./pages/merchant/DashBoard";
import Merchants from "./pages/administrator/Merchants";
import Users from "./pages/administrator/Users";
import MerchantUser from "./pages/administrator/MerchantUser";
import { AnimatePresence } from "framer-motion";
import Profile from "./pages/administrator/Profile";
import MerchantProfile from "./pages/administrator/Profile";
// import MerchantProfile from "./pages/merchant/Profile";
import ProfilePassword from "./pages/administrator/ProfilePassword";
import MerchantProfilePassword from "./pages/administrator/ProfilePassword";
// import MerchantProfilePassword from "./pages/merchant/ProfilePassword";

import AdminUser from "./pages/merchant/AdminUser";
import Members from "./pages/merchant/Members";
import MemberPage from "./pages/merchant/MemberPage";
import UploadBill from "./pages/merchant/Uploader/UploadBill";
import UploadMember from "./pages/merchant/Uploader/UploadMember";
import Bills from "./pages/merchant/Bills";
import Prefetch from "./middleware/Prefetch";
import Unauthorized from "./pages/Unauthorized";
import ProtectedMiddleware from "./middleware/ProtectedMiddleware";
import RoleMiddleware from "./middleware/RoleMiddleware";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConfirmAccount from "./pages/ConfirmAccount";
import PermissionMiddleware from "./middleware/PermissionMiddleware";
import Page404 from "./pages/Page404";
import BillLists from "./pages/merchant/BillLists";
import PasswordReset from './pages/PasswordReset';
import Transactions from "./pages/merchant/Transactions";
type LocationTypes = {
  pathname: string;
  state: any; //Here you can put your data type instead of any
  search: string;
  hash: string;
  key: string;
}

function App() {
  const location = useLocation();
  return (
    // overflow-y-scroll
    <div className="h-screen overflow-y-hidden scrollbar-hide overflow-x-hidden">
      <div className="flex flex-col w-full">
        <AnimatePresence>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<SignIn />} />
            <Route path="/forget-password" element={<ForgetPass />} />
            <Route path="/confirm-account/:code" element={<ConfirmAccount />} />
            <Route path="/reset-password/:code" element={<PasswordReset />} />
            <Route
              path="/application/user/unauthorized"
              element={<Unauthorized />}
            />
            {/* prefetch Authentication here before redirect to RequireAuth Pages */}

            <Route path="/app" element={<Layout />}>
              <Route element={<ProtectedMiddleware />}>
                <Route element={<Prefetch />}>
                  <Route
                    element={
                      <RoleMiddleware allowedRoles={["administrator"]} />
                    }
                  >
                    <Route index element={<DashBoard />} />
                    <Route path="merchants" element={<Merchants />} />
                    <Route
                      element={
                        <PermissionMiddleware allowedPermissions={["admin"]} />
                      }
                    >
                      <Route path="users/:type" element={<Users />} />
                    </Route>

                    <Route
                      path="merchant-users/:merchant_code"
                      element={<MerchantUser />}
                    />
                    <Route path="profile/change-info" element={<Profile />} />
                    <Route
                      path="profile/change-password"
                      element={<ProfilePassword />}
                    />
                  </Route>
                </Route>
              </Route>
            </Route>

            {/* magkaiba nag implementtation dito nun protect component */}
            {/* pansinin un ProtectedMiddleware at Prefetch nauna sila dito */}
            <Route element={<ProtectedMiddleware />}>
              <Route element={<Prefetch />}>
                <Route path="/app/merchant" element={<Layout />}>
                  <Route
                    element={<RoleMiddleware allowedRoles={["merchant"]} />}
                  >
                    <Route index element={<MerchantDashBoard />} />
                    <Route path="users" element={<AdminUser />} />
                    <Route path="members" element={<Members />} />
                    {/* Uploader only */}
                    <Route
                      element={
                        <PermissionMiddleware
                          allowedPermissions={["uploader"]}
                        />
                      }
                    >
                      <Route
                        path="member/upload-members"
                        element={<UploadMember />}
                      />
                      <Route
                        path="bill/upload-bills"
                        element={<UploadBill />}
                      />
                    </Route>
                    {/* end Uploader only */} 
                    
                    <Route path="members/:member_id" element={<MemberPage />} />                   
                    <Route path="bills" element={<Bills />} />
                    <Route path="bills/costumer/:ref" element={<BillLists />} />
                    <Route path="bills/costumer/transaction/:batch/:date" element={<Transactions />} />
                    <Route
                      path="profile/change-info"
                      element={<MerchantProfile />}
                    />
                    <Route
                      path="profile/change-password"
                      element={<MerchantProfilePassword />}
                    />
                  </Route>
                </Route>
              </Route>
            </Route>
            <Route path="/*" element={<Page404 />} />
          </Routes>
        </AnimatePresence>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;
