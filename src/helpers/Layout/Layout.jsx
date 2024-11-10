import { Outlet } from "react-router-dom"; 
import React from 'react';
import Sidebar from "../../components/Sidebar";

const Layout = () => {
  return (
    <div className="grid grid-cols-[auto_1fr]"> {/* Sidebar adjusts automatically */}
      <div className=""><Sidebar /></div>
      <div className="w-full"><Outlet /></div>
    </div>
  );
};

export default Layout;
