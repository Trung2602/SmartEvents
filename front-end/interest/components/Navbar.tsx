import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    navigate(path);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-brand-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <a href="#" onClick={(e) => handleNav(e, '/')} className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center transition-colors">
            <div className="w-2 h-2 rounded-full bg-white dark:bg-black transition-colors"></div>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white transition-colors">interest.</span>
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600 dark:text-gray-300">
          <a href="#" onClick={(e) => handleNav(e, '/app')} className="hover:text-black dark:hover:text-white transition-colors">Discover</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Community</a>
          <a href="#" className="hover:text-black dark:hover:text-white transition-colors">Download</a>
        </div>

        {/* Auth */}
        <div className="flex items-center gap-4">
          <a href="#" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors">Sign in</a>
          <button className="bg-black text-white dark:bg-white dark:text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            Sign up
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;