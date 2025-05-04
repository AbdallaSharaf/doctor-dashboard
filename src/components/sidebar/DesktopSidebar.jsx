import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDragon, faArrowRight, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

const DesktopSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false)
  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark', !isDarkMode);
    setIsDarkMode(!isDarkMode)
  }
  return (
    <div className='group/width'>
    <div className={`${isCollapsed ? 'w-20 group-hover/width:w-64' : 'w-64 '} transition-all duration-300`}></div>
    <div
      className={`fixed min-h-screen sidebar group shadow-md transition-all duration-300
                  ${isCollapsed ? 'w-20 group-hover/width:w-64' : 'w-64 '} z-10 border-r border-border-color`}
    >
      <div className="flex relative items-center justify-between pt-6 pb-2">
        <Link to="/" className="text-lg font-medium flex gap-3 items-center">
          <img src="./logo.png" alt="Logo" className="w-full h-24" />
        </Link>
        <button
          onClick={toggleSidebar}
          className={`text-gray-400 text-xs w-8 bg-sidebar-toggler h-8 rounded-md hover:text-blue-400 
                      transition-all duration-200 absolute -right-4 shadow-md
                      ${!isCollapsed ? 'rotate-180' : ''} z-50`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className={`${isCollapsed ? 'overflow-hidden' : ''} flex flex-col space-y-2`}>
      <nav>
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
            className="p-4 flex items-center"
          >
            <FontAwesomeIcon className='px-3 text-[#99A1B7]' icon={faBook} />
            <span className={`${isCollapsed ? 'hidden group-hover:inline-block' : 'inline-block'} whitespace-nowrap`}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
      <div className='absolute bottom-0 w-full px-4'>
        <button className='text-sm pb-6 flex items-center' onClick={()=>toggleDarkMode()}>
          <FontAwesomeIcon icon={ !isDarkMode? faMoon: faSun } className='px-3 text-[#99A1B7]'/>
          <p className={`${isCollapsed ? 'hidden group-hover:inline-block' : 'inline-block'} `}>{!isDarkMode ? 'Dark Mode' : 'Light Mode'}</p>
        </button>
      </div>
    </div>
    </div>
    </div>
  );
};

export default DesktopSidebar;
