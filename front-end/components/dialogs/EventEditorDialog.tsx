'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
import { X, Calendar, MapPin, Upload, Image as ImageIcon, Search, Plus, ChevronDown, Settings, Star, Users } from 'lucide-react';
import { Event, UserProfile } from '@/lib/types';
import { MOCK_PAGES, MOCK_USERS } from '@/lib/services/mockData';
import { AuthContext } from '@/context/AuthContext';
import { Calendar24 } from '../common/Calandar24';
import { Combobox, ComboboxOption } from '../ui/combobox';
import { CATEGORIES } from '@/lib/constants';
import { Input } from '../common/input';
import { eventApi } from '@/lib/api/event';

interface EventEditorDialogProps {
    event?: Event | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (event: Event) => void;
}

const ALL_CATEGORIES = ['Music', 'Tech', 'Art', 'Gaming', 'Education', 'Business', 'Food', 'Sports', 'Health', 'Fashion'];

const countriesData = {
    vietnam: {
        name: "Việt Nam",
        cities: ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Nha Trang", "Huế"],
    },
    thailand: {
        name: "Thái Lan",
        cities: ["Bangkok", "Chiang Mai", "Phuket", "Pattaya", "Krabi", "Ayutthaya"],
    },
    singapore: {
        name: "Singapore",
        cities: ["Singapore"],
    },
    malaysia: {
        name: "Malaysia",
        cities: ["Kuala Lumpur", "Penang", "Johor Bahru", "Malacca", "Ipoh"],
    },
    indonesia: {
        name: "Indonesia",
        cities: ["Jakarta", "Bali", "Bandung", "Surabaya", "Yogyakarta", "Medan"],
    },
    philippines: {
        name: "Philippines",
        cities: ["Manila", "Cebu", "Davao", "Quezon City", "Makati", "Boracay"],
    },
}

const CURRENCIES = ['USD', 'VND', 'EUR', 'JPY', 'GBP'];

export default function EventEditorDialog({ event, isOpen, onClose, onSave }: EventEditorDialogProps) {

    const { user } = useContext(AuthContext)

    const [formData, setFormData] = useState<Partial<Event>>({
        title: '',
        category: 'Music',
        imageUrl: '',
        price: 'Free',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        countryCode: 'Global',
        organizerName: user?.name || '',
        organizerAvatar: user?.avatarUrl || '',
        organizerId: user?.uuid,
        organizerType: 'user',
        coHosts: [],
        currentParticipants: 0,
        isLiked: false,
        isOwner: true,
        showParticipants: true,
        showReviews: true 
    });

    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [isOrganizerDropdownOpen, setIsOrganizerDropdownOpen] = useState(false);
    const [isCoHostSearchOpen, setIsCoHostSearchOpen] = useState(false);
    const [coHostSearchTerm, setCoHostSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);
    const organizerRef = useRef<HTMLDivElement>(null);
    const coHostRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [selectedCountry, setSelectedCountry] = useState<string>("");
    const [selectedCity, setSelectedCity] = useState<string>("");
    const [selectedCurrency, setSelectedCurrency] = useState<string>("");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [isFree, setIsFree] = useState<boolean>(false);
    const [price, setPrice] = useState<string>("");

    useEffect(() => {
        if (isOpen) {
            setSelectedCity("")
            setSelectedCountry("")
            setIsFree(false)
            setSelectedCurrency("")
            setPrice("")
            if (event) {
                // event = await eventApi.get(event.uuid);
                setFormData({ ...event });
                setMediaPreview(event.imageUrl);
            } else {
                setFormData({
                    uuid: Math.random().toString(36).substr(2, 9),
                    title: '',
                    category: 'Music',
                    imageUrl: '',
                    price: 'Free',
                    description: '',
                    startTime: '09:00',
                    endTime: '12:00',
                    location: '',
                    countryCode: 'Global',
                    organizerName: user?.name || '',
                    organizerAvatar: user?.avatarUrl || '',
                    organizerId: user?.uuid,
                    organizerType: 'user',
                    coHosts: [],
                    currentParticipants: 0,
                    isLiked: false,
                    isOwner: true
                });
                setMediaPreview(null);
            }
        }
    }, [isOpen, event, user]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (organizerRef.current && !organizerRef.current.contains(e.target as Node)) {
                setIsOrganizerDropdownOpen(false);
            }
            if (coHostRef.current && !coHostRef.current.contains(e.target as Node)) {
                setIsCoHostSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isOpen || !user) return null;

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

        const fileType = file.type.startsWith('video') ? 'video' : 'image';
        const url = URL.createObjectURL(file);
        setMediaPreview(url);
        setFormData(prev => ({ ...prev, imageUrl: url, imageType: fileType }));
    };

    const handleSettingsChange = (setting: string, value: boolean) => {
        setFormData(prev => ({
            ...prev,
            [setting]: value
        }));
    };

    const handleOrganizerSelect = (type: 'user' | 'page', id?: string) => {
        if (type === 'user') {
            setFormData(prev => ({
                ...prev,
                organizerName: user.name,
                organizerAvatar: user.avatarUrl,
                organizerId: user.uuid,
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

    const handleCountryChange = (value: string) => {
        setSelectedCountry(value)
        setSelectedCity("")
    }

    const addCoHost = (coHost: UserProfile) => {
        if (formData.coHosts?.find(c => c.email === coHost.email)) return;
        setFormData(prev => ({
            ...prev,
            coHosts: [...(prev.coHosts || []), coHost]
        }));
        setIsCoHostSearchOpen(false);
    };

    const removeCoHost = (username: string) => {
        setFormData(prev => ({
            ...prev,
            coHosts: prev.coHosts?.filter(c => c.email !== username)
        }));
    };

    const handleSave = () => {
        if (!formData.title || !formData.location || !formData.startTime) {
            alert("Please fill in required fields (Title, Location, Date)");
            return;
        }
        onSave(formData as Event);
        onClose();
    };

    const countryOptions: ComboboxOption[] = Object.entries(countriesData).map(([key, country]) => ({
        value: key,
        label: country.name,
    }));

    const cityOptions: ComboboxOption[] = selectedCountry
        ? countriesData[selectedCountry as keyof typeof countriesData].cities.map((city) => ({
            value: city,
            label: city,
        }))
        : [];

    const currencyOptions: ComboboxOption[] = CURRENCIES ? CURRENCIES.map(c => ({
        value: c,
        label: c
    })) : [];

    const categoryOptions: ComboboxOption[] = CATEGORIES ? CATEGORIES.map(c => ({
        value: c,
        label: c
    })) : [];

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#121212] w-full md:max-w-2xl h-full md:h-[90vh] md:rounded-3xl shadow-2xl relative flex flex-col overflow-hidden">

                {/* Header */}
                <div className="top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
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
                            <img src={mediaPreview} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                <Upload size={48} className="mb-2" />
                                <span>Click to upload Main Image/Gif</span>
                                <span className="text-xs opacity-70">Max 10MB &lt; 10s</span>
                            </div>
                        )}

                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="text-white font-medium flex items-center gap-2"><ImageIcon /> Change Media</span>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*,gif/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <div className="p-6 md:p-8 space-y-8">
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

                        {/* Date & Time */}
                        <div className="space-y-4 border-b border-gray-100 dark:border-white/5 pb-6">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Calendar size={18} /> Date & Time
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Calendar24 dateLabel='Start date' timeLabel='Start time' />
                                </div>
                                <div className="space-y-2">
                                    <Calendar24 dateLabel='End date' timeLabel='End time' />

                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <MapPin size={18} /> Location
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Country</label>
                                    <Combobox
                                        options={countryOptions}
                                        value={selectedCountry}
                                        onValueChange={handleCountryChange}
                                        placeholder='Choose the country'
                                        searchPlaceholder='Find country'
                                        emptyText='Cannot find the country'
                                    />
                                </div>
                                <div className="space-y-2 ">
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">City</label>
                                    <Combobox
                                        options={cityOptions}
                                        value={selectedCity}
                                        onValueChange={setSelectedCity}
                                        placeholder={selectedCountry ? "Choose city" : "Please choose country first"}
                                        searchPlaceholder="Find city"
                                        emptyText="Cannot find city"
                                        disabled={!selectedCountry}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Detailed Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g. 123 Main St, District 1"
                                    className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-purple/20 focus:border-brand-purple transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Hosts & Co-Hosts</h3>
                            <div className="flex flex-wrap gap-4 items-center">
                                <div className="relative" ref={organizerRef}>
                                    <button
                                        onClick={() => setIsOrganizerDropdownOpen(!isOrganizerDropdownOpen)}
                                        className="flex items-center gap-3 p-2 pr-5 rounded-full bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-white hover:bg-blue-100 transition-colors"
                                    >
                                        {formData.organizerAvatar && formData.organizerAvatar.length > 2 ? (
                                            <img src={formData.organizerAvatar} alt="Organizer" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-xs font-bold">
                                                {formData.organizerName?.substring(0, 2) || 'GU'}
                                            </div>
                                        )}
                                        <div className="text-left">
                                            <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{formData.organizerName}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{formData.organizerType === 'user' ? 'Me' : 'Page'} <ChevronDown size={10} className="inline" /></div>
                                        </div>
                                    </button>

                                    {isOrganizerDropdownOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1a1a1a] rounded-xl shadow-xl border border-gray-100 dark:border-white/10 z-50 overflow-hidden">
                                            <div className="p-2 text-xs text-gray-400 uppercase font-semibold">Post As</div>
                                            <button onClick={() => handleOrganizerSelect('user')} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 text-left">
                                                <img src={formData.organizerAvatar} alt="Organizer" className="w-10 h-10 rounded-full object-cover" />
                                                <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
                                            </button>
                                            {/* <div className="p-2 text-xs text-gray-400 uppercase font-semibold border-t border-gray-100 dark:border-white/5 mt-1">My Pages</div>
                                            {MOCK_PAGES.map(page => (
                                                <button key={page.id} onClick={() => handleOrganizerSelect('page', page.id)} className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 text-left">
                                                    <img src={page.avatarUrl} className="w-8 h-8 rounded-full" />
                                                    <span className="text-sm text-gray-900 dark:text-white">{page.name}</span>
                                                </button>
                                            ))} */}
                                        </div>
                                    )}

                                </div>

                                {formData.coHosts?.map(coHost => (
                                    <div key={coHost.email || coHost.uuid} className="flex items-center gap-3 p-2 pr-5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 relative group">
                                        {coHost.avatarUrl && coHost.avatarUrl.length > 2 ? (
                                            <img src={coHost.avatarUrl} className="w-10 h-10 rounded-full bg-gray-300" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                                                {coHost.name?.substring(0, 2) || 'GU'}
                                            </div>
                                        )}
                                        <div>
                                            <div className="text-sm font-bold text-gray-900 dark:text-white leading-none">{coHost.name}</div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Co-Host</div>
                                        </div>
                                        <button
                                            onClick={() => removeCoHost(coHost.email || '')}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}

                                <div className="relative" ref={coHostRef}>
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
                                                {MOCK_USERS.filter(u => u.email.includes(coHostSearchTerm) || u.name.toLowerCase().includes(coHostSearchTerm)).map(u => (
                                                    <button
                                                        key={u.uuid}
                                                        onClick={() => addCoHost(u)}
                                                        className="w-full flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg text-left"
                                                    >
                                                        {u.avatarUrl && u.avatarUrl.length > 2 ? (
                                                            <img src={u.avatarUrl} className="w-6 h-6 rounded-full" />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-[10px] font-bold">
                                                                {u.name.substring(0, 2)}
                                                            </div>
                                                        )}
                                                        <div className="truncate">
                                                            <div className="text-sm font-medium dark:text-white">{u.name}</div>
                                                            <div className="text-xs text-gray-500">{u.email}</div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">About Event</h3>
                            <textarea
                                ref={textareaRef}
                                name="description"
                                value={formData.description}
                                onChange={(e) => {
                                    handleInputChange(e);
                                    if (textareaRef.current) {
                                        textareaRef.current.style.height = 'auto';
                                        textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
                                    }
                                }}
                                placeholder="Tell people what makes your event special..."
                                rows={3}
                                className="w-full min-h-[100px] bg-gray-50 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 outline-none focus:border-brand-purple text-gray-900 dark:text-white resize-none overflow-hidden leading-relaxed transition-all"
                            />
                        </div>

                        {/* Category & Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex">
                            <div>
                                <label className="flex text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Category</label>
                                <Combobox
                                    options={categoryOptions}
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    placeholder='Choose category'
                                    emptyText='Cannot find category'
                                    searchPlaceholder='Find category'
                                />
                            </div>
                            <div>
                                <div className='flex items-center justify-between mb-1'>
                                    <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Price</label>
                                    {/* Free Toggle */}
                                    <div className="flex items-center gap-3">
                                        <label htmlFor="isFree" className="text-xs font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">Free Event</label>
                                        <div
                                            onClick={() => setIsFree(!isFree)}
                                            className={`w-8 h-4 rounded-full relative cursor-pointer transition-colors ${isFree ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                        >
                                            <div className={`absolute top-[2] w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200 ${isFree ? 'left-4' : 'left-1'}`}></div>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex justify-between space-x-3'>
                                    <Combobox
                                        options={currencyOptions}
                                        value={selectedCurrency}
                                        onValueChange={setSelectedCurrency}
                                        placeholder='Currency'
                                        emptyText='Cannot find currency'
                                        searchPlaceholder='Find currency'
                                        className='max-w-30'
                                        disabled={isFree}
                                    />
                                    <Input
                                        placeholder='Enter your price'
                                        value={price}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9.]/g, "");
                                            setPrice(value);
                                        }}
                                        disabled={!selectedCurrency || isFree}
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Other */}
                        <div className="space-y-2">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <Settings size={18} /> Other Settings
                            </h3>

                            {/* Show Participants */}
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                                        <Users size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Show Participants Count</div>
                                        <div className="text-xs text-gray-500">Allow everyone to see how many people are going</div>
                                    </div>
                                </div>
                                <div
                                    onClick={() => handleSettingsChange('showParticipants', !(formData?.showParticipants))}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData?.showParticipants ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200 ${formData?.showParticipants ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>

                            {/* Show Reviews */}
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-lg">
                                        <Star size={16} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">Show Reviews</div>
                                        <div className="text-xs text-gray-500">Enable reviews and ratings for this event</div>
                                    </div>
                                </div>
                                <div
                                    onClick={() => handleSettingsChange('showReviews', !(formData?.showReviews))}
                                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${formData?.showReviews ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 rounded-full bg-white shadow-sm transition-all duration-200 ${formData?.showReviews ? 'left-6' : 'left-1'}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

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
}

