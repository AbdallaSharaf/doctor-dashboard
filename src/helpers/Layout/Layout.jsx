import { Outlet } from "react-router-dom"; 
import React, { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
    <div className="grid grid-cols-[auto_1fr]">
      {/* Navbar */}

      {/* Sidebar */}
      <div className="">
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      {/* Main Content */}
      <div className="w-full">
        <Navbar toggleSidebar={toggleSidebar}/>
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default Layout;
