'use client';

import React from 'react';
import { Compass, Heart, User, Footprints, Settings, HelpCircle, X, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardPage } from '@/lib/types';

interface DashboardSidebarProps {
  currentPage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  onOpenSettings: () => void;
  onOpenSupport: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onCreateEvent: () => void;
}

export default function DashboardSidebar({ 
  currentPage, 
  onNavigate, 
  onOpenSettings, 
  onOpenSupport,
  isMobileOpen = false,
  onCloseMobile,
  onCreateEvent
}: DashboardSidebarProps) {
  const router = useRouter();
  const navItems = [
    { id: 'discover' as DashboardPage, label: 'Discover', icon: Compass },
    { id: 'interest' as DashboardPage, label: 'Interest', icon: Heart },
    { id: 'profile' as DashboardPage, label: 'Profile', icon: User },
    { id: 'activity' as DashboardPage, label: 'Activity', icon: Footprints },
  ];

  const handleNavClick = (page: DashboardPage) => {
    onNavigate(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-300"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        w-72 fixed left-0 top-0 bottom-0 
        bg-white/80 dark:bg-[#0a0a0a]/90 backdrop-blur-2xl
        border-r border-gray-200/50 dark:border-white/5
        p-6 flex flex-col z-50 transition-transform duration-300 ease-in-out shadow-2xl lg:shadow-none
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:flex
      `}>
        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          <a href="/" onClick={(e) => { e.preventDefault(); router.push('/'); }} className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="w-2.5 h-2.5 rounded-full bg-white dark:bg-black"></div>
              </div>
              <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white">interest.</span>
          </a>
          
          <button onClick={onCloseMobile} className="lg:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Create Event Button */}
        <button 
            onClick={() => { onCreateEvent(); if(onCloseMobile) onCloseMobile(); }}
            className="w-full mb-8 bg-gray-900 dark:bg-white text-white dark:text-black py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
            <PlusCircle size={20} />
            <span>Create Event</span>
        </button>

        {/* Navigation */}
        <div className="space-y-1">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              const Icon = item.icon;
              return (
                <button 
                  key={item.id} 
                  onClick={() => handleNavClick(item.id)} 
                  className={`relative w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group
                    ${isActive 
                      ? 'text-brand-purple bg-brand-purple/5 dark:bg-brand-purple/10' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'}`}
                >
                  {isActive && <div className="absolute left-0 w-1 h-8 bg-brand-purple rounded-r-full"></div>}
                  <Icon 
                    size={22} 
                    className={`transition-colors ${isActive ? 'text-brand-purple' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'}`}
                    fill={item.id === 'interest' && isActive ? "currentColor" : "none"} 
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-6 space-y-1">
           <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">General</p>
           <button 
            onClick={() => { onOpenSettings(); if (onCloseMobile) onCloseMobile(); }} 
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <Settings size={20} />
            Settings
          </button>
          <button 
            onClick={() => { onOpenSupport(); if (onCloseMobile) onCloseMobile(); }} 
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            <HelpCircle size={20} />
            Support
          </button>
        </div>
      </div>
    </>
  );
}

