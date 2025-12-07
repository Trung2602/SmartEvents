import React from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Theme } from '../types';

interface FooterProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  variant?: 'landing' | 'dashboard';
}

const Footer: React.FC<FooterProps> = ({ currentTheme, setTheme, variant = 'landing' }) => {
  if (variant === 'dashboard') {
    return (
      <footer className="border-t border-gray-200 dark:border-white/5 py-8 mt-auto transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 px-6">
           <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
             <span className="font-bold text-gray-900 dark:text-white">interest.</span>
             <span>© 2024</span>
             <span className="hidden md:inline text-gray-300 dark:text-gray-700">•</span>
             <span className="hidden md:inline">Designed by Heahaidu</span>
           </div>

           <div className="flex items-center gap-1 bg-gray-100 dark:bg-white/5 p-1 rounded-full border border-gray-200 dark:border-white/5 scale-90">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                  title="Light Mode"
                >
                  <Sun size={14}/>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'dark' ? 'bg-gray-700 text-white dark:bg-white/10 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                  title="Dark Mode"
                >
                  <Moon size={14}/>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'system' ? 'bg-white text-black dark:bg-white/10 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                  title="System Theme"
                >
                  <Monitor size={14}/>
                </button>
            </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gray-200 dark:border-white/5 pt-16 pb-8 px-6 bg-gray-50 dark:bg-[#050505] transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {/* Columns */}
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-sm">Product</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Features</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Download</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-sm">Company</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">About</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white mb-6 text-sm">Resources</h4>
          <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Community</a></li>
            <li><a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</a></li>
          </ul>
        </div>
        
        {/* Logo & Branding */}
        <div className="flex flex-col items-start md:items-end">
             <div className="flex items-center gap-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-black dark:bg-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"></div>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">interest.</span>
            </div>
            <p className="text-xs text-gray-500 mb-6 text-right">Designed by Heahaidu</p>
            
            <div className="flex items-center gap-1 bg-gray-200 dark:bg-white/5 p-1 rounded-full border border-gray-300 dark:border-white/5">
                <button 
                  onClick={() => setTheme('light')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'light' ? 'bg-white text-black shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                  <Sun size={14}/>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'dark' ? 'bg-gray-700 text-white dark:bg-white/10 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                  <Moon size={14}/>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`p-1.5 rounded-full transition-all ${currentTheme === 'system' ? 'bg-white text-black dark:bg-white/10 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'}`}
                >
                  <Monitor size={14}/>
                </button>
            </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;