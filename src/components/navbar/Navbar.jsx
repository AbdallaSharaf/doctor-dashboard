import React from 'react';
import image from '../../assets/profile-img.jpg'
import DesktopNavbar from './DesktopNavbar';
import MobileNavbar from './MobileNavbar';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {

  return (
    <div className="w-full">
      <DesktopNavbar toggleSidebar={toggleSidebar} image={image}/>
      <MobileNavbar  toggleSidebar={toggleSidebar} image={image} isSidebarOpen={isSidebarOpen}/>
    </div>
  );
};

export default Navbar;
