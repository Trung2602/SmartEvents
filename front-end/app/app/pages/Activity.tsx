import { ActivityTab, Event } from "@/lib/types";
import { format } from "date-fns";
import { CalendarIcon, CheckCircle2, Clock, MapPin, Search, XCircle } from "lucide-react";
import { useState } from "react";


export default function Activity() {

    const [events, setEvents] = useState<Event[]>([]);
    const [activityTab, setActivityTab] = useState<ActivityTab>('registered');
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    let activityEvents: Event[] = [];
    let pastRegisteredEvents: Event[] = [];

    const sortEventsByDate = (a: Event, b: Event) => {
        const currentYear = new Date().getFullYear();
        const dateA = new Date(a.startTime);
        const dateB = new Date(b.startTime);
        return dateA.getTime() - dateB.getTime();
    };

    switch (activityTab) {
        case 'registered':
            activityEvents = events.filter(e => e.isRegistered && !e.isEnded).sort(sortEventsByDate);
            pastRegisteredEvents = events.filter(e => e.isRegistered && e.isEnded);
            break;
        case 'attended':
            activityEvents = events.filter(e => e.isRegistered && e.isEnded && (e.hasCheckedIn !== false));
            break;
        case 'missed':
            activityEvents = events.filter(e => e.isRegistered && e.isEnded && e.hasCheckedIn === false);
            break;
        case 'cancelled':
            activityEvents = [];
            break;
    }

    const renderActivityItem = (event: Event, isDimmed: boolean = false) => {
        return (
            <div key={event.uuid} onClick={() => setSelectedEvent(event)} className={`bg-white dark:bg-[#121212] rounded-2xl border border-gray-100 dark:border-white/5 p-4 flex gap-4 items-center cursor-pointer hover:shadow-lg transition-all group ${isDimmed ? 'opacity-60 grayscale-[0.8] hover:opacity-100 hover:grayscale-0' : 'hover:-translate-y-1'}`}>
                <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                    <img src={event.imageUrl} className="w-full h-full object-cover" />
                    {/* Status Badge Overlay */}
                    {activityTab === 'registered' && !event.isEnded && (
                        <div className="absolute bottom-0 left-0 right-0 bg-brand-purple/90 text-white text-[10px] font-bold text-center py-1">UPCOMING</div>
                    )}
                    {activityTab === 'cancelled' && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                            <XCircle className="text-white" size={24} />
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className={`font-bold text-lg text-gray-900 dark:text-white truncate pr-2 ${activityTab === 'cancelled' ? 'line-through text-gray-400' : ''}`}>{event.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <CalendarIcon size={12} /> <span>{format(event.startTime, 'M dd')}</span>
                                <Clock size={12} /> <span>{event.startTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <MapPin size={12} /> <span className="truncate max-w-[200px]">{event.location}</span>
                            </div>
                        </div>

                        {/* Context Action Button based on tab */}
                        <div className="shrink-0">
                            {activityTab === 'registered' && !event.isEnded && (
                                <button className="p-2 rounded-full bg-gray-50 dark:bg-white/5 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors">
                                    <CheckCircle2 size={20} />
                                </button>
                            )}
                            {activityTab === 'cancelled' && (
                                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded">Cancelled</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-in fade-in duration-300">
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-8 bg-gray-100 dark:bg-white/5 p-1 rounded-2xl w-full sm:w-fit">
                {(['registered', 'attended', 'missed', 'cancelled'] as ActivityTab[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActivityTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activityTab === tab
                            ? 'bg-white text-black shadow-sm dark:bg-[#121212] dark:text-white'
                            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Content List */}
            <div className="space-y-6">

                {activityTab === 'registered' ? (
                    <>
                        {/* Upcoming Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">Upcoming Events</h2>
                            {activityEvents.length === 0 ? (
                                <div className="p-8 text-center border border-dashed border-gray-200 dark:border-white/10 rounded-2xl text-gray-400">
                                    No upcoming events.
                                </div>
                            ) : (
                                activityEvents.map(e => renderActivityItem(e))
                            )}
                        </div>

                        {/* Past Section */}
                        {pastRegisteredEvents.length > 0 && (
                            <div className="space-y-4 pt-8">
                                <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider pl-1">Past Events</h2>
                                {pastRegisteredEvents.map(e => renderActivityItem(e, true))}
                            </div>
                        )}
                    </>
                ) : (
                    // Other Tabs (Simple List)
                    <div className="space-y-4">
                        {activityEvents.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center text-gray-400">
                                <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                    <Search size={24} />
                                </div>
                                <p>No events found in {activityTab}.</p>
                            </div>
                        ) : (
                            activityEvents.map(e => renderActivityItem(e))
                        )}
                    </div>
                )}

            </div>
        </div>
    );
}