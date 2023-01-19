// interface RouteObject {
//     path?: string;
//     index?: boolean;
//     children?: React.ReactNode;
//     caseSensitive?: boolean;
//     id?: string;
//     loader?: LoaderFunction;
//     action?: ActionFunction;
//     element?: React.ReactNode | null;
//     errorElement?: React.ReactNode | null;
//     handle?: RouteObject["handle"];
//     shouldRevalidate?: ShouldRevalidateFunction;
//   }
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
} from "react-router-dom";
import React, { Suspense } from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import App from "../App";
import ProtectedMiddleware from "../middleware/ProtectMiddleware";
import About from "../pages/About";
import DashBoard from "../pages/auth/DashBoard";
import Billers from "../pages/Billers";
import IndexPage from "../pages/Index";
import ErrorPage from "../pages/Layout/ErrorPage";
import Layout from "../pages/Layout/Layout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import UserMiddleware from "../middleware/UserMiddleware";
import Account from "../pages/auth/Account";
import UpdatePassword from "../pages/auth/UpdatePassword";
import AccountPage from "../pages/auth/AccountBill/AccountPage";
import PaypalRedirect from "../pages/auth/AccountBill/PaypalRedirect";
import Biller from "../pages/Biller";

// const App = React.lazy(() => import("../App"));
// const ProtectedMiddleware = React.lazy(
//   () => import("../middleware/ProtectMiddleware")
// );
// const About = React.lazy(() => import("../pages/About"));
// const DashBoard = React.lazy(() => import("../pages/auth/DashBoard"));
// const Billers = React.lazy(() => import("../pages/Billers"));
// const IndexPage = React.lazy(() => import("../pages/Index"));
// const ErrorPage = React.lazy(() => import("../pages/Layout/ErrorPage"));
// const Layout = React.lazy(() => import("../pages/Layout/Layout"));
// const Login = React.lazy(() => import("../pages/Login"));
// const Register = React.lazy(() => import("../pages/Register"));
// const UserMiddleware = React.lazy(() => import("../middleware/UserMiddleware"));
// const Account = React.lazy(() => import("../pages/auth/Account"));
// const UpdatePassword = React.lazy(() => import("../pages/auth/UpdatePassword"));
// const AccountPage = React.lazy(
//   () => import("../pages/auth/AccountBill/AccountPage")
// );
// export const router = createBrowserRouter(
//   createRoutesFromElements(
//     // <Routes>
//     //   <Route path="/" element={<App />} errorElement={<ErrorPage />}>
//     //     <Route index element={<IndexPage />} />
//     //     <Route path="/about" element={<About />} />
//     //     <Route path="/billers" element={<Billers />} />
//     //     <Route path="/singin" element={<Login />} />
//     //     <Route path="/signup" element={<Register />} />
//     //   </Route>
//       <Route
//         path="/app/auth"
//         element={
//           <ProtectedMiddleware>
//             <AuthMiddleware>
//               <Layout />
//             </AuthMiddleware>
//           </ProtectedMiddleware>
//         }
//         errorElement={<ErrorPage />}
//       >
//         <Route index element={<DashBoard />} />
//       </Route>
//     // </Routes>
//   )
// );

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        // path: "/app",
        index: true,
        element: <IndexPage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/billers",
        element: <Billers />,
      },
      {
        path: "/biller/:category",
        element: <Biller />,
      },
      {
        path: "/singin",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Register />,
      },
    ],
  },
  {
    path: "/app/auth",
    element: (
      <ProtectedMiddleware>
        <Layout />
      </ProtectedMiddleware>
    ),
    errorElement: <ErrorPage />,
    // loader: authHooks,
    children: [
      {
        index: true,
        element: (
          // <AuthMiddleware>
          //   <CheckUser>
          <UserMiddleware>
            <DashBoard />
          </UserMiddleware>
          //   </CheckUser>
          // </AuthMiddleware>
        ),
      },

      {
        path: "account",
        element: (
          <UserMiddleware>
            <Account />
          </UserMiddleware>
        ),
      },
      {
        path: "update/credentials",
        element: (
          <UserMiddleware>
            <UpdatePassword />
          </UserMiddleware>
        ),
      },
      {
        path: `enroll-account/:account_no/:ref`,
        element: (
          <UserMiddleware>
            <AccountPage />
          </UserMiddleware>
        ),
      },
      {
        path: `payment-paypal/redirect`,
        element: (
          <UserMiddleware>
            <PaypalRedirect />
          </UserMiddleware>
        ),
      },
    ],
  },
]);

// createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     children: [
//       {
//         path: "contact",
//         element: <Contact />,
//       },
//       {
//         path: "dashboard",
//         element: <Dashboard />,
//         loader: ({ request }) =>
//           fetch("/api/dashboard.json", {
//             signal: request.signal,
//           }),
//       },
//       {
//         element: <AuthLayout />,
//         children: [
//           {
//             path: "login",
//             element: <Login />,
//             loader: redirectIfUser,
//           },
//           {
//             path: "logout",
//             action: logoutUser,
//           },
//         ],
//       },
//     ],
//   },
// ]);
