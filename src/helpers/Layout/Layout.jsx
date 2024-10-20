import { Outlet } from "react-router-dom"; 
import React from 'react';
import Sidebar from "../../components/Sidebar";

const Layout = () => {

  return (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default Layout;
