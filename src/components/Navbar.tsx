'use client'

import { Search, Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getThemeConfig } from '@/utils/theme';

interface Props {
  onSearch: (query: string) => void;
}

const Navbar = ({ onSearch }: Props) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const theme = getThemeConfig();

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <nav className={`fixed top-0 z-50 flex w-full items-center justify-between px-4 py-4 transition-all duration-500 lg:px-16 lg:py-6 ${isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <h1 className={`text-3xl font-bold ${theme.primaryColor} tracking-tighter cursor-pointer transition-all duration-500`} onClick={() => window.location.reload()}>
          {theme.brandName}
        </h1>
        <ul className="hidden space-x-6 text-sm font-light md:flex">
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">Home</li>
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">Movies</li>
          <li className="cursor-pointer hover:text-gray-300 transition duration-300">TV Shows</li>
        </ul>
      </div>

      <div className="flex items-center space-x-6">
        <form onSubmit={handleSearch} className="flex items-center bg-black/40 border border-gray-500 rounded-full px-4 py-1.5 focus-within:border-white transition-all">
          <input 
            type="text" 
            placeholder="Search movies..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs md:text-sm w-24 md:w-48 text-white placeholder-gray-400"
          />
          <button type="submit">
            <Search className="h-4 w-4 text-gray-400 cursor-pointer" />
          </button>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
