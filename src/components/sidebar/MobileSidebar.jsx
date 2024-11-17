import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDragon, faTimes, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const MobileSidebar = ({ isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  return (
    <>
      {/* Overlay and Sidebar */}
      <div className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
      
      <div 
        className={`sidebar fixed top-0 left-0 h-full w-1/2 border-r dark:border-opacity-25 dark:border-gray-300 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 lg:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 dark:border-transparent">
          <h1 className="font-medium flex gap-3 items-center">
            <FontAwesomeIcon icon={faDragon} className="text-2xl text-red-500" />
            <span>Dashboard</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex flex-col space-y-2 px-4">
          {[
            { path: "/", label: "Overview" },
            { path: "/appointments", label: "Appointments" },
            { path: "/patients", label: "Patients" },
            { path: "/schedule", label: "Schedule" },
            { path: "/team", label: "Team" },
            { path: "/services", label: "Services" },
            { path: "/messages", label: "Messages" },
            { path: "/clinic-settings", label: "Settings" },
          ].map(({ path, label }) => (
            <Link 
              to={path} 
              key={label} 
              onClick={toggleSidebar} 
              className="p-3 flex items-center text-sm rounded"
            >
              <FontAwesomeIcon icon={faBook} className="mr-3 text-[#99A1B7]" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Dark Mode Toggle */}
        <div className="absolute bottom-0 w-full px-7 pb-6">
          <button onClick={toggleDarkMode} className="flex items-center text-sm">
            <FontAwesomeIcon icon={!isDarkMode ? faMoon : faSun} className="mr-3 text-[#99A1B7]" />
            <span>{!isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
      </div>
    </>
  );
};
export default MobileSidebar;
