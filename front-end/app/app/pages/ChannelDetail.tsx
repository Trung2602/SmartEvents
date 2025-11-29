  'use client';

  import { useState } from "react";
  import Calendar from "react-calendar"; // npm i react-calendar
  import 'react-calendar/dist/Calendar.css';

  interface Event {
  id: string;
  title: string;
  date: string;
  }

  interface ChannelDetailProps {
  channel: {
    name: string;
    type: string;
    followers: number;
    coverImage: string;
    avatar: string;
  };
  events: Event[];
  }

  export default function ChannelDetail({ channel, events }: ChannelDetailProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cover Image */}
      <div className="relative">
        <img
          src={channel.coverImage}
          alt="Cover"
          className="w-full h-56 object-cover rounded-b"
        />
        {/* Avatar + info */}
        <div className="absolute -bottom-12 left-6 flex items-center gap-4">
          <img
            src={channel.avatar}
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900"
          />
          <div className="bg-white dark:bg-[#111] p-4 rounded shadow w-[400px]">
            <h2 className="text-xl font-semibold">{channel.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{channel.type}</p>
            <p className="text-gray-500 dark:text-gray-400">
              {channel.followers.toLocaleString()} followers
            </p>
          </div>
        </div>
      </div>

      {/* Spacer để không che avatar */}
      <div className="h-16"></div>

      {/* Content: Events + Calendar */}
      <div className="flex gap-6">
        {/* Events - 2/3 width */}
        <div className="flex-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map(event => (
            <div
              key={event.id}
              className="p-4 border rounded shadow-sm bg-white dark:bg-[#0a0a0a]"
            >
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">{event.date}</p>
            </div>
          ))}
        </div>

        {/* Calendar - 1/3 width */}
        <div className="flex-1">
          <Calendar
            onChange={(date) => setSelectedDate(date as Date)}
            value={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
