'use client'

import { Search, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all lg:px-16 lg:py-6 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className="text-3xl font-bold text-red-600 tracking-tighter cursor-pointer" onClick={() => window.location.reload()}>MUSTI</h1>
        <ul className="hidden space-x-6 text-sm font-light md:flex">
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">Home</li>
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">Movies</li>
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">TV Shows</li>
        </ul>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center bg-black/40 border border-gray-500 rounded-full px-4 py-1.5 focus-within:border-white transition-all">
          <input 
            type="text" 
            placeholder="Search movies..." 
            className="bg-transparent border-none outline-none text-xs md:text-sm w-24 md:w-48 text-white placeholder-gray-400"
          />
          <Search className="h-4 w-4 text-gray-400 cursor-pointer" />
        </div>
        
        <div className="hidden md:flex items-center space-x-4 text-sm font-light">
          <p className="cursor-pointer hover:text-gray-300">Kids</p>
          <Bell className="h-5 w-5 cursor-pointer hover:text-gray-300" />
          <div className="h-6 w-6 cursor-pointer rounded bg-gray-500 flex items-center justify-center hover:bg-gray-400">
            <User className="h-4 w-4" />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
