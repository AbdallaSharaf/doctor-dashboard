import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800 w-full ">
      <h1 className="text-5xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="px-6 py-3 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-300">
        Go to Homepage
      </Link>
    </div>
  );
};

export default NotFound;
