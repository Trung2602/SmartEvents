import React, { useState, useEffect, useRef } from 'react';
import { Menu, Globe, Search, Activity, ChevronDown, Check, Loader2, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Event, DashboardPage, ViewMode, Theme, DateFilter, UserProfile, Notification } from '../types';
import { fetchEvents, fetchUserProfile, fetchNotifications } from '../services/dataService';

// Components
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardHeader from '../components/DashboardHeader';
import FeaturedCarousel from '../components/FeaturedCarousel';
import DashboardControls from '../components/DashboardControls';
import TimelineEventList from '../components/TimelineEventList';
import GridEventList from '../components/GridEventList';
import Footer from '../components/Footer';

// Dialogs
import SettingsDialog from '../components/dialogs/SettingsDialog';
import SupportDialog from '../components/dialogs/SupportDialog';
import EventDetailDialog from '../components/dialogs/EventDetailDialog';
import EventEditorDialog from '../components/dialogs/EventEditorDialog';

// Data constants
const ALL_CATEGORIES = ['All', 'Music', 'Tech', 'Art', 'Gaming', 'Education', 'Business', 'Food', 'Sports', 'Health', 'Fashion'];
const AVAILABLE_COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Japan', 'Vietnam', 'Global'];

interface DashboardAppProps {
    theme: Theme;
    setTheme: (t: Theme) => void;
}

const DashboardApp: React.FC<DashboardAppProps> = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const initialData = location.state as any;

  // Global App State
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  const [events, setEvents] = useState<Event[]>([]);

  const [dashboardPage, setDashboardPage] = useState<DashboardPage>('discover');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  
  // Dialog States
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorEvent, setEditorEvent] = useState<Event | null>(null);

  // -- Filters State --
  const [visibleCategories, setVisibleCategories] = useState(ALL_CATEGORIES.slice(0, 6));
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMoreCatOpen, setIsMoreCatOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Global');
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilter>({ start: '', end: '', isAuto: true });
  const [searchTerm, setSearchTerm] = useState('');

  const moreCatRef = useRef<HTMLDivElement>(null);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreCatRef.current && !moreCatRef.current.contains(event.target as Node)) setIsMoreCatOpen(false);
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) setIsCountryOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [userData, notifData, eventsData] = await Promise.all([
          fetchUserProfile(),
          fetchNotifications(),
          fetchEvents()
        ]);

        setUser(userData);
        setNotifications(notifData);
        if (initialData?.searchResults) {
           setEvents(initialData.searchResults);
        } else {
           setEvents(eventsData);
        }
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [initialData]);

  // CRUD OPERATIONS
  const handleCreateEvent = (newEvent: Event) => {
    setEvents(prev => [newEvent, ...prev]);
    setIsEditorOpen(false);
  };

  const handleUpdateEvent = (updatedEvent: Event) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setIsEditorOpen(false);
    if (selectedEvent && selectedEvent.id === updatedEvent.id) {
        setSelectedEvent(updatedEvent);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
        setEvents(prev => prev.filter(e => e.id !== id));
        setSelectedEvent(null);
    }
  };

  const handleRegisterEvent = (event: Event) => {
    const updatedEvent = { ...event, isRegistered: true };
    setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
    setSelectedEvent(updatedEvent);
    
    setNotifications(prev => [{
        id: Math.random().toString(),
        title: 'Registration Successful',
        message: `You are now registered for ${event.title}`,
        time: 'Just now',
        isRead: false,
        type: 'success'
    }, ...prev]);
  };

  const handleUnregisterEvent = (event: Event) => {
    if(confirm("Are you sure you want to cancel your registration?")) {
        const updatedEvent = { ...event, isRegistered: false };
        setEvents(prev => prev.map(e => e.id === event.id ? updatedEvent : e));
        setSelectedEvent(updatedEvent);
    }
  };

  const openCreateDialog = () => {
    setEditorEvent(null);
    setIsEditorOpen(true);
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
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isLiked: !e.isLiked } : e));
    if (selectedEvent && selectedEvent.id === id) {
        setSelectedEvent(prev => prev ? { ...prev, isLiked: !prev.isLiked } : null);
    }
  };

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    if (!visibleCategories.includes(cat)) {
      const newVisible = [...visibleCategories];
      newVisible[newVisible.length - 1] = cat; 
      setVisibleCategories(newVisible);
    }
    setIsMoreCatOpen(false);
  };

  const filteredEvents = events.filter(e => {
    if (dashboardPage === 'interest' && !e.isLiked) return false;
    if (selectedCategory !== 'All' && e.category !== selectedCategory) return false;
    if (selectedCountry !== 'Global' && e.country !== 'Global' && e.country !== selectedCountry) return false;
    if (searchTerm && !e.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (!dateFilter.isAuto && dateFilter.start && dateFilter.end) {
      const currentYear = new Date().getFullYear();
      const eventDate = new Date(`${e.dateStr}, ${currentYear}`);
      const startDate = new Date(dateFilter.start);
      const endDate = new Date(dateFilter.end);
      eventDate.setHours(0,0,0,0);
      startDate.setHours(0,0,0,0);
      endDate.setHours(23,59,59,999);
      if (eventDate < startDate || eventDate > endDate) return false;
    }
    return true;
  });

  const hiddenCategories = ALL_CATEGORIES.filter(c => !visibleCategories.includes(c));

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
         <Loader2 className="w-10 h-10 text-brand-purple animate-spin" />
      </div>
    );
  }

  const renderContent = () => {
    if (dashboardPage === 'profile') {
      return (
        <div className="p-10 text-center animate-in fade-in duration-300">
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mb-6 flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                {user.avatarUrl.substring(0,2).toUpperCase()}
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
            <p className="text-gray-500 mb-8">{user.bio}</p>
            <div className="flex justify-center gap-4">
                 <button onClick={() => setIsSettingsOpen(true)} className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:shadow-lg transition-all">Edit Profile</button>
            </div>
        </div>
      );
    }
    if (dashboardPage === 'activity') {
      return (
        <div className="p-20 text-center animate-in fade-in duration-300 flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Activity size={40} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Recent Activity</h2>
            <p className="text-gray-500 max-w-md">Your recent interactions, bookings, and history will appear here once you start exploring events.</p>
        </div>
      );
    }
    
    return (
      <div className="p-6 md:px-12 md:py-8 max-w-screen-2xl mx-auto">
         {/* Background Blobs for Atmosphere */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-purple-500/5 to-transparent pointer-events-none"></div>
         <div className="fixed top-40 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none animate-blob"></div>
         <div className="fixed top-60 left-20 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none animate-blob animation-delay-2000"></div>

         <div className="relative z-10 flex flex-col xl:flex-row gap-6 mb-12 items-start xl:items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap items-center gap-3">
               {visibleCategories.map(cat => (
                 <button 
                    key={cat} 
                    onClick={() => setSelectedCategory(cat)} 
                    className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        selectedCategory === cat 
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg shadow-black/20 dark:shadow-white/10 scale-105' 
                        : 'bg-white text-gray-600 border border-transparent hover:border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:hover:bg-white/10'
                    }`}
                 >
                   {cat}
                 </button>
               ))}
               <div className="relative" ref={moreCatRef}>
                 <button onClick={() => setIsMoreCatOpen(!isMoreCatOpen)} className={`flex items-center gap-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${isMoreCatOpen || hiddenCategories.includes(selectedCategory) ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-gray-600 dark:bg-white/5 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/10'}`}>
                    More <ChevronDown size={14} />
                 </button>
                 {isMoreCatOpen && (
                    <div className="absolute top-full left-0 mt-3 w-52 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl shadow-black/10 z-50 overflow-hidden border border-gray-100 dark:border-white/5 p-2">
                        {hiddenCategories.map(cat => (
                            <button key={cat} onClick={() => handleCategorySelect(cat)} className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex justify-between text-gray-700 dark:text-gray-300 transition-colors">
                                {cat} {selectedCategory === cat && <Check size={14} className="text-brand-purple"/>}
                            </button>
                        ))}
                    </div>
                 )}
               </div>
            </div>

            {/* Country */}
            <div className="flex items-center gap-3 w-full xl:w-auto relative" ref={countryRef}>
               <button onClick={() => setIsCountryOpen(!isCountryOpen)} className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/5 border border-transparent hover:border-gray-200 dark:hover:border-white/10 rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all">
                 <Globe size={16} className="text-gray-500" /><span>{selectedCountry}</span><ChevronDown size={14} className="ml-1 text-gray-400" />
               </button>
               {isCountryOpen && (
                    <div className="absolute top-full left-0 xl:left-auto xl:right-0 mt-3 w-48 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl shadow-black/10 z-50 overflow-hidden border border-gray-100 dark:border-white/5 p-2">
                        {AVAILABLE_COUNTRIES.map(country => (
                            <button key={country} onClick={() => { setSelectedCountry(country); setIsCountryOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl flex justify-between text-gray-700 dark:text-gray-300 transition-colors">
                                {country} {selectedCountry === country && <Check size={14} className="text-brand-purple" />}
                            </button>
                        ))}
                    </div>
                 )}
            </div>
         </div>

         <div className="relative z-10">
             {dashboardPage === 'discover' && selectedCategory === 'All' && !searchTerm && <FeaturedCarousel events={events} />}

             <DashboardControls 
               viewMode={viewMode} setViewMode={setViewMode} onSearch={setSearchTerm}
               dateFilter={dateFilter} setDateFilter={setDateFilter}
             />

             {filteredEvents.length === 0 ? (
               <div className="text-center py-32 opacity-50">
                   <div className="w-20 h-20 bg-gray-200 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Search size={32} className="text-gray-400" />
                   </div>
                   <h3 className="text-lg font-bold">No events found</h3>
                   <p className="text-sm">Try adjusting your filters or search term.</p>
               </div>
             ) : (
               viewMode === 'list' 
                ? <TimelineEventList events={filteredEvents} onSelect={setSelectedEvent} onToggleInterest={handleToggleInterest} />
                : <GridEventList events={filteredEvents} onSelect={setSelectedEvent} onToggleInterest={handleToggleInterest} />
             )}
         </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#050505] font-sans transition-colors duration-500 flex selection:bg-brand-purple selection:text-white">
       <DashboardSidebar 
         currentPage={dashboardPage} onNavigate={setDashboardPage} 
         onOpenSettings={() => setIsSettingsOpen(true)} onOpenSupport={() => setIsSupportOpen(true)} 
         isMobileOpen={isMobileMenuOpen} onCloseMobile={() => setIsMobileMenuOpen(false)}
         onCreateEvent={openCreateDialog}
       />
       
       <div className="flex-1 lg:ml-72 min-h-screen flex flex-col relative z-0">
          <DashboardHeader 
            title={dashboardPage === 'interest' ? 'My Interest' : dashboardPage} user={user} notifications={notifications}
            onOpenSettings={() => setIsSettingsOpen(true)} onNavigate={setDashboardPage} onMarkAllRead={() => setNotifications(prev => prev.map(n => ({...n, isRead:true})))}
          />
          <main className="flex-1 animate-in fade-in duration-500 pb-12">{renderContent()}</main>
          <Footer currentTheme={theme} setTheme={setTheme} variant="dashboard" />
       </div>
       
       <button 
        onClick={() => setIsMobileMenuOpen(true)} 
        className="lg:hidden fixed bottom-6 right-6 z-50 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-transform"
       >
        <Menu />
       </button>
       
       <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={user} onSaveUser={setUser} />
       <SupportDialog isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
       
       <EventDetailDialog 
         event={selectedEvent} 
         currentUser={user}
         onClose={() => setSelectedEvent(null)} 
         onToggleInterest={handleToggleInterest} 
         onEdit={openEditDialog}
         onDelete={handleDeleteEvent}
         onRegister={handleRegisterEvent}
         onUnregister={handleUnregisterEvent}
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
};

export default DashboardApp;