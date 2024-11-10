import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faDragon, faArrowRight } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className='group/width'>
    <div className={`${isCollapsed ? 'w-20 group-hover/width:w-64' : 'w-64 '} transition-all duration-300`}></div>
    <div
      className={`fixed min-h-screen group bg-black shadow-md transition-all duration-300
                  ${isCollapsed ? 'w-20 group-hover/width:w-64' : 'w-64 '} z-50`}
    >
      <div className="flex relative items-center justify-between p-4 h-20 border-b border-white border-opacity-30">
        <Link to="/" className="text-lg font-medium text-white flex gap-3 items-center">
          <FontAwesomeIcon icon={faDragon} className={`${isCollapsed ? 'text-2xl group-hover:text-4xl' : 'text-4xl'} text-red-500`} />
          <h1 className={`${isCollapsed ? 'hidden group-hover:block' : 'block'}`}>Dashboard</h1>
        </Link>
        <button
          onClick={toggleSidebar}
          className={`text-gray-400 text-xs bg-white w-8 h-8 rounded-md hover:text-blue-400 
                      transition-all duration-200 absolute -right-4 shadow-md
                      ${isCollapsed ? 'rotate-180' : ''}`}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
      <div className={`${isCollapsed ? 'overflow-hidden' : ''} mt-6 flex flex-col space-y-2`}>
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
            className="p-4 text-[#9a9cae] hover:text-white flex items-center"
          >
            <FontAwesomeIcon className='px-3' icon={faBook} />
            <span className={`${isCollapsed ? 'hidden group-hover:inline-block' : 'inline-block'} whitespace-nowrap`}>
              {label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
    </div>
    </div>
  );
};

export default Sidebar;
