import React from 'react';
import { X, Calendar, MapPin, Download } from 'lucide-react';
import { Event, UserProfile } from '../../types';

interface TicketDialogProps {
  event: Event;
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
}

const TicketDialog: React.FC<TicketDialogProps> = ({ event, user, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Generate a QR code URL (using a public API for demo purposes)
  const qrData = `Event:${event.id};User:${user.email}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1a1a1a] w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white z-10">
          <X size={24} />
        </button>

        {/* Header Image */}
        <div className="h-32 bg-gray-200 relative">
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#1a1a1a]"></div>
        </div>

        <div className="px-8 pb-8 -mt-12 relative">
          <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-lg border border-gray-100 dark:border-white/5 p-6 flex flex-col items-center text-center">
            
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">{event.title}</h2>
            <p className="text-xs text-brand-purple font-semibold uppercase tracking-wider mb-6">{event.category}</p>

            {/* QR Code */}
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 mb-6">
               <img src={qrUrl} alt="Ticket QR" className="w-40 h-40 object-contain" />
            </div>

            <div className="w-full space-y-4">
               <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-500">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{event.dateStr}</div>
                    <div className="text-xs text-gray-500">{event.startTime}</div>
                  </div>
               </div>
               
               <div className="flex items-center gap-3 text-left">
                  <div className="p-2 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{event.location}</div>
                    <div className="text-xs text-gray-500">{event.country || 'Global'}</div>
                  </div>
               </div>
            </div>

            <div className="w-full mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-gray-500">Ticket Holder</span>
                   <span className="font-bold text-gray-900 dark:text-white">{user.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm mt-2">
                   <span className="text-gray-500">Price</span>
                   <span className="font-bold text-gray-900 dark:text-white">{event.price}</span>
                </div>
            </div>

            <button className="w-full mt-6 bg-brand-purple text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors">
               <Download size={16} /> Save Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDialog;