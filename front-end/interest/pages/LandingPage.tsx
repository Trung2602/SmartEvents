import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventCard from '../components/EventCard';
import DownloadSection from '../components/DownloadSection';
import Footer from '../components/Footer';
import { Theme, Event } from '../types';
import { generateAIRecommendedEvents } from '../services/geminiService';
import { fetchEvents } from '../services/dataService';

interface LandingPageProps {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ theme, setTheme }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Load some initial events for the landing page
    fetchEvents().then(events => {
      setFeaturedEvents(events.slice(0, 3));
    });
  }, []);

  const handleLandingSearch = async (term: string) => {
    setLoading(true);
    // Simulate the experience of "Generating"
    setTimeout(async () => {
      const newEvents = await generateAIRecommendedEvents(term);
      if (newEvents && newEvents.length > 0) {
        // Since we are using mock data now, we don't need to force default times/countries
        // unless they are missing.
        const adaptedEvents = newEvents.map(e => ({
          ...e,
          startTime: e.startTime || '12:00',
          endTime: e.endTime || '16:00',
          country: e.country || 'Global'
        }));
        setLoading(false);
        navigate('/app', { state: { searchResults: adaptedEvents } });
      } else {
        setLoading(false);
        navigate('/app');
      }
    }, 500); // Small extra delay for effect
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Navbar />
      <main>
        <Hero onSearch={handleLandingSearch} isGenerating={loading} />
        <section className="max-w-7xl mx-auto px-6 pb-20 pt-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Trending Events</h2>
            <button onClick={() => navigate('/app')} className="text-sm font-semibold hover:text-purple-500 transition-colors">Go to App →</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} variant="landing" />
              ))
            ) : (
              // Simple skeleton loading
              [1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-100 dark:bg-white/5 rounded-2xl animate-pulse"></div>
              ))
            )}
          </div>
        </section>
        <DownloadSection />
      </main>
      <Footer currentTheme={theme} setTheme={setTheme} />
    </div>
  );
};

export default LandingPage;
