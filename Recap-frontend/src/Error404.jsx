import React from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const Error404 = () => {
    

  return (

    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <h1 className="text-6xl font-bold text-purple-500">404</h1>
      <p className="text-2xl mt-4 font-semibold">Oops! Page Not Found</p>
      <p className="text-gray-300 mt-2 text-center max-w-md">
        It seems the page you’re looking for doesn’t exist or may have been moved. Team <span className="text-pink-500">Synapse</span> is working on it!
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
      >
        Go Back Home
      </Link>
     
        <button
            onClick={() => window.history.go(-1)}
            className="mt-4 px-6 py-3 bg-gray-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
            Go Back to the Previous Page
        </button>

      <div className="mt-10 text-gray-400">
        <p>If you believe this is a mistake, feel free to contact us.</p>
        <a
          href="mailto:arshtiwari12345@gmail.com"
          className="text-pink-500 hover:underline text-center block mt-2"
        >
          arshtiwari12345@gmail.com
        </a>
      </div>
    </div>
  );
};

export default Error404;
