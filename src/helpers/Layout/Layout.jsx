import { Outlet } from "react-router-dom"; 
import React, { useState } from 'react';
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = (value) => {
    if (typeof value === "boolean") {
      setIsSidebarOpen(value);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };
  
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
        <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
        <Outlet />
      </div>
    </div>
    </>
  );
};

export default Layout;
