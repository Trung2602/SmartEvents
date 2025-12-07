import React from 'react';
import { Event } from '../types';
import EventCard from './EventCard';

interface GridEventListProps {
  events: Event[];
  onSelect: (e: Event) => void;
  onToggleInterest: (id: string) => void;
}

const GridEventList: React.FC<GridEventListProps> = ({ events, onSelect, onToggleInterest }) => {
  // Group by date logic
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.dateStr]) acc[event.dateStr] = [];
    acc[event.dateStr].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return (
    <div className="space-y-10">
      {Object.entries(groupedEvents).map(([date, groupEvents]: [string, Event[]]) => (
        <div key={date}>
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{date}</h3>
            <div className="h-[1px] flex-1 bg-gray-200 dark:bg-white/10"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {groupEvents.map(event => (
              <EventCard 
                key={event.id} 
                event={event} 
                variant="dashboard" 
                onClick={() => onSelect(event)} 
                onToggleInterest={(e) => { e?.stopPropagation(); onToggleInterest(event.id); }} 
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridEventList;