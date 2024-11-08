import { Outlet } from "react-router-dom"; 
import React from 'react';
import Sidebar from "../../components/Sidebar";

const Layout = () => {

  return (
    <div className="flex">
      <div className="w-fit"><Sidebar /></div>
      <div className="w-full"><Outlet /></div>
    </div>
  );
};

export default Layout;
