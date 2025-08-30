import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-bold">
          E-Commerce
        </Link>
        <div className="flex space-x-4">
          <Link to="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link to="/cart" className="text-gray-300 hover:text-white">
            Cart
          </Link>
          <Link to="/profile" className="text-gray-300 hover:text-white">
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;