import React from 'react';
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className=" min-w-[200px] min-h-screen bg-black shadow-md"> {/* Right-to-left alignment */}
      <div className="flex flex-col items-center p-4 h-20 border-b">
        <Link to="/" ><h1 className="text-2xl font-bold text-white">Dashboard</h1></Link>
      </div>
      <nav className="mt-10 flex flex-col ">
        <Link to="/" className="p-4   text-[#9a9cae] hover:text-white">
          Overview
        </Link>
        <Link to="/appointments" className="p-4   text-[#9a9cae] hover:text-white">
          Appointments
        </Link>
        <Link to="/Patients" className="p-4   text-[#9a9cae] hover:text-white">
          Patients
        </Link>
        <Link to="/Schedule" className="p-4   text-[#9a9cae] hover:text-white">
          Schedule
        </Link>
        <Link to="/messages" className="p-4   text-[#9a9cae] hover:text-white">
          Messages
        </Link>
        <Link to="/team" className="p-4   text-[#9a9cae] hover:text-white">
          Team
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;
