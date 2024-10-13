import React from 'react';
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="h-screen w-56 bg-white shadow-md"> {/* Right-to-left alignment */}
      <div className="flex items-center justify-center h-20 border-b">
        <h1 className="text-2xl font-bold text-gray-700">Dashboard</h1>
      </div>
      <nav className="mt-10">
        <Link to="/" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Overview
        </Link>
        <Link to="/appointments" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Appointments
        </Link>
        <Link to="/Patients" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Patients
        </Link>
        <Link to="/Schedule" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Schedule
        </Link>
        <Link to="/messages" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Messages
        </Link>
        <Link to="/team" className="p-4 text-xl block text-gray-600 hover:bg-gray-100">
          Team
        </Link>
      </nav>
    </div>
  );
};

export default Navbar;
