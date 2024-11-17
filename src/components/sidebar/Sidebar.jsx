import React, { useState } from 'react';
import DesktopSidebar from './DesktopSidebar';
import MobileSidebar from './MobileSidebar';

const Sidebar = ({isSidebarOpen, toggleSidebar}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark', !isDarkMode);
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      {/* Show Sidebar only on large screens */}
      <div className="hidden lg:block">
        <DesktopSidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      </div>

      {/* Show MobileSidebar only on small screens */}
      <div className="block lg:hidden">
        <MobileSidebar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
      </div>
    </>
  );
};

export default Sidebar;
