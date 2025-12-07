import React, { useState, useRef, useEffect } from 'react';
import { X, Calendar, MapPin, Upload, Play, Image as ImageIcon, Search, Plus, Trash2, ChevronDown } from 'lucide-react';
import { Event, UserProfile, ManagedPage } from '../../types';
import { MOCK_PAGES, MOCK_USERS } from '../../services/mockData';

interface EventEditorDialogProps {
  event?: Event | null; // If null, we are in create mode
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Event) => void;
}

const ALL_CATEGORIES = ['Music', 'Tech', 'Art', 'Gaming', 'Education', 'Business', 'Food', 'Sports', 'Health', 'Fashion'];
const COUNTRIES = ['USA', 'UK', 'Canada', 'Germany', 'France', 'Japan', 'Vietnam', 'Global'];

const EventEditorDialog: React.FC<EventEditorDialogProps> = ({ event, user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Event>>({
    title: '',
    category: 'Music',
    imageUrl: '',
    imageType: 'image',
    price: 'Free',
    description: '',
    dateStr: '',
    startTime: '',
    endTime: '',
    location: '',
    country: 'Global',
    organizerName: user.name,
    organizerAvatar: user.avatarUrl,
    organizerId: user.id,
    organizerType: 'user',
    coHosts: [],
    attendeesCount: 0,
    isLiked: false,
    isOwner: true
  });

  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isOrganizerDropdownOpen, setIsOrganizerDropdownOpen] = useState(false);
  const [isCoHostSearchOpen, setIsCoHostSearchOpen] = useState(false);
  const [coHostSearchTerm, setCoHostSearchTerm] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormData({ ...event });
        setMediaPreview(event.imageUrl);
      } else {
        // Reset for create mode
        setFormData({
            id: Math.random().toString(36).substr(2, 9),
            title: '',
            category: 'Music',
            imageUrl: '',
            imageType: 'image',
            price: 'Free',
            description: '',
            dateStr: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' }),
            startTime: '09:00',
            endTime: '12:00',
            location: '',
            country: 'Global',
            organizerName: user.name,
            organizerAvatar: user.avatarUrl,
            organizerId: user.id,
            organizerType: 'user',
            coHosts: [],
            attendeesCount: 0,
            isLiked: false,
            isOwner: true
        });
        setMediaPreview(null);
      }
    }
  }, [isOpen, event, user]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    // Determine type
    const fileType = file.type.startsWith('video') ? 'video' : 'image';
    
    // Create local URL for preview
    const url = URL.createObjectURL(file);
    setMediaPreview(url);
    setFormData(prev => ({ ...prev, imageUrl: url, imageType: fileType }));
  };

  const handleOrganizerSelect = (type: 'user' | 'page', id?: string) => {
    if (type === 'user') {
      setFormData(prev => ({
        ...prev,
        organizerName: user.name,
        organizerAvatar: user.avatarUrl,
        organizerId: user.id,
        organizerType: 'user'
      }));
    } else {
      const page = MOCK_PAGES.find(p => p.id === id);
      if (page) {
        setFormData(prev => ({
            ...prev,
            organizerName: page.name,
            organizerAvatar: page.avatarUrl,
            organizerId: page.id,
            organizerType: 'page'
          }));
      }
    }
    setIsOrganizerDropdownOpen(false);
  };

  const addCoHost = (coHost: UserProfile) => {
    if (formData.coHosts?.find(c => c.username === coHost.username)) return;
    setFormData(prev => ({
      ...prev,
      coHosts: [...(prev.coHosts || []), coHost]
    }));
    setIsCoHostSearchOpen(false);
  };

  const removeCoHost = (username: string) => {
    setFormData(prev => ({
      ...prev,
      coHosts: prev.coHosts?.filter(c => c.username !== username)
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.location || !formData.dateStr) {
      alert("Please fill in required fields (Title, Location, Date)");
      return;
    }
    onSave(formData as Event);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#121212] w-full md:max-w-2xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/50 to-transparent">
             <span className="text-white font-bold px-4">{event ? 'Edit Event' : 'Create Event'}</span>
             <button onClick={onClose} className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md">
                <X size={20} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto scroll-smooth no-scrollbar">
            {/* Media Upload Section */}
            <div 
                className="relative h-72 md:h-80 w-full shrink-0 bg-gray-100 dark:bg-[#1a1a1a] cursor-pointer group"
                onClick={() => fileInputRef.current?.click()}
            >
                {mediaPreview ? (
                    formData.imageType === 'video' ? (
                         <video src={mediaPreview} className="w-full h-full object-cover" autoPlay muted loop />
                    ) : (
                         <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                    )
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                        <Upload size={48} className="mb-2"/>
                        <span>Click to upload Main Image/Video</span>
                        <span className="text-xs opacity-70">Max 10MB, Video &lt; 10s</span>
                    </div>
                )}
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white font-medium flex items-center gap-2"><ImageIcon /> Change Media</span>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*" 
                    onChange={handleFileChange}
                />
            </div>

            <div className="p-6 md:p-8 space-y-8">
                 {/* Title Input */}
                 <div>
                    <input 
                        type="text" 
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Event Title"
                        className="w-full text-3xl md:text-4xl font-bold text-gray-900 dark:text-white bg-transparent border-b border-gray-200 dark:border-white/10 focus:border-brand-purple outline-none pb-2 placeholder-gray-300 dark:placeholder-gray-700"
                    />
                 </div>

                 {/* Meta Data Inputs */}
                 <div className="flex flex-col sm:flex-row gap-6 border-b border-gray-100 dark:border-white/5 pb-6">
                    {/* Time & Date */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-white/5">
                            <Calendar size={24} />
                        </div>
                        <div className="w-full">
                            <input 
                                type="text" 
                                name="dateStr"
                                value={formData.dateStr}
                                onChange={handleInputChange}
                                placeholder="Date (e.g. July 23)"
                                className="w-full font-bold text-gray-900 dark:text-white text-lg bg-transparent outline-none mb-1 border-b border-transparent focus:border-brand-purple"
                            />
                            <div className="flex items-center gap-2">
                                <input 
                                    type="time" 
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-sm text-gray-500 dark:text-gray-400 outline-none"
                                />
                                <span>-</span>
                                <input 
                                    type="time" 
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    className="bg-transparent text-sm text-gray-500 dark:text-gray-400 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl text-gray-900 dark:text-white shadow-sm border border-gray-100 dark:border-white/5">
                            <MapPin size={24} />
                        </div>
                        <div className="w-full space-y-2">
                            <select 
                                name="country" 
                                value={formData.country} 
                                onChange={handleInputChange}
                                className="w-full text-sm font-medium text-gray-500 dark:text-gray-400 bg-transparent outline-none cursor-pointer"
                            >
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <input 
                                type="text" 
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Specific Location"
                                className="w-full font-bold text-gray-900 dark:text-white text-lg bg-transparent outline-none border-b border-transparent focus:border-brand-purple"
                            />
                        </div>
                    </div>
                 </div>

                 {/* Hosts Section */}
                 <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Hosts & Co-Hosts</h3>
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Main Organizer Select */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsOrganizerDropdownOpen(!isOrganizerDropdownOpen)}
                                className="flex items-center gap-3 p-2 pr-4 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 transition-colors"
                            >
                                <img src={formData.organizerAvatar || user.avatarUrl} alt="Organizer" className="w-10 h-10 rounded-full object-cover" />
                                <div className="text-left">
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{formData.organizerName}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{formData.organizerType === 'user' ? 'Me' : 'Page'} <ChevronDown size={10} className="inline"/></div>
                                </div>
                            </button>
                            
                            {isOrganizerDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                                    <div className="p-2 text-xs text-gray-400 uppercase font-semibold">Post As</div>
                                    <button onClick={() => handleOrganizerSelect('user')} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 text-left">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold">{user.avatarUrl.substring(0,2)}</div>
                                        <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                                    </button>
                                    <div className="p-2 text-xs text-gray-400 uppercase font-semibold border-t border-gray-100 dark:border-white/5 mt-1">My Pages</div>
                                    {MOCK_PAGES.map(page => (
                                         <button key={page.id} onClick={() => handleOrganizerSelect('page', page.id)} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 text-left">
                                            <img src={page.avatarUrl} className="w-8 h-8 rounded-full" />
                                            <span className="text-sm text-gray-900 dark:text-white">{page.name}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Co-Hosts List */}
                        {formData.coHosts?.map(coHost => (
                             <div key={coHost.username} className="flex items-center gap-3 p-2 pr-2 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative group">
                                <img src={coHost.avatarUrl} className="w-10 h-10 rounded-full bg-gray-300" />
                                <div>
                                    <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{coHost.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Co-Host</div>
                                </div>
                                <button 
                                    onClick={() => removeCoHost(coHost.username)}
                                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}

                        {/* Add Co-Host Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsCoHostSearchOpen(!isCoHostSearchOpen)}
                                className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 hover:text-brand-purple hover:border-brand-purple transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                            {isCoHostSearchOpen && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 p-3">
                                    <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-lg px-2 py-1.5 mb-2">
                                        <Search size={14} className="text-gray-400 mr-2" />
                                        <input 
                                            autoFocus
                                            placeholder="Search username..." 
                                            className="bg-transparent text-sm w-full outline-none dark:text-white"
                                            value={coHostSearchTerm}
                                            onChange={(e) => setCoHostSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="max-h-40 overflow-y-auto space-y-1">
                                        {MOCK_USERS.filter(u => u.username.includes(coHostSearchTerm) || u.name.toLowerCase().includes(coHostSearchTerm)).map(u => (
                                            <button 
                                                key={u.id} 
                                                onClick={() => addCoHost(u)}
                                                className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-left"
                                            >
                                                <img src={u.avatarUrl} className="w-6 h-6 rounded-full" />
                                                <div className="truncate">
                                                    <div className="text-sm font-medium dark:text-white">{u.name}</div>
                                                    <div className="text-xs text-gray-500">{u.username}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* Description */}
                 <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">About Event</h3>
                    <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe your event..."
                        className="w-full h-40 bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-brand-purple text-gray-900 dark:text-white resize-none"
                    />
                 </div>

                 {/* Extra Fields (Category, Price) */}
                 <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Category</label>
                        <select 
                            name="category" 
                            value={formData.category} 
                            onChange={handleInputChange}
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none dark:text-white"
                        >
                            {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Price</label>
                        <input 
                            type="text" 
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Free or $Amount"
                            className="w-full p-3 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 outline-none dark:text-white"
                        />
                     </div>
                 </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-white dark:bg-[#121212] flex justify-end gap-3 z-40 shrink-0">
             <button onClick={onClose} className="px-6 py-3 rounded-full font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5">
                Cancel
             </button>
             <button onClick={handleSave} className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold hover:bg-purple-600 shadow-lg flex items-center gap-2">
                <Calendar size={18} />
                {event ? 'Update Event' : 'Publish Event'}
             </button>
        </div>
      </div>
    </div>
  );
};

export default EventEditorDialog;