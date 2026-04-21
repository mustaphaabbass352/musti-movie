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
        <h1 className="text-3xl font-bold text-[#E50914] cursor-pointer">MUSTI</h1>
        <ul className="hidden space-x-4 md:flex">
          <li className="navLink font-semibold text-white hover:text-white">Home</li>
          <li className="navLink">TV Shows</li>
          <li className="navLink">Movies</li>
          <li className="navLink">New & Popular</li>
          <li className="navLink">My List</li>
        </ul>
      </div>

      <div className="flex items-center space-x-4 text-sm font-light">
        <Search className="h-6 w-6 cursor-pointer" />
        <p className="hidden lg:inline">Kids</p>
        <Bell className="h-6 w-6 cursor-pointer" />
        <div className="h-6 w-6 cursor-pointer rounded bg-gray-500 flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
