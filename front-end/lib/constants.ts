import { Event, Notification, UserProfile } from './types';

// Helper to get relative dates for demo purposes
const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const FEATURED_EVENTS: Event[] = [
  {
    uuid: '1',
    title: 'Summer Music Festival',
    startTime: formatDate(today)+"T18:00",
    endTime: formatDate(today)+"T22:00",
    location: "Central Park, New York",
    countryCode: "USA",
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1663028055174-6281c778f81b?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'The biggest indie music festival of the season featuring top artists.',
    "organizerName": "Vibe Nation",
    "organizerAvatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=Vibe",
    price: '$45',
    status: 'upcoming',
    //attendeesCount: 342
  },
  {
    uuid: '2',
    title: 'Tech Conference 2024',
    description: 'Annual gathering of tech enthusiasts, founders, and VCs.',
    startTime: formatDate(today)+'T09:00',
    endTime: formatDate(today)+'T17:00',
    countryCode: "USA",

    location: 'Convention Center, SF',
    imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'TechCrunch',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tech',
    category: 'Tech',
    price: '$299',
    status: 'full',
    currentParticipants: 1250
  },
  {
    uuid: '3',
    title: 'Art Exhibition Opening',
    description: 'Contemporary art showcase "Future Past" by local artists.',
    startTime: formatDate(tomorrow)+'T19:00',
    endTime: formatDate(tomorrow)+'T21:00',
    countryCode: "USA",
    location: 'Modern Art Museum, LA',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    organizerName: 'MOMA',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Art',
    category: 'Art',
    price: 'Free',
    status: 'upcoming',
    currentParticipants: 218
  },
  {
    uuid: '4',
    title: 'Gaming Tournament Finals',
    startTime: formatDate(tomorrow)+'T14:00',
    endTime: formatDate(tomorrow)+'T20:00',
    location: 'Esports Arena, Las Vegas',
    countryCode: "USA",
    category: 'Gaming',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'ESL',
    organizerAvatar: 'https://i.pravatar.cc/100?img=4',
    price: '$50',
    description: 'Watch the top teams battle it out for the championship trophy.',
    currentParticipants: 5000,
    "isLiked": false
  },
  {
    uuid: '5',
    title: 'Past Coding Bootcamp',
    startTime: formatDate(nextWeek)+'T10:00',
    endTime: formatDate(nextWeek)+'T16:00',
    location: 'Online',
    countryCode: "USA",
    category: 'Education',
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'CodeAcademy',
    organizerAvatar: 'https://i.pravatar.cc/100?img=5',
    price: 'Free',
    isEnded: true,
    currentParticipants: 120,
    isLiked: false
  },
  {
    uuid: '6',
    title: 'Sunset Yoga',
    description: 'End your day with a relaxing flow by the beach.',
    startTime: formatDate(today)+'T17:30',
    endTime: formatDate(today)+'T18:30',
    countryCode: "USA",
    location: 'Santa Monica Beach',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
    organizerName: 'Zen Yoga',
    organizerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yoga',
    category: 'Wellness',
    price: 'Free',
    status: 'ended',
    currentParticipants: 45
  }
];

export const CATEGORIES = ['All', 'Tech', 'Art', 'Social', 'Workshop', 'Wellness', 'Music', 'Gaming'];

// Updated NAV_ITEMS with IDs for internal routing
export const NAV_ITEMS = [
  { label: 'Community', id: 'community', href: '#' },
  { label: 'Download', id: 'download', href: '#download' }
];

export const REVIEWS = [
  {
    id: '1',
    eventId: '6',
    userId: '101',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    rating: 5,
    comment: 'Absolutely magical experience! The sunset view was breathtaking.',
    createdAt: '2023-11-16'
  },
  {
    id: '2',
    eventId: '6',
    userId: '102',
    userName: 'Mike Chen',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    rating: 4,
    comment: 'Great instructor, but it was a bit windy.',
    createdAt: '2023-11-16'
  }
];

export const COMMUNITY_POSTS = [
  {
    id: '1',
    author: {
      name: 'Alex Rivera',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    content: 'Does anyone have extra tickets for the Summer Music Festival?',
    likes: 12,
    comments: 4,
    timeAgo: '2h ago',
    category: 'Tickets'
  },
  {
    id: '2',
    author: {
      name: 'Jessica Wu',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jess'
    },
    content: 'Just came back from the Tech Conference. The AI panel was mind-blowing! 🤯',
    likes: 45,
    comments: 18,
    timeAgo: '5h ago',
    category: 'Discussion'
  },
  {
    id: '3',
    author: {
      name: 'David Miller',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dave'
    },
    content: 'Looking for a group to go to the Gaming Tournament this weekend.',
    likes: 8,
    comments: 12,
    timeAgo: '1d ago',
    category: 'Social'
  }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Ticket Confirmed',
    message: 'You have successfully booked tickets for Tech Conference 2024.',
    time: '2 mins ago',
    isRead: false,
    type: 'success'
  },
  {
    id: '2',
    title: 'Event Reminder',
    message: 'Summer Music Festival starts tomorrow at 18:00.',
    time: '1 hour ago',
    isRead: false,
    type: 'info'
  },
  {
    id: '3',
    title: 'New Event Nearby',
    message: 'A new Art Exhibition has been scheduled near your location.',
    time: '5 hours ago',
    isRead: true,
    type: 'info'
  },
  {
    id: '4',
    title: 'Payment Update',
    message: 'Your payment method is about to expire.',
    time: '1 day ago',
    isRead: true,
    type: 'warning'
  }
];