'use client';

import { useState } from 'react';
import { FEATURED_EVENTS } from '@/lib/constants';
import { Check, ChevronDown } from 'lucide-react';
import { Theme } from '@/lib/types';

    interface ChannelPageProps {
        channelId?: string;
        theme?: Theme;
        setTheme?: (theme: Theme) => void;
    }

    interface Channel {
        id: string;
        name: string;
        type: string;
        followers: number;
        discription: string;
    }

export default function ChannelPage({ channelId, theme, setTheme }: ChannelPageProps) {
    const [myChannels, setMyChannels] = useState<Channel[]>([]);
    const [events] = useState(FEATURED_EVENTS);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [isMoreCatOpen, setIsMoreCatOpen] = useState(false);

    const ALL_CATEGORIES = ['All', 'Music', 'Tech', 'Art', 'Gaming'];
    const visibleCategories = ALL_CATEGORIES.slice(0, 3);
    const hiddenCategories = ALL_CATEGORIES.filter(c => !visibleCategories.includes(c));

    const handleCategorySelect = (cat: string) => {
    setSelectedCategory(cat);
    setIsMoreCatOpen(false);
    };

    return (
    <div className="flex-1 p-6 max-w-7xl mx-auto">
        {/* My Channels + Subscribe Button */}
        <div className="mb-8 border-b pb-6">
        <h2 className="text-lg font-semibold mb-4">My Channels</h2>

        {myChannels.length > 0 ? (
        <div className="flex flex-wrap gap-3 mb-4">
            {myChannels.map(channel => (
            <div
                key={channel.id}
                className="p-3 border rounded bg-gray-50 dark:bg-[#111] flex-1 min-w-[150px]"
            >
                <h4 className="font-medium">{channel.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-300">
                {channel.discription} discription
                </p>
            </div>
            ))}
        </div>
        ) : (
        <p className="text-gray-500 dark:text-gray-400 mb-4">
            You don't have your own channel yet
        </p>
        )}

        <button
        onClick={() => null } // Thay bằng hàm tạo channel của bạn
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
        Create a Channel
        </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 mb-6">
        {visibleCategories.map(cat => (
            <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-sm ${selectedCategory === cat ? 'bg-black text-white' : 'bg-gray-100 dark:bg-white/5'}`}
            >
            {cat}
            </button>
        ))}

        <div className="relative">
            <button
            onClick={() => setIsMoreCatOpen(!isMoreCatOpen)}
            className="px-3 py-1 rounded bg-gray-100 dark:bg-white/5 flex items-center gap-1"
            >
            More <ChevronDown size={14} />
            </button>
            {isMoreCatOpen && (
            <div className="absolute top-full mt-2 w-36 bg-white dark:bg-[#1a1a1a] border rounded shadow">
                {hiddenCategories.map(cat => (
                <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-white/5 flex justify-between items-center"
                >
                    {cat}
                    {selectedCategory === cat && <Check size={14} className="float-right" />}
                </button>
                ))}
            </div>
            )}
        </div>
        </div>

        {/* Events */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, idx) => (
            <div key={idx} className="p-4 border rounded shadow-sm bg-white dark:bg-[#0a0a0a]">
            <h3 className="font-semibold">{event.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300">{event.date}</p>
            </div>
        ))}
        </div>
    </div>
    );
}
