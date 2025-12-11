'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, User, LogOut, Settings, Check, ChevronRight } from 'lucide-react';
import { UserProfile, Notification, DashboardPage } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  title: string;
  user: UserProfile | null;
  notifications: Notification[];
  onOpenSettings: () => void;
  onNavigate: (page: DashboardPage) => void;
  onMarkAllRead: () => void;
}

export default function DashboardHeader({ 
  title, 
  user, 
  notifications, 
  onOpenSettings,
  onNavigate,
  onMarkAllRead
}: DashboardHeaderProps) {
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    router.push('/');
  };

  if (!user) return null;

  return (
    <header className={`sticky top-0 z-30 flex items-center justify-between px-6 py-4 md:px-10 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm' : 'bg-transparent'}`}>
       <div className="flex flex-col">
         <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize tracking-tight">{title}</h1>
         <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Welcome back, {user.name.split(' ')[0]}</p>
       </div>
       
       <div className="flex items-center gap-4 md:gap-6">
         {/* Notifications */}
         <div className="relative" ref={notifRef}>
           <button 
             onClick={() => setIsNotifOpen(!isNotifOpen)}
             className="relative w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
           >
             <Bell size={20} />
             {unreadCount > 0 && (
               <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#121212]"></span>
             )}
           </button>

           {isNotifOpen && (
             <div className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-white/5">
                  <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={onMarkAllRead} className="text-xs text-brand-purple hover:text-purple-600 font-semibold bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-md">Mark all read</button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                   {notifications.length === 0 ? (
                     <div className="p-8 text-center text-gray-400 text-sm">No new notifications</div>
                   ) : (
                     notifications.map(notif => (
                       <div key={notif.id} className={`p-4 border-b border-gray-50 dark:border-white/5 last:border-none hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group ${!notif.isRead ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}>
                          <div className="flex gap-4">
                             <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${!notif.isRead ? 'bg-brand-purple shadow-[0_0_8px_rgba(139,92,246,0.6)]' : 'bg-gray-300 dark:bg-gray-700'}`}></div>
                             <div>
                               <p className="text-sm font-bold text-gray-900 dark:text-white mb-1 group-hover:text-brand-purple transition-colors">{notif.title}</p>
                               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{notif.message}</p>
                               <span className="text-[10px] text-gray-400 mt-2 block font-medium">{notif.time}</span>
                             </div>
                          </div>
                       </div>
                     ))
                   )}
                </div>
             </div>
           )}
         </div>

         {/* User Menu */}
         <div className="relative" ref={userRef}>
           <div 
             onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
             className="flex items-center gap-3 cursor-pointer p-1 pr-3 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-white/10"
           >
             <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-[2px]">
               <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
                  {user.avatarUrl && !user.avatarUrl.startsWith('http') ? (
                    <span className="w-full h-full rounded-full bg-brand-purple text-white flex items-center justify-center text-xs font-bold">
                      {user.name.substring(0,2).toUpperCase()}
                    </span>
                  ) : (
                    <>
                      <img src={user.avatarUrl} alt={user.name} className="w-full h-full rounded-full object-cover" onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                      }}/>
                      <span className="hidden w-full h-full rounded-full bg-brand-purple text-white items-center justify-center text-xs font-bold">
                        {user.name.substring(0,2).toUpperCase()}
                      </span>
                    </>
                  )}
               </div>
             </div>
           </div>

           {isUserMenuOpen && (
             <div className="absolute top-full right-0 mt-4 w-64 bg-white dark:bg-[#121212] border border-gray-100 dark:border-white/10 rounded-2xl shadow-2xl shadow-black/10 z-40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               {/* User Info Header */}
               <div className="p-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                 <p className="font-bold text-gray-900 dark:text-white truncate text-base">{user.name}</p>
                 <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{user.email}</p>
               </div>

               {/* Menu Items */}
               <div className="p-2 space-y-1">
                 <button 
                   onClick={() => { onNavigate('profile'); setIsUserMenuOpen(false); }}
                   className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                 >
                   <User size={18} className="text-gray-400" />
                   Profile
                 </button>
                 <button 
                   onClick={() => { onOpenSettings(); setIsUserMenuOpen(false); }}
                   className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                 >
                   <Settings size={18} className="text-gray-400" />
                   Settings
                 </button>
               </div>

               {/* Footer */}
               <div className="p-2 border-t border-gray-100 dark:border-white/5">
                 <button 
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                 >
                   <LogOut size={18} />
                   Sign Out
                 </button>
               </div>
             </div>
           )}
         </div>
       </div>
    </header>
  );
}

