import React, {useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const MobileNavbar = ({image, toggleSidebar, isSidebarOpen}) => {
    const [showUserMenu, setShowUserMenu] = useState(false); // State for user menu

  return (
    <div className='grid  px-10 text-2xl grid-cols-3 md:hidden w-full bg-primary-bg z-50 items-center justify-center lg:px-7 h-[60px] fixed bottom-0 right-0'>
    {/* Sidebar toggle button for mobile view */}

  {/* Notification, Messages, and Login/Logout buttons */}
    {/* Notifications button with hover popup */}
    <Link 
      className="relative flex justify-center items-center  px-2 h-full "
      onClick={()=>{toggleSidebar(false); setShowUserMenu(false)}}
      to={'/'}
    >
        <FontAwesomeIcon icon={faHome} />
    </Link>

    <div className='relative flex justify-center items-center pt-1 px-2 h-full ' onClick={() => {toggleSidebar(true); setShowUserMenu(false)}}>
    <button 
        className={`${isSidebarOpen && 'text-primary-btn'} transition-colors duration-200`}
    >
    <FontAwesomeIcon icon={faBars} />
  </button>
  </div>

      {/* User profile image with hover popup */}


    <div className="relative flex justify-center items-center "
    >
    <div 
      className='w-full h-full flex justify-center items-center py-1'
      onClick={()=> {toggleSidebar(false); setShowUserMenu(!showUserMenu)}}
    >
      <img 
        src={image} //to be changed
        alt="User Profile" 
        className="w-7 ml-2 h-7 rounded-full cursor-pointer"
      />
    </div>
        <div 
        className={`sidebar fixed bottom-0 left-0 w-full h-full -z-10 transform ${
          showUserMenu
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0'
        } transition-all duration-500 lg:hidden`}
        >
        <div className='flex items-center mb-4 py-4 px-4 justify-between border-b border-gray-300 border-opacity-30'>
          <h3 className="font-semibold">Notifications</h3>
          <Link className='' to={'/profile'} onClick={()=>{toggleSidebar(false); setShowUserMenu(false)}}>
            <img 
                src={image} //to be changed
                alt="User Profile" 
                className="w-9 ml-2 h-9 rounded-full cursor-pointer"
            />
        </Link>
        </div>
            <ul className="space-y-4 px-4 max-h-[75%] overflow-y-auto scrollbar-hide">
                {/* Example Notifications */}
                <li className="text-sm opacity-80">
                <p className="font-medium">System Alert</p>
                <p className="text-sm opacity-60">Your account has been updated.</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                <li className="text-sm opacity-80">
                <p className="font-medium">New Feature</p>
                <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                </li>
                {/* Add more notification items here */}
            </ul>
        </div>
    </div>
  </div>
  )
}

export default MobileNavbar