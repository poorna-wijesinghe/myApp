import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const HeaderTwo = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="relative w-full">      
      <div className="flex justify-between items-center px-4 py-3 bg-transparent">       
        <div>
          <button className="border px-4 py-2 bg-white font-bold text-lg">
            LOGO
          </button>
        </div>

        {/* Right Hamburger */}
        <button
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="p-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
          aria-label="Toggle menu"
        >
          {drawerOpen ? (
            <X className="h-6 w-6 text-gray-700 transition-transform duration-200" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Drawer */}
      {drawerOpen && (
        <div className="absolute top-full right-0 w-48 bg-white shadow-lg z-20 p-4 space-y-4 animate-slide-in">
          <a href="/home" className="block hover:underline">Home</a>
          <a href="/my-profile" className="block hover:underline">My Profile</a>
          <a href="/edit-profile" className="block hover:underline">Edit Profile</a>
          <a href="/" className="block text-red-600 hover:underline">Logout</a>
        </div>
      )}
    </header>
  );
};

export default HeaderTwo;
