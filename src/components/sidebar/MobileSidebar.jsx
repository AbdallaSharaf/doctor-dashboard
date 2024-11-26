import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDragon, faTimes, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const MobileSidebar = ({ isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode }) => {
  return (
    <>
      {/* Overlay and Sidebar */}
      <div className={`fixed inset-0 z-10 bg-black transition-opacity duration-300 ${isSidebarOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`} onClick={toggleSidebar}></div>
      
      <div 
        className={`sidebar fixed bottom-0 left-0 w-full md:w-1/2 h-full z-50 transform ${
          isSidebarOpen
            ? 'translate-y-0 md:translate-x-0 opacity-100'
            : 'translate-y-full md:-translate-x-full md:translate-y-0 opacity-0'
        } transition-all duration-500 lg:hidden`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300 dark:border-transparent">
          <h1 className="font-medium flex gap-3 items-center">
            <FontAwesomeIcon icon={faDragon} className="text-2xl text-red-500" />
            <span>Dashboard</span>
          </h1>
        </div>

        {/* Navigation Links */}
        <nav className="mt-3 flex flex-col space-y-2 px-4 max-h-[75%] md:max-h-full overflow-y-auto text-lg scrollbar-hide ">
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
              onClick={() => toggleSidebar(false)} 
              className="p-3 flex items-center justify-center md:justify-start"
            >
              <FontAwesomeIcon icon={faBook} className="mr-3 md:block hidden text-[#99A1B7]" />
              <span>{label}</span>
            </Link>
          ))}
        {/* Dark Mode Toggle */}
        <div className="md w-full p-3 px-3 flex items-center justify-center md:justify-start ">
          <button onClick={toggleDarkMode} className="flex items-center">
            <FontAwesomeIcon icon={!isDarkMode ? faMoon : faSun} className="mr-3 md:block hidden text-[#99A1B7]" />
            <span>{!isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
          </button>
        </div>
        </nav>

      </div>
    </>
  );
};
export default MobileSidebar;
