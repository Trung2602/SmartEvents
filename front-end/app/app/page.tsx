'use client';

import { useContext, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import Sidebar from '@/app/app/Sidebar';
import { AppPage, DateFilter, Event, Theme, UserProfile, ViewMode } from '@/lib/types';
import Footer from './Footer';
import { Menu } from 'lucide-react';
import { Modal } from '@/components/common/Modal';
import Login from '@/components/common/Login';
import Register from '@/components/common/Register';
import { eventApi } from '@/lib/api/event';
import Discover from './pages/Discover';
import Activity from './pages/Activity';
import SettingsDialog from '@/components/dialogs/SettingsDialog';
import AiChatWidget from '@/components/shared/AiChatWidget';
import EventDetailDialog from '@/components/dialogs/EventDetailDialog';
import EventEditorDialog from '@/components/dialogs/EventEditorDialog';
import { AuthContext } from '@/context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);

  // -- Filters State --
  const [currentTitle, setCurrentTitle] = useState('Discover');
  const [theme, setTheme] = useState<Theme>('dark');

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorEvent, setEditorEvent] = useState<Event | null>(null);

  //conditional rendering page 
  const [currentPage, setCurrentPage] = useState<AppPage>('Discover');

  // --- Handlers ---
  const handleSetTheme = (theme: Theme) => {
    setTheme(theme);
  }

  const openCreateDialog = () => {
  };

  const handleRegisterEvent = (event: Event) => {
    const updatedEvent = { ...event, isRegistered: true };
    setEvents(prev => prev.map(e => e.uuid === event.uuid ? updatedEvent : e));
    setSelectedEvent(updatedEvent);

    // setNotifications(prev => [{
    //     id: Math.random().toString(),
    //     title: 'Registration Successful',
    //     message: `You are now registered for ${event.title}`,
    //     time: 'Just now',
    //     isRead: false,
    //     type: 'success'
    // }, ...prev]);
  };

  const handleUnregisterEvent = (event: Event) => {
    if (confirm("Are you sure you want to cancel your registration?")) {
      const updatedEvent = { ...event, isRegistered: false };
      setEvents(prev => prev.map(e => e.uuid === event.uuid ? updatedEvent : e));
      setSelectedEvent(updatedEvent);
    }
  };

  const openEditDialog = (event: Event) => {
    if (event.isEnded) {
      alert("Cannot edit past events.");
      return;
    }
    setEditorEvent(event);
    setIsEditorOpen(true);
  };

  const handleToggleInterest = (id: string) => {
    setEvents(prev => prev.map(e => e.uuid === id ? { ...e, isLiked: !e.isLiked } : e));
    if (selectedEvent && selectedEvent.uuid === id) {
      setSelectedEvent(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  };

  // CRUD OPERATIONS
  const handleCreateEvent = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    // setIsEditorOpen(false);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.uuid === updatedEvent.uuid ? updatedEvent : e));
    // setIsEditorOpen(false);
    // if (selectedEvent && selectedEvent.id === updatedEvent.id) {
    //     setSelectedEvent(updatedEvent);
    // }
  };


  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(prev => prev.filter(e => e.uuid !== id));
      setSelectedEvent(null);
    }
  };

  // Logic to swap categories if a user selects one from "More"
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (t: 'light' | 'dark') => {
      if (t === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark ? 'dark' : 'light');

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches ? 'dark' : 'light');
      };

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  useEffect(() => {
    // set current page from query param (e.g. /app?pane=profile)
    // const pane = searchParams?.get('pane');
    // if (pane === 'profile') setCurrentPage('profile');
    // if (pane === 'bookmarks') setCurrentPage('bookmarks');
    load()

  }, []);

  // API
  async function load() {
    const { items, nextCursor, hasNext } = await eventApi.list();
    console.log('oke')
    setEvents(items)
  }

  const filteredEvents = events;

  return (
    <div className="flex min-h-screen bg-white min-h-screen bg-white dark:bg-[#050505] transition-all duration-200">
      <Sidebar
        active={currentPage}
        onNavChange={(label) => {
          setCurrentTitle(label);
          setCurrentPage(label);
        }}
        onCreateEvent={openCreateDialog}
        isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
      >
        <Menu />
      </button>

      {/* Main content area */}
      <div className="flex-1 flex flex-col lg:ml-56 min-h-screen dark:!bg-[#0a0a0a]">
        {/* Header - Fixed on top */}
        <Header title={currentTitle} onNavigate={(label: string) => {
          setCurrentTitle(label);
        }}
          onLogin={() => setShowSignInModal(true)} onRegister={() => setShowSignUpModal(true)}
        />

        {/* Main content */}
        <main className="flex-1 animate-in fade-in duration-300 slide-in-from-bottom-2">
          {currentPage === 'Discover' ? (
            <Discover showSignInPopup={() => setShowSignInModal(true)} selectedEvent={selectedEvent} onSelectedEvent={setSelectedEvent} />
          ) : currentPage === 'Channel' ? (
            <></>
          ) : currentPage === 'Profile' ? (
            <></>
          ) : currentPage === 'Activity' ? (
            <Activity />
          ) : <></>}
        </main>
        <Footer theme={theme} setTheme={handleSetTheme} />
      </div>
      <Modal isOpen={showSignInModal} onClose={() => setShowSignInModal(false)}>
        <Login onSuccess={() => setShowSignInModal(false)} />
      </Modal>

      <Modal isOpen={showSignUpModal} onClose={() => setShowSignUpModal(false)}>
        <Register onSuccess={() => setShowSignUpModal(false)} />
      </Modal>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={theme}
        setTheme={setTheme}
      />
      <AiChatWidget allEvents={events} onEventClick={setSelectedEvent} />

      <EventDetailDialog
        event={selectedEvent}
        currentUser={user}
        onClose={() => setSelectedEvent(null)}
        onToggleInterest={handleToggleInterest}
        onEdit={openEditDialog}
        onDelete={handleDeleteEvent}
        onRegisterEvent={handleRegisterEvent}
        onUnregisterEvent={handleUnregisterEvent}
        onLogin={() => {
          setSelectedEvent(null);
          setShowSignInModal(true)
        }}
      />
      <EventEditorDialog
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        event={editorEvent}
        user={user}
        onSave={editorEvent ? handleUpdateEvent : handleCreateEvent}
      />
    </div>
  );
}
