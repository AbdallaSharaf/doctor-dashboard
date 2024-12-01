import React, {useState} from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDragon, faBell, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


const DesktopNavbar = ({toggleSidebar, image}) => {
    const [showMessages, setShowMessages] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);  // State for notifications popup
    const [showUserMenu, setShowUserMenu] = useState(false); // State for user menu
    const messages = useSelector(state => state.messages.data);

  return (
        <div className='hidden md:flex bg-primary-bg items-center justify-between px-4 lg:px-7 h-[60px] border-gray-300 border-opacity-10 shadow-md  border-b'>
          {/* Sidebar toggle button for mobile view */}
          <button 
          onClick={toggleSidebar} 
          className="text-2xl lg:hidden"
        >
          <FontAwesomeIcon icon={faDragon} />
        </button>
  
        {/* Centered placeholder space */}
        <div className="flex-1"></div>
  
        {/* Notification, Messages, and Login/Logout buttons */}
        <div className="flex items-center">
          {/* Notifications button with hover popup */}
          <div 
            className="relative flex justify-center items-center group px-2 "
            onMouseEnter={() => setShowNotifications(true)}
            onMouseLeave={() => setShowNotifications(false)}
          >
            <button className={`text-lg group-hover:text-blue-500 transition-colors duration-200`}>
              <FontAwesomeIcon icon={faBell} />
            </button>
            
            {showNotifications && (
              <div 
                className="absolute bg-primary-bg right-2 top-7 py-3 w-80 shadow-lg border border-gray-300 border-opacity-30 rounded-lg z-50"
              >
                <h3 className="font-semibold mb-3 pb-3 px-4 border-b border-gray-300 border-opacity-30">Recent Notifications</h3>
                <ul className="space-y-3 px-4 max-h-52 overflow-y-auto">
                  {/* Example Notifications */}
                  <li className="text-sm opacity-80">
                    <p className="font-medium">System Alert</p>
                    <p className="text-sm opacity-60">Your account has been updated.</p>
                  </li>
                  <li className="text-sm opacity-80">
                    <p className="font-medium">New Feature</p>
                    <p className="text-sm opacity-60">Check out the new dashboard feature!</p>
                  </li>
                  {/* Add more notification items here */}
                </ul>
              </div>
            )}
          </div>
  
          {/* Messages button with hover popup */}
          <div 
            className="relative flex justify-center items-center group px-2"
            onMouseEnter={() => setShowMessages(true)}
            onMouseLeave={() => setShowMessages(false)}
          >
            <button className="text-lg group-hover:text-blue-500 transition-colors duration-200">
              <FontAwesomeIcon icon={faEnvelope} />
            </button>
            
            {showMessages && (
              <div 
                className="absolute right-2 top-7 bg-primary-bg w-80 shadow-lg border border-gray-300 border-opacity-30 rounded-lg z-50"
              >
                <h3 className="font-semibold mb-3 py-3 px-4 border-b border-gray-300 border-opacity-30 ">Recent Messages</h3>
                <ul className="space-y-3 px-4 max-h-52 overflow-y-auto">
                  {messages.length === 0 ? (
                    <p className="text-center py-6">No recent messages</p>
                  ) : (
                    messages.map((message, index) => (
                      <li key={index} className={`${!message.unread && 'opacity-50'}`}>
                        <Link to={`/messages/${message.id}`} onClick={() => setShowMessages(false)} className='flex items-center justify-between text-sm'>
                          <div>
                            <p className='font-medium'>{message.name}</p>
                            <p className='opacity-60'>{message.subject}</p>
                          </div>
                          {message.unread && <div className='w-3 h-3 bg-blue-500 rounded-full' />}
                        </Link>
                      </li>
                    ))
                  )}
                </ul>
                {messages.length > 0 && (
                  <Link 
                    to="/messages" 
                    className="block text-center w-fit mx-auto p-4 text-blue-600 hover:underline text-sm"
                    onClick={() => setShowMessages(false)}
                  >
                    View All Messages
                  </Link>
                )}
              </div>
            )}
          </div>
  
            {/* User profile image with hover popup */}
            <div 
            className="relative py-1"
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <img 
              src={image} //to be changed
              alt="User Profile" 
              className="w-9 ml-2 h-9 rounded-md cursor-pointer"
            />
            
            {showUserMenu && (
              <div 
                className="absolute right-0 top-11 w-40 shadow-lg border bg-primary-bg border-gray-300 border-opacity-30 rounded-lg z-50"
              >
                <ul className="space-y-3 py-3 px-4">
                  <li>
                    <Link to="/profile" className="text-sm hover:text-blue-600">Profile</Link>
                  </li>
                  <li>
                    <Link to="/clinic-settings" className="text-sm hover:text-blue-600">Settings</Link>
                  </li>
                  <li>
                    <button className="text-sm text-red-600 w-full text-left">Sign Out</button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        </div>
  )
}

export default DesktopNavbar