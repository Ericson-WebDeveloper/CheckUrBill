import React from "react";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Outlet } from "react-router-dom";
import 'flowbite';

function App() {
  return (
    <div className="h-screen w-full flex flex-col">
      <NavBar />
      <div className="h-auto w-full">
        <Outlet />
        <ToastContainer />
      </div>
      <br />
      <Footer />
    </div>
  );
}

export default App;
