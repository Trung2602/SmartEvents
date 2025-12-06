'use client';

import { useContext } from 'react';
import Account from '@/app/app/feature/Account';
import Notificator from '@/app/app/feature/Notificator';
import { Search, Bell, User } from 'lucide-react';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  title?: string;
  onNavigate?: (label: string) => void;
}

export default function Header({ title = 'Discover', onNavigate }: HeaderProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  return (
    <header className="h-20 border-b border-gray-200 dark:border-white/5 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-6 md:px-10 transition-colors transition-all duration-200">
       <h1 className="text-xl font-bold text-gray-900 dark:text-white capitalize">{title}</h1>
       <div className="flex items-center gap-6">
         {user ? (
           <>
             <Notificator />
             <Account onNavigate={onNavigate} />
           </>
         ) : (
           <>
             <button onClick={() => router.push('/')} className="hidden sm:block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors cursor-pointer">Sign in</button>
             <Button onClick={() => router.push('/')} className="rounded-full">Sign up</Button>
           </>
         )}
       </div>
    </header>
  );
}
